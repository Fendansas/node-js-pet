import Post from '../models/post.js';

class PostService {
    async getAll() {
        return await Post.find().sort({ createdAt: -1 });
    }

    async getById(id) {
        const post = await Post.findById(id);

        if (!post) {
            const error = new Error('POST_NOT_FOUND');
            error.code = 'POST_NOT_FOUND';
            throw error;
        }

        return post;
    }

    async create(data) {
        return await Post.create(data);
    }

    async update(id, data) {
        const existing = await Post.findById(id);

        if (!existing) {
            const error = new Error('POST_NOT_FOUND');
            error.code = 'POST_NOT_FOUND';
            throw error;
        }

        return await Post.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        const existing = await Post.findById(id);

        if (!existing) {
            const error = new Error('POST_NOT_FOUND');
            error.code = 'POST_NOT_FOUND';
            throw error;
        }

        return await Post.findByIdAndDelete(id);
    }
}

export default new PostService();