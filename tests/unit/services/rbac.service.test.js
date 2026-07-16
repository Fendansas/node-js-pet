import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../repositories/role.repository.js', () => ({
    default: {
        findByName: vi.fn(),
        create: vi.fn(),
        findWithPermissions: vi.fn(),
        addPermission: vi.fn(),
        removePermission: vi.fn(),
    }
}));

vi.mock('../../../repositories/permission.repository.js', () => ({
    default: {
        findByName: vi.fn(),
        create: vi.fn(),
        findAll: vi.fn(),
    }
}));

vi.mock('../../../repositories/user.repository.js', () => ({
    default: {
        findWithPermissions: vi.fn(),
    }
}));

import roleRepository from '../../../repositories/role.repository.js';
import permissionRepository from '../../../repositories/permission.repository.js';
import userRepository from '../../../repositories/user.repository.js';
import RbacService from '../../../services/rbac.service.js';

describe('RbacService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createPermission', () => {
        it('should throw PERMISSION_ALREADY_EXISTS', async () => {
            permissionRepository.findByName.mockResolvedValue({ _id: 'p1' });
            await expect(RbacService.createPermission('test')).rejects.toThrow('PERMISSION_ALREADY_EXISTS');
        });

        it('should create permission', async () => {
            permissionRepository.findByName.mockResolvedValue(null);
            permissionRepository.create.mockResolvedValue({ _id: 'p1', name: 'test' });
            const result = await RbacService.createPermission('test', 'desc');
            expect(result.name).toBe('test');
        });
    });

    describe('createRole', () => {
        it('should throw ROLE_ALREADY_EXISTS', async () => {
            roleRepository.findByName.mockResolvedValue({ _id: 'r1' });
            await expect(RbacService.createRole('admin')).rejects.toThrow('ROLE_ALREADY_EXISTS');
        });

        it('should create role', async () => {
            roleRepository.findByName.mockResolvedValue(null);
            roleRepository.create.mockResolvedValue({ _id: 'r1', name: 'admin' });
            const result = await RbacService.createRole('admin');
            expect(result.name).toBe('admin');
        });
    });

    describe('hasPermission', () => {
        it('should return false if user not found', async () => {
            userRepository.findWithPermissions.mockResolvedValue(null);
            const result = await RbacService.hasPermission('u1', 'post:read');
            expect(result).toBe(false);
        });

        it('should return false if user has no role', async () => {
            userRepository.findWithPermissions.mockResolvedValue({ role: null });
            const result = await RbacService.hasPermission('u1', 'post:read');
            expect(result).toBe(false);
        });

        it('should return false if role has no permissions', async () => {
            userRepository.findWithPermissions.mockResolvedValue({
                role: { permissions: null }
            });
            const result = await RbacService.hasPermission('u1', 'post:read');
            expect(result).toBe(false);
        });

        it('should return true if permission exists', async () => {
            userRepository.findWithPermissions.mockResolvedValue({
                role: { permissions: [{ name: 'post:read' }, { name: 'post:write' }] }
            });
            const result = await RbacService.hasPermission('u1', 'post:read');
            expect(result).toBe(true);
        });

        it('should return false if permission not found', async () => {
            userRepository.findWithPermissions.mockResolvedValue({
                role: { permissions: [{ name: 'post:read' }] }
            });
            const result = await RbacService.hasPermission('u1', 'admin:delete');
            expect(result).toBe(false);
        });
    });

    describe('getPageData', () => {
        it('should return roles and permissions', async () => {
            roleRepository.findWithPermissions.mockResolvedValue([{ name: 'admin' }]);
            permissionRepository.findAll.mockResolvedValue([{ name: 'post:read' }]);
            const result = await RbacService.getPageData();
            expect(result.roles).toHaveLength(1);
            expect(result.permissions).toHaveLength(1);
        });
    });
});
