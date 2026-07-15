import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'deleted'],
        default: 'draft'
    },
    category: {
        type: String,
        enum: ['weapon', 'anomaly', 'news','blog'],
        default: 'news'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Post = mongoose.model('Post', postSchema);

export default Post;