import BaseRepository from './base.repository.js';
import Comment from '../models/Comment.js';

class CommentRepository extends BaseRepository {
    constructor() {
        super(Comment);
    }

    async findByPostId(postId) {
        return await this.findAll(
            { postId },
            {
                populate: { path: 'author', select: 'username avatar' },
                sort: { createdAt: -1 }
            }
        );
    }

    async updateAverageRating(commentId, averageRating){
        return await this.update(commentId, {averageRating});
    }
}

export default new CommentRepository();
