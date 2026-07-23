import itemDescriptorRepository from "../repositories/itemDescriptor.repository.js";
import itemRepository from "../repositories/item.repository.js";
import userRepository from "../repositories/user.repository.js";
import Item from "../models/Item.js";


class ProductService {
    async create(data) {
        return await itemDescriptorRepository.create(data);
    }

    async getAll (category = null){
        return await itemDescriptorRepository.findByCategory(category);
    }

    async getById(id){
        const descriptor = await itemDescriptorRepository.findById(id);

        if(!descriptor){
            const error = new Error('PRODUCT_NOT_FOUND');
            error.code = 'PRODUCT_NOT_FOUND';
            throw error;
        }

        return descriptor;
    }

    async update(id, data) {
        const existing = await itemDescriptorRepository.findById(id);
        if (!existing) {
            const error = new Error('PRODUCT_NOT_FOUND');
            error.code = 'PRODUCT_NOT_FOUND';
            throw error;
        }
        return await itemDescriptorRepository.update(id, data);
    }

    async delete(id) {
        const existing = await itemDescriptorRepository.findById(id);
        if (!existing) {
            const error = new Error('PRODUCT_NOT_FOUND');
            error.code = 'PRODUCT_NOT_FOUND';
            throw error;
        }
        return await itemDescriptorRepository.delete(id);
    }

    async getCategories(){
        return await itemDescriptorRepository.getCategories()
    }

    async buyProduct(userId, itemId){
        const user = await userRepository.findById(userId);

        if(!user){
            const error = new Error('USER_NOT_FOUND');
            error.code = 'USER_NOT_FOUND'
            throw error
        }

        const descriptor = await itemDescriptorRepository.findById(itemId)

        if(!descriptor){
            const error = new Error('PRODUCT_NOT_FOUND')
            error.code = 'PRODUCT_NOT_FOUND';
            throw error;
        }

        if(user.money < descriptor.price){
            const error = new Error('INSUFFICIENT_FUNDS')
            error.code = 'INSUFFICIENT_FUNDS';
            throw error;
        }

        user.money -= descriptor.price;

        await user.save();

        const item = await Item.create({
            playerId: userId,
            code: descriptor.code,
            left: descriptor.duration
        });

        return {user, item}
    }

    async getUserInventory(userId){
        const items = await itemRepository.findByPlayer(userId)

        const inventory = await Promise.all(items.map(async (item)=>{
            const descriptor = await itemDescriptorRepository.findByCode(item.code);
            return {...item.toObject(), descriptor}
        }))

        return inventory
    }

}

export default new ProductService();