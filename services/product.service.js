
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

    async buyProduct(userId, productId) {
        const user = await User.findById(userId);

        if(!user){
            throw new Error('User not found');
        }

        const product = await Product.findById(productId);

        if (!product){
            throw new Error('Product not found');
        }

        if(user.money < product.price){

            throw new Error('Not enough money');
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

        return user, product;
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