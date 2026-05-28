import Post from "../models/post.js";
import User from "../models/user.js";

class PostService {
    async create(data) {
        return await Post.create(data);
    }
    async getAll(filter) {
        return await Post.find(filter).populate('author');
    }

    async getById(id) {
        return await Post.findById(id).populate('author');
    }

    async getCategories() {
        return Post.schema.path('category').enumValues;
    }
    async getStatuses(){
        return Post.schema.path('status').enumValues
    }

    async update(id, data) {
        return await Post.findByIdAndUpdate(id, data, { new: true });
    }

}

export default new PostService();