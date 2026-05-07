import {
    registerUser,
    loginUser
} from '../services/auth.service.js';

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

        req.session.user = {
            id: user._id,
            username: user.username
        };

        user.lastLogin = new Date();
        await user.save();

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

    req.session.destroy(() => {
        res.redirect('/login');
    });
};