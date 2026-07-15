import roleRepository from '../repositories/role.repository.js';
import permissionRepository from '../repositories/permission.repository.js';
import userRepository from '../repositories/user.repository.js';

class RbacService {

    async getPageData() {
        const roles = await roleRepository.findWithPermissions();
        const permissions = await permissionRepository.findAll();
        return { roles, permissions };
    }

    async createPermission(name, description) {
        const existing = await permissionRepository.findByName(name);

        if (existing) {
            const error = new Error('PERMISSION_ALREADY_EXISTS');
            error.code = 'PERMISSION_ALREADY_EXISTS';
            throw error;
        }

        return await permissionRepository.create({
            name,
            description: description || ''
        });
    }

    async createRole(name) {
        const existing = await roleRepository.findByName(name);
        if (existing) {
            const error = new Error('ROLE_ALREADY_EXISTS');
            error.code = 'ROLE_ALREADY_EXISTS';
            throw error;
        }

        return await roleRepository.create({
            name,
            permissions: []
        });
    }

    async addPermissionToRole(roleId, permissionId) {
        return await roleRepository.addPermission(roleId, permissionId);
    }

    async removePermissionFromRole(roleId, permissionId) {
        return await roleRepository.removePermission(roleId, permissionId);
    }

    async hasPermission(userId, permissionName) {
        const user = await userRepository.findWithPermissions(userId);

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
