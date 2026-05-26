import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import { isAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', (req, res) => AuthController.login(req, res));
router.post('/register', (req, res) => AuthController.apiRegister(req, res));

router.get('/sas', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Sas'
    });
});

export default router;