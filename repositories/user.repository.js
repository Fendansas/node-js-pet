import BaseRepository from './base.repository.js';
import User from '../models/User.js';

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    async findByUsername(username) {
        return await this.findOne({ username });
    }

    async findByEmail(email) {
        return await this.findOne({ email });
    }

    async findByFilter(search) {
        const filter = search
            ? {
                  $or: [
                      { username: { $regex: search, $options: 'i' } },
                      { email: { $regex: search, $options: 'i' } }
                  ]
              }
            : {};

        return await this.findAll(filter, {
            populate: ['role', 'inventory.product']
        });
    }

    async findWithRole(id) {
        return await this.findById(id, 'role');
    }

    async findWithRoleAndInventory(id) {
        return await this.findById(id, ['role', 'inventory.product']);
    }

    async findWithPermissions(id) {
        return await this.findOne(
            { _id: id },
            {
                path: 'role',
                populate: { path: 'permissions' }
            }
        );
    }

    async findByLoginCredentials(username) {
        return await this.findOne(
            { username },
            {
                path: 'role',
                populate: { path: 'permissions' }
            }
        );
    }

    async findForAdminList() {
        return await this.findAll({}, {
            populate: ['role', 'inventory.product']
        });
    }
}

export default new UserRepository();
