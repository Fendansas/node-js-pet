import { registerUser, loginUser } from '../services/auth.service.js';

export const register = async (req, res) => {
    try {
       await registerUser(req.body);
       res.redirect('/login');

    } catch (err) {
        if (err.message === 'USER_EXIST'){
            return res.status(409).send('User already exists');
        }
        res.status(500).send('Register error');
    }
};

export const login = async (req, res) => {
    try {
        const user = await loginUser(req.body);

        req.session.user = {
            id: user._id,
            username: user.username,
            role: user.role
        };
        res.redirect('/');

    } catch (err) {
        if (err.message === 'INVALID_CREDS'){
            return res.status(401).send('Invalid credentials');
        }
        res.status(500).send('Login error');
    }
};