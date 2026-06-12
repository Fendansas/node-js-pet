import { BaseController } from './base.controller.js';
import * as RbacService from '../services/rbac.service.js';

export class AdminController extends BaseController {

    async showRbacPage(req, res) {
        console.log('[ADMIN] Loading RBAC page');

        try {
            const data = await RbacService.getRbacPageData();
            console.log('[ADMIN] RBAC data loaded:', data.roles.length, 'roles,', data.permissions.length, 'permissions');

            return this.renderView(res, 'admin/rbac', data);

        } catch (error) {
            console.error('[ADMIN] RBAC page error:', error);
            return this.handleError(res, error, 'RBAC page error');
        }
    }

    async createPermission(req, res) {
        console.log('[ADMIN] Creating permission');

        const { name, description } = req.body;

        try {
            await RbacService.createPermission(name.trim(), description?.trim());
            console.log('[ADMIN] Permission created');

            return this.successRedirect(res, '/admin/rbac', 'Permission created');
        } catch (error) {
            console.error('[ADMIN] Create permission error:', error);

            if (error.code === 'PERMISSION_ALREADY_EXISTS') {
                return res.status(409).send('Permission with this name already exists');
            }

            return this.handleError(res, error, 'Create permission error');
        }
    }

    async createRole(req, res) {
        console.log('[ADMIN] Creating role');

        const { name } = req.body;
        console.log('[ADMIN] Role name:', name);

        try {
            await RbacService.createRole(name.trim());
            console.log('[ADMIN] Role created:', name);

            return this.successRedirect(res, '/admin/rbac', 'Role created');
        } catch (error) {
            console.error('[ADMIN] Create role error:', error);

            if (error.code === 'ROLE_ALREADY_EXISTS') {
                return res.status(409).send('Role with this name already exists');
            }

            return this.handleError(res, error, 'Create role error');
        }
    }

    async assignPermissionToRole(req, res) {
        console.log('[ADMIN] Assigning permission to role');

        const { roleId, permissionId } = req.body;
        console.log('[ADMIN] Role:', roleId, 'Permission:', permissionId);

        try {
            await RbacService.addPermissionToRole(roleId, permissionId);
            console.log('[ADMIN] Permission assigned to role');

            return this.successRedirect(res, '/admin/rbac', 'Permission assigned');
        } catch (error) {
            console.error('[ADMIN] Assign permission error:', error);
            return this.handleError(res, error, 'Assign permission error');
        }
    }

    async unassignPermissionToRole(req, res) {
        console.log('[ADMIN] Unassigning permission from role');

        const { roleId, permissionId } = req.body;
        console.log('[ADMIN] Role:', roleId, 'Permission:', permissionId);

        try {
            await RbacService.removePermissionFromRole(roleId, permissionId);
            console.log('[ADMIN] Permission unassigned from role');

            return this.successRedirect(res, '/admin/rbac', 'Permission unassigned');
        } catch (error) {
            console.error('[ADMIN] Unassign permission error:', error);
            return this.handleError(res, error, 'Unassign permission error');
        }
    }

    async dashboard(req, res) {
        console.log('[ADMIN] Loading dashboard');
        try {
            return this.renderView(res, 'admin/dashboard');
        } catch (error) {
            console.error('[ADMIN] Dashboard page error:', error);
            return this.handleError(res, error, 'Dashboard page error');
        }
    }
}

export default new AdminController();