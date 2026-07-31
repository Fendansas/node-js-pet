import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../repositories/user.repository.js', () => ({
    default: {
        findByEmail: vi.fn(),
        findByEmailWithRole: vi.fn(),
        create: vi.fn(),
    }
}));

vi.mock('../../../repositories/role.repository.js', () => ({
    default: {
        findByName: vi.fn(),
    }
}));

vi.mock('bcrypt', () => ({
    default: {
        hash: vi.fn(),
        compare: vi.fn(),
    }
}));

import bcrypt from 'bcrypt';
import userRepository from '../../../repositories/user.repository.js';
import roleRepository from '../../../repositories/role.repository.js';
import AuthService from '../../../services/auth.service.js';

describe('AuthService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('register', () => {
        it('should throw WRONG_PASSWORD if email exists but password does not match', async () => {
            userRepository.findByEmail.mockResolvedValue({ _id: 'exists', password: 'hash' });
            bcrypt.compare.mockResolvedValue(false);

            await expect(
                AuthService.register({ email: 't@t.com', password: 'wrong' })
            ).rejects.toThrow('WRONG_PASSWORD');
        });

        it('should return existing user without creating if email exists and password matches', async () => {
            const existingUser = { _id: 'exists', email: 't@t.com', password: 'hash' };
            userRepository.findByEmail.mockResolvedValue(existingUser);
            bcrypt.compare.mockResolvedValue(true);

            const result = await AuthService.register({ email: 't@t.com', password: '123456' });

            expect(result).toEqual({ user: existingUser, isNew: false });
            expect(userRepository.create).not.toHaveBeenCalled();
        });

        it('should throw DEFAULT_ROLE_NOT_FOUND if role not found', async () => {
            userRepository.findByEmail.mockResolvedValue(null);
            roleRepository.findByName.mockResolvedValue(null);

            await expect(
                AuthService.register({ email: 't@t.com', password: '123456' })
            ).rejects.toThrow('DEFAULT_ROLE_NOT_FOUND');
        });

        it('should create user with hashed password', async () => {
            userRepository.findByEmail.mockResolvedValue(null);
            roleRepository.findByName.mockResolvedValue({ _id: 'role1', name: 'user' });
            bcrypt.hash.mockResolvedValue('hashed_password');
            userRepository.create.mockResolvedValue({ _id: 'new', email: 't@t.com' });

            const result = await AuthService.register({
                email: 't@t.com', password: '123456'
            });

            expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
            expect(userRepository.create).toHaveBeenCalledWith({
                username: 't@t.com',
                email: 't@t.com',
                password: 'hashed_password',
                role: 'role1'
            });
            expect(result).toEqual({ user: { _id: 'new', email: 't@t.com' }, isNew: true });
        });
    });

    describe('login', () => {
        it('should throw INVALID_CREDS if user not found', async () => {
            userRepository.findByEmailWithRole.mockResolvedValue(null);

            await expect(
                AuthService.login({ email: 'no@t.com', password: '123456' })
            ).rejects.toThrow('INVALID_CREDS');
        });

        it('should throw USER_BANNED if user is banned', async () => {
            userRepository.findByEmailWithRole.mockResolvedValue({
                _id: 'u1', password: 'hash', status: 'banned'
            });

            await expect(
                AuthService.login({ email: 't@t.com', password: '123456' })
            ).rejects.toThrow('USER_BANNED');
        });

        it('should throw INVALID_CREDS if password is wrong', async () => {
            userRepository.findByEmailWithRole.mockResolvedValue({
                _id: 'u1', password: 'hash', status: 'active', save: vi.fn()
            });
            bcrypt.compare.mockResolvedValue(false);

            await expect(
                AuthService.login({ email: 't@t.com', password: 'wrong' })
            ).rejects.toThrow('INVALID_CREDS');
        });

        it('should return user on successful login', async () => {
            const mockUser = {
                _id: 'u1', password: 'hash', status: 'active',
                lastLogin: null, save: vi.fn()
            };
            userRepository.findByEmailWithRole.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);

            const result = await AuthService.login({ email: 't@t.com', password: '123456' });

            expect(result.save).toHaveBeenCalled();
            expect(result.lastLogin).toBeInstanceOf(Date);
        });
    });
});
