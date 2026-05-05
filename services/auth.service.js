import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const registerUser = async ({username, email, password, bio, avatar, rank}) => {
    const exists = await User.findOne({ username });
    if (exists) {
        throw new Error('USER_EXIST');
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hashed,
        bio,
        avatar,
        rank
    });
    return user;
};

export const loginUser = async ({username, password})=>{

    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('INVALID_CREDS');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('INVALID_CREDS');
    }
    return user;
}
