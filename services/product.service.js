
import Product from "../models/Product.js";
class ProductService {

    async create(data) {
        return await Product.create(data);
    }

    async getAll(category = null) {

        const filter = {};

        if (category) {

            filter.category = category;
        }

        return await Product.find(filter)
            .sort({ createdAt: -1 });
    }

    async getById(id) {
        return await Product.findById(id);
    }

    async update(id, data) {
        return await Product.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );
    }

    async delete(id) {
        return await Product.findByIdAndDelete(id);
    }

    async getCategories() {

        return await Product.distinct(
            "category"
        );
    }

}

export default new ProductService();