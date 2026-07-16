import { vi } from 'vitest';

export const mockReq = (overrides = {}) => ({
    session: { user: { id: 'user123' } },
    user: { _id: 'user123', role: { name: 'user' } },
    body: {},
    params: {},
    query: {},
    accepts: vi.fn().mockReturnValue('html'),
    ...overrides
});

export const mockRes = () => {
    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        render: vi.fn().mockReturnThis(),
        redirect: vi.fn().mockReturnThis(),
        sendFile: vi.fn().mockReturnThis(),
        setHeader: vi.fn().mockReturnThis(),
    };
    return res;
};

export const mockNext = vi.fn();
