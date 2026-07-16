import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validate } from '../../../middleware/validation.middleware.js';

vi.mock('express-validator', () => ({
    validationResult: vi.fn(),
}));

import { validationResult } from 'express-validator';

describe('validate middleware', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call next if no errors', () => {
        validationResult.mockReturnValue({ isEmpty: () => true });
        const req = {};
        const res = {};
        const next = vi.fn();

        validate(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should return 422 JSON if errors and request is not HTML', () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'Invalid' }]
        });
        const req = { accepts: vi.fn().mockReturnValue(false) };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
        const next = vi.fn();

        validate(req, res, next);
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Invalid' }] });
    });

    it('should save errors to session and redirect if HTML request', () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'Invalid field' }]
        });
        const req = {
            accepts: vi.fn().mockReturnValue('html'),
            session: {},
            body: { username: 'test' }
        };
        const res = { redirect: vi.fn() };
        const next = vi.fn();

        validate(req, res, next);
        expect(req.session.validationErrors).toHaveLength(1);
        expect(req.session.validationData).toEqual({ username: 'test' });
        expect(res.redirect).toHaveBeenCalledWith('back');
    });
});
