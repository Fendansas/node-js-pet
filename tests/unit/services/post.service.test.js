import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../repositories/post.repository.js', () => ({
    default: {
        findById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        findAllSorted: vi.fn(),
    }
}));

import postRepository from '../../../repositories/post.repository.js';
import PostService from '../../../services/post.service.js';

describe('PostService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getById', () => {
        it('should throw POST_NOT_FOUND', async () => {
            postRepository.findById.mockResolvedValue(null);
            await expect(PostService.getById('missing')).rejects.toThrow('POST_NOT_FOUND');
        });

        it('should return post', async () => {
            postRepository.findById.mockResolvedValue({ _id: 'p1', title: 'Test' });
            const result = await PostService.getById('p1');
            expect(result.title).toBe('Test');
        });
    });

    describe('create', () => {
        it('should create post', async () => {
            postRepository.create.mockResolvedValue({ _id: 'p1', title: 'New' });
            const result = await PostService.create({ title: 'New' });
            expect(result._id).toBe('p1');
        });
    });

    describe('update', () => {
        it('should throw POST_NOT_FOUND', async () => {
            postRepository.findById.mockResolvedValue(null);
            await expect(PostService.update('p1', {})).rejects.toThrow('POST_NOT_FOUND');
        });

        it('should update post', async () => {
            postRepository.findById.mockResolvedValue({ _id: 'p1' });
            postRepository.update.mockResolvedValue({ _id: 'p1', title: 'Updated' });
            const result = await PostService.update('p1', { title: 'Updated' });
            expect(result.title).toBe('Updated');
        });
    });

    describe('delete', () => {
        it('should throw POST_NOT_FOUND', async () => {
            postRepository.findById.mockResolvedValue(null);
            await expect(PostService.delete('p1')).rejects.toThrow('POST_NOT_FOUND');
        });

        it('should delete post', async () => {
            postRepository.findById.mockResolvedValue({ _id: 'p1' });
            postRepository.delete.mockResolvedValue({ _id: 'p1' });
            await expect(PostService.delete('p1')).resolves.toBeDefined();
        });
    });

    describe('getAll', () => {
        it('should return all posts', async () => {
            postRepository.findAllSorted.mockResolvedValue([{ _id: 'p1' }]);
            const result = await PostService.getAll();
            expect(result).toHaveLength(1);
        });
    });
});
