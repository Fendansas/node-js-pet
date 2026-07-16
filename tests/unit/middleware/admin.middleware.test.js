import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isAdmin } from '../../../middleware/admin.middleware.js';

describe('isAdmin middleware', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call next if user is admin', () => {
        const req = { user: { role: { name: 'admin' } } };
        const res = { status: vi.fn().mockReturnThis(), render: vi.fn() };
        const next = vi.fn();

        isAdmin(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should return 403 if user is not admin', () => {
        const req = { user: { role: { name: 'user' } } };
        const res = { status: vi.fn().mockReturnThis(), render: vi.fn() };
        const next = vi.fn();

        isAdmin(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user is not logged in', () => {
        const req = { user: null };
        const res = { status: vi.fn().mockReturnThis(), render: vi.fn() };
        const next = vi.fn();

        isAdmin(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should return 403 if user has no role', () => {
        const req = { user: {} };
        const res = { status: vi.fn().mockReturnThis(), render: vi.fn() };
        const next = vi.fn();

        isAdmin(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
    });
});
