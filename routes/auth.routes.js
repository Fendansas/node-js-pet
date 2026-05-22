import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import { isAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/login', (req, res) => res.render('login'));
router.post('/login', (req, res) => AuthController.login(req, res));
router.post('/register', (req, res) => AuthController.register(req, res));
router.get('/logout', (req, res) => AuthController.logout(req, res));

export default router;