import { BaseController } from './base.controller.js';
import * as RbacService from '../services/rbac.service.js';

export class AdminController extends BaseController {

    async rbacPage(req, res) {
        console.log('[ADMIN] Loading RBAC page');

        try {
            const data = await RbacService.getRbacPageData();
            console.log('[ADMIN] RBAC data loaded:', data.roles.length, 'roles,', data.permissions.length, 'permissions');

            return this.renderView(res, 'admin/rbac', data);

        } catch (error) {
            return this.handleError(res, error, 'RBAC page error');
        }
    }

    async createPermission(req, res) {
        console.log('[ADMIN] Creating permission');

        const { name, description } = req.body;
        console.log('[ADMIN] Permission data:', { name, description });

        try {
            await RbacService.createPermission(name, description);
            console.log('[ADMIN] Permission created:', name);

            return this.successRedirect(res, '/admin/rbac', 'Permission created');

        } catch (error) {
            return this.handleError(res, error, 'Create permission error');
        }
    }

    async createRole(req, res) {
        console.log('[ADMIN] Creating role');

        const { name } = req.body;
        console.log('[ADMIN] Role name:', name);

        try {
            await RbacService.createRole(name);
            console.log('[ADMIN] Role created:', name);

            return this.successRedirect(res, '/admin/rbac', 'Role created');

        } catch (error) {
            return this.handleError(res, error, 'Create role error');
        }
    }

    async addPermissionToRole(req, res) {
        console.log('[ADMIN] Adding permission to role');

        const { roleId, permissionId } = req.body;
        console.log('[ADMIN] Role:', roleId, 'Permission:', permissionId);

        try {
            await RbacService.addPermissionToRole(roleId, permissionId);
            console.log('[ADMIN] Permission added to role');

            return this.successRedirect(res, '/admin/rbac', 'Permission added');

        } catch (error) {
            return this.handleError(res, error, 'Add permission error');
        }
    }

    async removePermissionFromRole(req, res) {
        console.log('[ADMIN] Removing permission from role');

        const { roleId, permissionId } = req.body;
        console.log('[ADMIN] Role:', roleId, 'Permission:', permissionId);

        try {
            await RbacService.removePermissionFromRole(roleId, permissionId);
            console.log('[ADMIN] Permission removed from role');

            return this.successRedirect(res, '/admin/rbac', 'Permission removed');

        } catch (error) {
            return this.handleError(res, error, 'Remove permission error');
        }
    }

    async dashboard(req, res) {
        console.log('[ADMIN] Loading dashboard');
        return this.renderView(res, 'admin/dashboard');
    }
}

export default new AdminController();