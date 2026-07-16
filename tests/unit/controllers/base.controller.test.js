import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseController } from '../../../controllers/base.controller.js';

describe('BaseController', () => {
    let controller;

    beforeEach(() => {
        controller = new BaseController();
        vi.clearAllMocks();
    });

    describe('handleError', () => {
        it('should return 404 for NOT_FOUND errors', () => {
            const error = new Error('Not found');
            error.code = 'USER_NOT_FOUND';
            const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

            controller.handleError(res, error);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return 400 for BAD_REQUEST errors', () => {
            const error = new Error('Bad request');
            error.code = 'INSUFFICIENT_FUNDS';
            const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

            controller.handleError(res, error);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 403 for BANNED errors', () => {
            const error = new Error('Banned');
            error.code = 'USER_BANNED';
            const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

            controller.handleError(res, error);
            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('should return 500 for unknown errors', () => {
            const error = new Error('Unknown');
            const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

            controller.handleError(res, error);
            expect(res.status).toHaveBeenCalledWith(500);
        });

        it('should return error message in response', () => {
            const error = new Error('Custom error');
            error.code = 'PRODUCT_NOT_FOUND';
            const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

            controller.handleError(res, error);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Custom error'
            });
        });
    });

    describe('sendValidationError', () => {
        it('should return 400 JSON with errors array', () => {
            const errors = { array: () => [{ msg: 'Invalid' }] };
            const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

            controller.sendValidationError(res, errors);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                errors: [{ msg: 'Invalid' }]
            });
        });

        it('should render view if renderView is provided', () => {
            const errors = { array: () => [{ msg: 'Invalid' }] };
            const res = { status: vi.fn().mockReturnThis(), render: vi.fn() };

            controller.sendValidationError(res, errors, 'form', { data: 'test' });
            expect(res.render).toHaveBeenCalledWith('form', {
                data: 'test',
                errors: [{ msg: 'Invalid' }]
            });
        });
    });

    describe('getCurrentUser', () => {
        it('should return req.user if set', () => {
            const req = { user: { _id: 'u1' } };
            const res = {};
            expect(controller.getCurrentUser(req, res)).toEqual({ _id: 'u1' });
        });

        it('should return res.locals.user as fallback', () => {
            const req = {};
            const res = { locals: { user: { _id: 'u2' } } };
            expect(controller.getCurrentUser(req, res)).toEqual({ _id: 'u2' });
        });
    });

    describe('successRedirect', () => {
        it('should set session message and redirect', () => {
            const req = { session: {} };
            const res = { status: vi.fn().mockReturnThis(), redirect: vi.fn() };

            controller.successRedirect(req, res, '/profile', 'Updated!');
            expect(req.session.successMessage).toBe('Updated!');
            expect(res.redirect).toHaveBeenCalledWith('/profile');
        });
    });

    describe('renderView', () => {
        it('should call res.render with view and data', () => {
            const res = { render: vi.fn() };
            controller.renderView(res, 'profile', { user: 'test' });
            expect(res.render).toHaveBeenCalledWith('profile', { user: 'test' });
        });
    });
});
