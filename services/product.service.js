
import Product from "../models/Product.js";
import User from "../models/user.js";

class ProductService {

    async create(data) {
        return await Product.create(data);
    }

    async getAll(category = null) {

        const filter = {};

        if (category) {
            filter.category = category;
        }

        return await Product.find(filter).sort({ createdAt: -1 });
    }

    async getById(id) {
        return await Product.findById(id);
    }

    async update(id, data) {
        const existing = await Product.findById(id);
        if (!existing) {
            const error = new Error('PRODUCT_NOT_FOUND');
            error.code = 'PRODUCT_NOT_FOUND';
            throw error;
        }
        return await Product.findByIdAndUpdate(id,data,{ new: true });
    }

    async delete(id) {
        const existing = await Product.findById(id);
        if (!existing) {
            const error = new Error('PRODUCT_NOT_FOUND');
            error.code = 'PRODUCT_NOT_FOUND';
            throw error;
        }

        return await Product.findByIdAndDelete(id);
    }

    async getCategories() {

        return await Product.distinct(
            "category"
        );
    }

    async buyProduct(userId, productId) {
        const user = await User.findById(userId);

        if(!user){
            const error = new Error('USER_NOT_FOUND');
            error.code = 'USER_NOT_FOUND';
            throw error;
        }

        const product = await Product.findById(productId);

        if (!product){
            const error = new Error('PRODUCT_NOT_FOUND');
            error.code = 'PRODUCT_NOT_FOUND';
            throw error;
        }

        if(user.money < product.price){

            const error = new Error('INSUFFICIENT_FUNDS');
            error.code = 'INSUFFICIENT_FUNDS';
            throw error;
        }

        user.money -= product.price;

        const existingItem = user.inventory.find(
            item => item.product && item.product.toString() === productId
        );
        if (existingItem){
            existingItem.count += 1;
        } else {
            user.inventory.push({
                product: productId,
                count: 1
            });
        }

        await user.save();

        return {user, product};
    }

    async getUserInventory(userId) {
        const user = await User.findById(userId).populate('inventory.product');
        if (!user) {
            throw new Error('User not found');
        }

        return user.inventory;
    }
}

export default new ProductService();