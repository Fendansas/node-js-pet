import { BaseController } from './base.controller.js';
import AuthService from '../services/auth.service.js';

export class AuthController extends BaseController {
    async register(req, res) {
        console.log('[AUTH] Register attempt:', req.body.username);

        try {
            await AuthService.register(req.body);
            console.log('[AUTH] User registered successfully');

            return this.successRedirect(req, res, '/login', 'Registration successful');

        } catch (err) {

            console.log('[AUTH] Register error:', err.message);
            if (err.message === 'USER_ALREADY_EXISTS'){
                return res.status(409).json({ success: false, message: 'User already exists' });
            }

            if(err.message === 'DEFAULT_ROLE_NOT_FOUND'){
                return res.status(500).json({ success: false, message: 'Default role not found' });
            }

            if (err.message === 'EMAIL_ALREADY_EXISTS') {
                return res.status(409).json({ success: false, message: 'Email already exists' });
            }

            return this.handleError(res, err, 'Register error');
        }
    }

    async login (req, res){
        console.log('[AUTH] Login attempt:', req.body.username);

        try {
            const user = await AuthService.login(req.body);

            req.session.user = {
                id: user._id,
                username: user.username
            }

            console.log('[AUTH] User logged in:', user.username);

            return this.successRedirect(req, res, '/', 'Login successful');
        } catch (err) {
            console.log('[AUTH] Login error:', err.message);

            if (err.message === 'INVALID_CREDS'){
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            if (err.message === 'USER_BANNED'){
                return res.status(403).json({ success: false, message: 'Account is banned' });
            }

            return this.handleError(res, err, 'Login error');
        }
    }

    async logout(req, res) {
        console.log('[AUTH] Logout attempt');
        return new Promise((resolve)=>{
            req.session.destroy((err)=>{
                if(err){
                    console.error('[AUTH] Session destroy error:', err);
                    return resolve(this.handleError(res, err, 'Logout error'));
                }
                console.log('[AUTH] Session destroyed')
                return resolve(this.successRedirect(req, res, '/login', 'Logged out successfully'));
            })
        })
    }

    async apiRegister(req, res) {
        console.log('[API] Register attempt:', req.body.username);

        try {
            const user = await AuthService.register(req.body);
            console.log('[API] User registered successfully:', user._id);

            return res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            });
        } catch (err) {
            console.log('[API] Register error:', err.message);

            if (err.message === 'USER_ALREADY_EXISTS') {
                return res.status(409).json({
                    success: false,
                    message: 'User already exists'
                });
            }

            if (err.message === 'EMAIL_ALREADY_EXISTS') {
                return res.status(409).json({
                    success: false,
                    message: 'Email already exists'
                });
            }

            if (err.message === 'DEFAULT_ROLE_NOT_FOUND') {
                return res.status(500).json({
                    success: false,
                    message: 'Default role not found'
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
}

export default new AuthController();
