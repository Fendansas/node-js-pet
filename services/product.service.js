import productRepository from '../repositories/product.repository.js';
import userRepository from '../repositories/user.repository.js';

class ProductService {

    async create(data) {
        return await productRepository.create(data);
    }

    async getAll(category = null) {
        return await productRepository.findByCategory(category);
    }

    async getById(id) {
        const product = await productRepository.findById(id);

        if (!product) {
            const error = new Error('PRODUCT_NOT_FOUND');
            error.code = 'PRODUCT_NOT_FOUND';
            throw error;
        }

        return product;
    }

    async update(id, data) {
        const existing = await productRepository.findById(id);
        if (!existing) {
            const error = new Error('PRODUCT_NOT_FOUND');
            error.code = 'PRODUCT_NOT_FOUND';
            throw error;
        }
        return await productRepository.update(id, data);
    }

    async delete(id) {
        const existing = await productRepository.findById(id);
        if (!existing) {
            const error = new Error('PRODUCT_NOT_FOUND');
            error.code = 'PRODUCT_NOT_FOUND';
            throw error;
        }

        return await productRepository.delete(id);
    }

    async getCategories() {
        return await productRepository.getCategories();
    }

    async buyProduct(userId, productId) {
        const user = await userRepository.findById(userId);

        if(!user){
            const error = new Error('USER_NOT_FOUND');
            error.code = 'USER_NOT_FOUND';
            throw error;
        }

        const product = await productRepository.findById(productId);

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
        const user = await userRepository.findWithRoleAndInventory(userId);
        if (!user) {
            throw new Error('User not found');
        }

        return user.inventory;
    }
}

export default new ProductService();
