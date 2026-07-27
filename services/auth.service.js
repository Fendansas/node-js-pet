import bcrypt from 'bcrypt';

import userRepository from '../repositories/user.repository.js';
import roleRepository from '../repositories/role.repository.js';

class AuthService {

    async register({ email, password }) {

        const existsEmail = await userRepository.findByEmail(email);
        if (existsEmail) {
            const error = new Error('EMAIL_ALREADY_EXISTS');
            error.code = 'EMAIL_ALREADY_EXISTS';
            throw error;
        }

        const userRole = await roleRepository.findByName('user');

        if (!userRole) {
            const error = new Error('DEFAULT_ROLE_NOT_FOUND');
            error.code = 'DEFAULT_ROLE_NOT_FOUND';
            throw error;
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await userRepository.create({
            username: email,
            email,
            password: hashed,
            role: userRole._id
        });

        return user;
    }

    async login({ username, password }) {

        const user = await userRepository.findByLoginCredentials(username);

        if (!user) {
            const error = new Error('INVALID_CREDS');
            error.code = 'INVALID_CREDS';
            throw error;
        }

        if (user.status !== 'active') {
            const error = new Error('USER_BANNED');
            error.code = 'USER_BANNED';
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            const error = new Error('INVALID_CREDS');
            error.code = 'INVALID_CREDS';
            throw error;
        }

        user.lastLogin = new Date();
        await user.save();

        return user;
    }

}

export default new AuthService();
