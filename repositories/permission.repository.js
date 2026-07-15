import BaseRepository from './base.repository.js';
import Permission from '../models/Permission.js';

class PermissionRepository extends BaseRepository {
    constructor() {
        super(Permission);
    }

    async findByName(name) {
        return await this.findOne({ name });
    }
}

export default new PermissionRepository();
