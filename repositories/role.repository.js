import BaseRepository from './base.repository.js';
import Role from '../models/Role.js';

class RoleRepository extends BaseRepository {
    constructor() {
        super(Role);
    }

    async findByName(name) {
        return await this.findOne({ name });
    }

    async findWithPermissions() {
        return await this.findAll({}, { populate: 'permissions' });
    }

    async addPermission(roleId, permissionId) {
        return await this.model.findByIdAndUpdate(
            roleId,
            { $addToSet: { permissions: permissionId } },
            { new: true }
        );
    }

    async removePermission(roleId, permissionId) {
        return await this.model.findByIdAndUpdate(
            roleId,
            { $pull: { permissions: permissionId } },
            { new: true }
        );
    }
}

export default new RoleRepository();
