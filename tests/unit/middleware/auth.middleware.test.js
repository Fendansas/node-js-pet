import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isAuth } from '../../../middleware/auth.middleware.js';

describe('isAuth middleware', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should redirect to /login if no session', () => {
        const req = {};
        const res = { redirect: vi.fn() };
        const next = vi.fn();

        isAuth(req, res, next);
        expect(res.redirect).toHaveBeenCalledWith('/login');
        expect(next).not.toHaveBeenCalled();
    });

    it('should redirect to /login if no session.user', () => {
        const req = { session: {} };
        const res = { redirect: vi.fn() };
        const next = vi.fn();

        isAuth(req, res, next);
        expect(res.redirect).toHaveBeenCalledWith('/login');
    });

    it('should call next if session.user exists', () => {
        const req = { session: { user: { id: 'u1' } } };
        const res = { redirect: vi.fn() };
        const next = vi.fn();

        isAuth(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res.redirect).not.toHaveBeenCalled();
    });
});
