import commentRepository from '../repositories/comment.repository.js';

class CommentService {
    async getPost(postId){
        return await commentRepository.findByPostId(postId);
    }

    async create(postId, authorId, text){
        return await commentRepository.create({postId, author: authorId, text});
    }

    async delete (commentId){
        const comment = await commentRepository.findById(commentId);
        if(!comment){
            const error = new Error('COMMENT_NOT_FOUND');
            error.code = 'COMMENT_NOT_FOUND';
            throw error;
        }
        return await commentRepository.delete(commentId);
    }

    async isOwner (commentId, userId){
        const comment = await commentRepository.findById(commentId);
        return comment && comment.author.toString() === userId.toString();
    }
}

export default new CommentService();
