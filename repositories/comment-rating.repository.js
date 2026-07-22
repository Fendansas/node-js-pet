import BaseRepository from "./base.repository.js";
import CommentRating from "../models/CommentRating.js";


class CommentRatingRepository extends BaseRepository{
    constructor() {
        super(CommentRating);
    }

    async findByCommentAndUser(commentId, userId){
        return await this.findOne({commentId, userId})
    }

    async upsert(commentId, userId, rating){
        return await CommentRating.findOneAndUpdate(
            {commentId, userId},
            {rating},
            {upsert: true, new: true}
        );
    }

    async getAverageByComment(commentId){
        const result = await CommentRating.aggregate([
            {$match: {commentId}},
            {$group: {_id: null, avg:{$avg: '$rating'}, count:{$sum:1}}}
        ]);
        return result[0] || {avg:0 , count:0};
    }

    async getRatingsByComments(commentIds){
        return await CommentRating.find({commentId: {$in: commentIds}});
    }
}

export default new CommentRatingRepository();



