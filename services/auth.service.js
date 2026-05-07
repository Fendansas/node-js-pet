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

    const exists = await User.findOne({ username });

    if (exists) {
        throw new Error('USER_ALREADY_EXISTS');
    }

    // ищем базовую роль
    const userRole = await Role.findOne({ name: 'user' });

    if (!userRole) {
        throw new Error('DEFAULT_ROLE_NOT_FOUND');
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hashed,
        bio,
        avatar,
        rank,
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
        throw new Error('INVALID_CREDS');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('INVALID_CREDS');
    }

    return user;
};