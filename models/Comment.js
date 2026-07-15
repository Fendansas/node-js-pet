import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
        index: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
