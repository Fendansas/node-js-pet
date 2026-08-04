import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../repositories/person.repository.js', () => ({
    default: {
        findAll: vi.fn(),
        findById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn()
    }
}));

vi.mock('../../../services/face.service.js', () => ({
    default: {
        scanImage: vi.fn()
    }
}));

import personRepository from '../../../repositories/person.repository.js';
import faceService from '../../../services/face.service.js';
import PersonService from '../../../services/person.service.js';

describe('PersonService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('create', () => {
        it('creates person with extracted embedding', async () => {
            faceService.scanImage.mockResolvedValue([
                { embedding: [1, 0, 0], bbox: [0, 0, 10, 10] }
            ]);
            personRepository.create.mockImplementation(data => Promise.resolve({ _id: 'p1', ...data }));

            const result = await PersonService.create({ name: 'Стрелок', imageUrl: '/uploads/persons/a.jpg', createdBy: 'u1' });

            expect(faceService.scanImage).toHaveBeenCalled();
            expect(personRepository.create).toHaveBeenCalledWith({
                name: 'Стрелок',
                createdBy: 'u1',
                photos: [{ imageUrl: '/uploads/persons/a.jpg', embedding: [1, 0, 0] }]
            });
            expect(result._id).toBe('p1');
        });

        it('throws NO_FACE_FOUND when no face detected', async () => {
            faceService.scanImage.mockResolvedValue([]);

            await expect(
                PersonService.create({ name: 'X', imageUrl: '/uploads/person/b.jpg', createdBy: 'u1' })
            ).rejects.toThrow('NO_FACE_FOUND');
            expect(personRepository.create).not.toHaveBeenCalled();
        });

        it('propagates FACE_SERVICE_ERROR from scanner', async () => {
            const err = new Error('FACE_SERVICE_ERROR');
            err.code = 'FACE_SERVICE_ERROR';
            faceService.scanImage.mockRejectedValue(err);

            await expect(
                PersonService.create({ name: 'X', imageUrl: '/uploads/person/c.jpg', createdBy: 'u1' })
            ).rejects.toThrow('FACE_SERVICE_ERROR');
        });
    });

    describe('addPhoto', () => {
        it('throws PERSON_NOT_FOUND for missing person', async () => {
            personRepository.findById.mockResolvedValue(null);

            await expect(
                PersonService.addPhoto('p1', '/uploads/person/d.jpg')
            ).rejects.toThrow('PERSON_NOT_FOUND');
        });

        it('appends photo to person', async () => {
            personRepository.findById.mockResolvedValue({
                _id: 'p1', photos: [{ imageUrl: '/uploads/person/old.jpg', embedding: [0] }]
            });
            faceService.scanImage.mockResolvedValue([{ embedding: [9, 9] }]);

            await PersonService.addPhoto('p1', '/uploads/person/new.jpg');

            expect(personRepository.update).toHaveBeenCalledWith('p1', {
                photos: [
                    { imageUrl: '/uploads/person/old.jpg', embedding: [0] },
                    { imageUrl: '/uploads/person/new.jpg', embedding: [9, 9] }
                ]
            });
        });
    });

    describe('deletePhoto', () => {
        it('removes photo at index', async () => {
            personRepository.findById.mockResolvedValue({
                _id: 'p1',
                photos: [
                    { imageUrl: '/uploads/person/a.jpg', embedding: [1] },
                    { imageUrl: '/uploads/person/b.jpg', embedding: [2] }
                ]
            });

            await PersonService.deletePhoto('p1', 0);

            expect(personRepository.update).toHaveBeenCalledWith('p1', {
                photos: [{ imageUrl: '/uploads/person/b.jpg', embedding: [2] }]
            });
        });

        it('throws PHOTO_NOT_FOUND when index is out of range', async () => {
            personRepository.findById.mockResolvedValue({ _id: 'p1', photos: [] });

            await expect(PersonService.deletePhoto('p1', 3)).rejects.toThrow('PHOTO_NOT_FOUND');
        });
    });

    describe('delete', () => {
        it('removes person', async () => {
            personRepository.findById.mockResolvedValue({ _id: 'p1', photos: [] });

            await PersonService.delete('p1');

            expect(personRepository.delete).toHaveBeenCalledWith('p1');
        });

        it('throws PERSON_NOT_FOUND for missing person', async () => {
            personRepository.findById.mockResolvedValue(null);

            await expect(PersonService.delete('p1')).rejects.toThrow('PERSON_NOT_FOUND');
        });
    });
});