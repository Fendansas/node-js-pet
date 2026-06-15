import bcrypt from 'bcrypt';

import User from '../models/user.js';
import Role from '../models/role.js';

export const registerUser = async ({
                                       username,
                                       email,
                                       password,
                                       bio,
                                       avatar,
                                       rank
                                   }) => {

    const existsUsername = await User.findOne({ username });

    if (existsUsername) {
        const error = new Error('USER_ALREADY_EXISTS')
        error.code = 'USER_ALREADY_EXISTS'
        throw error;
    }

    if (email){
        const existsEmail = await User.findOne({email})
        if (existsEmail) {
            const error = new Error('EMAIL_ALREADY_EXISTS')
            error.code = 'EMAIL_ALREADY_EXISTS'
            throw error;
        }
    }

    const userRole = await Role.findOne({ name: 'user' });

    if (!userRole) {
        const error = new Error('DEFAULT_ROLE_NOT_FOUND')
        error.code = 'DEFAULT_ROLE_NOT_FOUND';
        throw error;
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email: email || null,
        password: hashed,
        bio: bio || '',
        avatar: avatar || null,
        rank: rank || 'stalker',
        role: userRole._id
    });

    return user;
};

export const loginUser = async ({ username, password }) => {

    const user = await User.findOne({ username })
        .populate({
            path: 'role',
            populate: {
                path: 'permissions'
            }
        });

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

    return user;
};