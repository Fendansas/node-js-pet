import mongoose from "mongoose";

const commentRatingSchema = new mongoose.Schema({
    commentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating:{
        type: Number,
        required: true,
        min:1,
        max:5
    }
});

commentRatingSchema.index({commentId:1, userId: 1}, {unique: true});

const CommentRating = mongoose.model('CommentRating', commentRatingSchema);

export default CommentRating