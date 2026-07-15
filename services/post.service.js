import postRepository from '../repositories/post.repository.js';

class PostService {
    async getAll() {
        return await postRepository.findAllSorted();
    }

    async getById(id) {
        const post = await postRepository.findById(id);

        if (!post) {
            const error = new Error('POST_NOT_FOUND');
            error.code = 'POST_NOT_FOUND';
            throw error;
        }

        return post;
    }

    async create(data) {
        return await postRepository.create(data);
    }

    async update(id, data) {
        const existing = await postRepository.findById(id);

        if (!existing) {
            const error = new Error('POST_NOT_FOUND');
            error.code = 'POST_NOT_FOUND';
            throw error;
        }

        return await postRepository.update(id, data);
    }

    async delete(id) {
        const existing = await postRepository.findById(id);

        if (!existing) {
            const error = new Error('POST_NOT_FOUND');
            error.code = 'POST_NOT_FOUND';
            throw error;
        }

        return await postRepository.delete(id);
    }
}

export default new PostService();
