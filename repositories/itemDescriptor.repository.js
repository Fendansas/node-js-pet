import BaseRepository from "./base.repository.js";
import ItemDescriptor from "../models/ItemDescriptor.js";

class ItemDescriptorRepository extends BaseRepository {

    constructor() {
        super(ItemDescriptor);
    }

    async findByCode(code){
        return await this.findOne({code});
    }

    async findAllSorted(filter = {}) {
        return await  this.findAll(filter, {sort:{createdAt: -1}});
    }

    async findByCategory (category){
        const filter = category ? {category} : {};
        return await this.findAllSorted(filter)
    };

    async getCategories() {
        return await this.model.distinct('category');
    }
}

export default new ItemDescriptorRepository()