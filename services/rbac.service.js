import User from '../models/User.js';
import Permission from '../models/Permission.js';
import Role from '../models/Role.js';

class RbacService {

    async getPageData() {
        const roles = await Role.find().populate('permissions');
        const permissions = await Permission.find();
        return { roles, permissions };
    }

    async createPermission(name, description) {
        const existing = await Permission.findOne({ name });

        if (existing) {
            const error = new Error('PERMISSION_ALREADY_EXISTS');
            error.code = 'PERMISSION_ALREADY_EXISTS';
            throw error;
        }

        return await Permission.create({
            name,
            description: description || ''
        });
    }

    async createRole(name) {
        const existing = await Role.findOne({ name });
        if (existing) {
            const error = new Error('ROLE_ALREADY_EXISTS');
            error.code = 'ROLE_ALREADY_EXISTS';
            throw error;
        }

        return await Role.create({
            name,
            permissions: []
        });
    }

    async addPermissionToRole(roleId, permissionId) {
        return await Role.findByIdAndUpdate(
            roleId,
            {
                $addToSet: {
                    permissions: permissionId
                }
            }
        );
    }

    async removePermissionFromRole(roleId, permissionId) {
        return await Role.findByIdAndUpdate(
            roleId,
            {
                $pull: {
                    permissions: permissionId
                }
            }
        );
    }

    async hasPermission(userId, permissionName) {
        const user = await User.findById(userId)
            .populate({
                path: 'role',
                populate: {
                    path: 'permissions'
                }
            });

        if (!user) {
            return false;
        }

        if (!user.role) {
            return false;
        }

        if (!user.role.permissions) {
            return false;
        }

        return user.role.permissions.some(
            (permission) => permission.name === permissionName
        );
    }

}

export default new RbacService();
