import path from 'path';
import fs from 'fs';
import personRepository from '../repositories/person.repository.js';
import faceService from './face.service.js';

class PersonService {
    async getAll() {
        return await personRepository.findAll({}, { sort: { createdAt: -1 } });
    }

    async getById(id) {
        return await personRepository.findById(id);
    }

    async create({ name, imageUrl, createdBy }) {
        const embedding = await this.extractEmbedding(imageUrl);
        return await personRepository.create({
            name,
            createdBy,
            photos: [{ imageUrl, embedding }]
        });
    }

    async addPhoto(personId, imageUrl) {
        const person = await personRepository.findById(personId);
        if (!person) {
            const error = new Error('PERSON_NOT_FOUND');
            error.code = 'PERSON_NOT_FOUND';
            throw error;
        }

        const embedding = await this.extractEmbedding(imageUrl);
        return await personRepository.update(personId, {
            photos: [...person.photos, { imageUrl, embedding }]
        });
    }

    async extractEmbedding(imageUrl) {
        const filePath = path.join(process.cwd(), 'public', imageUrl.replace(/^\//, ''));

        try {
            const faces = await faceService.scanImage(filePath);
            if (!faces.length) {
                const error = new Error('NO_FACE_FOUND');
                error.code = 'NO_FACE_FOUND';
                throw error;
            }
            return faces[0].embedding;
        } catch (error) {
            this.deleteFile(imageUrl);
            throw error;
        }
    }

    async deletePhoto(personId, photoIndex) {
        const person = await personRepository.findById(personId);
        if (!person) {
            const error = new Error('PERSON_NOT_FOUND');
            error.code = 'PERSON_NOT_FOUND';
            throw error;
        }

        if (photoIndex < 0 || photoIndex >= person.photos.length) {
            const error = new Error('PHOTO_NOT_FOUND');
            error.code = 'PHOTO_NOT_FOUND';
            throw error;
        }

        const [removed] = person.photos.splice(photoIndex, 1);
        if (removed?.imageUrl) {
            this.deleteFile(removed.imageUrl);
        }

        return await personRepository.update(personId, { photos: person.photos });
    }

    async delete(personId) {
        const person = await personRepository.findById(personId);
        if (!person) {
            const error = new Error('PERSON_NOT_FOUND');
            error.code = 'PERSON_NOT_FOUND';
            throw error;
        }

        for (const photo of person.photos || []) {
            if (photo.imageUrl) {
                this.deleteFile(photo.imageUrl);
            }
        }

        return await personRepository.delete(personId);
    }

    deleteFile(imageUrl) {
        const filePath = path.join(process.cwd(), 'public', imageUrl.replace(/^\//, ''));
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error('[PERSON] file delete error:', error.message);
        }
    }
}

export default new PersonService();
