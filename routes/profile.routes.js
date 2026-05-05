import express from 'express';
import { isAuth } from '../middleware/auth.middleware.js';
import { getProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', isAuth, getProfile);

export default router;