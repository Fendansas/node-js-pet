import express from 'express';
import { isAuth } from '../middleware/auth.middleware.js';
import {editProfile, getProfile, updateProfile} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', isAuth, getProfile);

router.get('/edit-profile', isAuth, editProfile);
router.post('/edit-profile', isAuth, updateProfile);

export default router;