import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import { isAuth } from '../middleware/auth.middleware.js';
import { validateRegister, validateLogin } from '../validators/auth.validator.js';
import { validate } from '../middleware/validation.middleware.js';
const router = express.Router();

router.get('/login', (req, res) => res.render('login'));
router.post('/login',
    validateLogin,
    validate,
    (req, res) => AuthController.login(req, res));
router.get('/register', (req, res) => res.render('register'));
router.post('/register',
    validateRegister,
    validate,
    (req, res) => AuthController.register(req, res));
router.get('/logout', (req, res) => AuthController.logout(req, res));

export default router;