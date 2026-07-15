import BaseRepository from './base.repository.js';
import Product from '../models/Product.js';

class ProductRepository extends BaseRepository {
    constructor() {
        super(Product);
    }

    async findAllSorted(filter = {}) {
        return await this.findAll(filter, { sort: { createdAt: -1 } });
    }

    async findByCategory(category) {
        const filter = category ? { category } : {};
        return await this.findAllSorted(filter);
    }

    async getCategories() {
        return await this.model.distinct('category');
    }
}

export default new ProductRepository();
