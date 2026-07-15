import BaseRepository from './base.repository.js';
import Post from '../models/Post.js';

class PostRepository extends BaseRepository {
    constructor() {
        super(Post);
    }

    async findAllSorted() {
        return await this.findAll({}, { sort: { createdAt: -1 } });
    }
}

export default new PostRepository();
