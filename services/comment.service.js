import commentRepository from '../repositories/comment.repository.js';
import commentRatingRepository from "../repositories/comment-rating.repository.js";

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

    async rate (commentId, userId, rating){
        const comment = await commentRepository.findById(commentId);
        if(!comment){
            const error = new Error('COMMENT_NOT_FOUND')
            error.code = 'COMMENT_NOT_FOUND';
            throw error;
        }

        if (comment.author.toString() === userId.toString()){
            const error = new Error('CANNOT_RATE_OWN_COMMENT')
            error.code = 'CANNOT_RATE_OWN_COMMENT';
            throw error;
        }

        const existing = await commentRatingRepository.findByCommentAndUser(commentId, userId);

        if(existing && existing.rating == rating){
            await commentRatingRepository.delete(existing._id);
        } else {
            await commentRatingRepository.upsert(commentId, userId, rating)
        }

        const {avg, count} = await commentRatingRepository.getAverageByComment(commentId);
        const rounded = Math.round(avg * 10)/10;
        await commentRepository.updateAverageRating(commentId, rounded);

        return {averageRating: rounded, count}
    }

    async getRatingsMap(postId, userId){
        const comments = await commentRepository.findByPostId(postId);
        const commentsIds = comments.map(c => c._id);
        const ratings = await commentRatingRepository.getRatingsByComments(commentsIds)

        const map = {}

        for (const comment of comments){
            const commentRatings = ratings.filter(
                r => r.commentId.toString() === comment._id.toString()
            );
            const sum = commentRatings.reduce((acc, r)=>acc + r.rating, 0);
            const avg = commentRatings.length ? Math.round((sum / commentRatings.length) * 10) / 10 : 0;
            const userRating = commentRatings.find(
                r => r.userId.toString() === userId.toString()
            );
            map[comment._id.toString()] ={
                averageRating: avg,
                count: commentRatings.length,
                userRating: userRating ? userRating.rating : 0
            }
        }

        return map;
    }





}

export default new CommentService();
