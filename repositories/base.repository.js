export default class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async findAll(filter = {}, options = {}) {
        const query = this.model.find(filter);

        if (options.sort) {
            query.sort(options.sort);
        }

        if (options.populate) {
            if (Array.isArray(options.populate)) {
                options.populate.forEach(p => query.populate(p));
            } else {
                query.populate(options.populate);
            }
        }

        if (options.select) {
            query.select(options.select);
        }

        if (options.limit) {
            query.limit(options.limit);
        }

        if (options.skip) {
            query.skip(options.skip);
        }

        return await query;
    }

    async findById(id, populate) {
        const query = this.model.findById(id);

        if (populate) {
            if (Array.isArray(populate)) {
                populate.forEach(p => query.populate(p));
            } else {
                query.populate(populate);
            }
        }

        return await query;
    }

    async findOne(filter, populate) {
        const query = this.model.findOne(filter);

        if (populate) {
            if (Array.isArray(populate)) {
                populate.forEach(p => query.populate(p));
            } else {
                query.populate(populate);
            }
        }

        return await query;
    }

    async create(data) {
        return await this.model.create(data);
    }

    async update(id, data) {
        return await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }

    async count(filter = {}) {
        return await this.model.countDocuments(filter);
    }

    async exists(filter) {
        return await this.model.exists(filter);
    }
}
