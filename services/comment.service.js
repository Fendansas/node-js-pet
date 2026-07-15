import Comment from '../models/Comment.js';

class CommentService {
    async getPost(postId){
        return await Comment.find({postId})
            .populate('author', 'username avatar')
            .sort({createdAt: -1});
    }

    async create(postId, authorId, text){
        return await Comment.create({postId, author: authorId, text});
    }

    async delete (commentId){
        const comment = await Comment.findById(commentId);
        if(!comment){
            const error = new Error('COMMENT_NOT_FOUND');
            error.code = 'COMMENT_NOT_FOUND';
            throw error;
        }
        return await Comment.findByIdAndDelete(commentId);
    }

    async isOwner (commentId, userId){
        const comment = await Comment.findById(commentId);
        return comment && comment.author.toString() === userId.toString();
    }
}

export default new CommentService();
