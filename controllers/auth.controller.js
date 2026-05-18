import {
    registerUser,
    loginUser
} from '../services/auth.service.js';

import { generateToken } from '../utils/jwt.js';

export const register = async (req, res) => {

    try {

        await registerUser(req.body);

        res.redirect('/login');

    } catch (err) {

        console.log(err);

        if (err.message === 'USER_ALREADY_EXISTS') {
            return res.status(409).send('User already exists');
        }

        if (err.message === 'DEFAULT_ROLE_NOT_FOUND') {
            return res.status(500).send('Default role not found');
        }

        res.status(500).send('Register error');
    }
};

export const login = async (req, res) => {

    try {

        const user = await loginUser(req.body);

        const token = generateToken({
            id: user._id,
            username: user.username,
            role: user.role
        });

        // req.session.user = {
        //     id: user._id,
        //     username: user.username
        // };

        user.lastLogin = new Date();
        await user.save();

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60
        });

        res.redirect('/');

    } catch (err) {

        console.log(err);

        if (err.message === 'INVALID_CREDS') {
            return res.status(401).send('Invalid credentials');
        }

        res.status(500).send('Login error');
    }
};

export const logout = async (req, res) => {

    res.clearCookie('token');
    res.redirect('/login');

    // req.session.destroy(() => {
    //     res.redirect('/login');
    // });
};