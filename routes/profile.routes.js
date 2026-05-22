import express from 'express';
import { isAuth } from '../middleware/auth.middleware.js';

import UserController from '../controllers/user.controller.js';
const router = express.Router();

router.get('/profile', (req, res) => UserController.getProfile(req, res));

router.get('/edit-profile', (req, res) => UserController.editProfile(req, res));
router.post('/edit-profile', (req, res) => UserController.updateProfile(req, res));

export default router;