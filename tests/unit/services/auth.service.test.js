import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../repositories/user.repository.js', () => ({
    default: {
        findByUsername: vi.fn(),
        findByEmail: vi.fn(),
        create: vi.fn(),
        findByLoginCredentials: vi.fn(),
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
        it('should throw USER_ALREADY_EXISTS if username exists', async () => {
            userRepository.findByUsername.mockResolvedValue({ _id: 'exists' });

            await expect(
                AuthService.register({ username: 'test', email: 't@t.com', password: '123' })
            ).rejects.toThrow('USER_ALREADY_EXISTS');
        });

        it('should throw EMAIL_ALREADY_EXISTS if email exists', async () => {
            userRepository.findByUsername.mockResolvedValue(null);
            userRepository.findByEmail.mockResolvedValue({ _id: 'exists' });

            await expect(
                AuthService.register({ username: 'test', email: 't@t.com', password: '123' })
            ).rejects.toThrow('EMAIL_ALREADY_EXISTS');
        });

        it('should throw DEFAULT_ROLE_NOT_FOUND if role not found', async () => {
            userRepository.findByUsername.mockResolvedValue(null);
            userRepository.findByEmail.mockResolvedValue(null);
            roleRepository.findByName.mockResolvedValue(null);

            await expect(
                AuthService.register({ username: 'test', email: 't@t.com', password: '123' })
            ).rejects.toThrow('DEFAULT_ROLE_NOT_FOUND');
        });

        it('should create user with hashed password', async () => {
            userRepository.findByUsername.mockResolvedValue(null);
            userRepository.findByEmail.mockResolvedValue(null);
            roleRepository.findByName.mockResolvedValue({ _id: 'role1', name: 'user' });
            bcrypt.hash.mockResolvedValue('hashed_password');
            userRepository.create.mockResolvedValue({ _id: 'new', username: 'test' });

            const result = await AuthService.register({
                username: 'test', email: 't@t.com', password: '123'
            });

            expect(bcrypt.hash).toHaveBeenCalledWith('123', 10);
            expect(userRepository.create).toHaveBeenCalledWith({
                username: 'test',
                email: 't@t.com',
                password: 'hashed_password',
                bio: '',
                avatar: null,
                rank: 'stalker',
                role: 'role1'
            });
            expect(result.username).toBe('test');
        });

        it('should work without email', async () => {
            userRepository.findByUsername.mockResolvedValue(null);
            roleRepository.findByName.mockResolvedValue({ _id: 'role1', name: 'user' });
            bcrypt.hash.mockResolvedValue('hashed');
            userRepository.create.mockResolvedValue({ _id: 'new' });

            await AuthService.register({ username: 'test', password: '123' });

            expect(userRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({ email: null })
            );
        });
    });

    describe('login', () => {
        it('should throw INVALID_CREDS if user not found', async () => {
            userRepository.findByLoginCredentials.mockResolvedValue(null);

            await expect(
                AuthService.login({ username: 'no', password: '123' })
            ).rejects.toThrow('INVALID_CREDS');
        });

        it('should throw USER_BANNED if user is banned', async () => {
            userRepository.findByLoginCredentials.mockResolvedValue({
                _id: 'u1', password: 'hash', status: 'banned'
            });

            await expect(
                AuthService.login({ username: 'test', password: '123' })
            ).rejects.toThrow('USER_BANNED');
        });

        it('should throw INVALID_CREDS if password is wrong', async () => {
            userRepository.findByLoginCredentials.mockResolvedValue({
                _id: 'u1', password: 'hash', status: 'active', save: vi.fn()
            });
            bcrypt.compare.mockResolvedValue(false);

            await expect(
                AuthService.login({ username: 'test', password: 'wrong' })
            ).rejects.toThrow('INVALID_CREDS');
        });

        it('should return user on successful login', async () => {
            const mockUser = {
                _id: 'u1', password: 'hash', status: 'active',
                lastLogin: null, save: vi.fn()
            };
            userRepository.findByLoginCredentials.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);

            const result = await AuthService.login({ username: 'test', password: '123' });

            expect(result.save).toHaveBeenCalled();
            expect(result.lastLogin).toBeInstanceOf(Date);
        });
    });
});
