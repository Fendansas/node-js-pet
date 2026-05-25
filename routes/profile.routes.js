import express from 'express';
import { isAuth } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

import UserController from '../controllers/user.controller.js';
const router = express.Router();

router.get('/profile', (req, res) => UserController.getProfile(req, res));

router.get('/edit-profile', (req, res) => UserController.editProfile(req, res));
router.post('/edit-profile', (req, res) => UserController.updateProfile(req, res));


router.post('/avatar', isAuth, upload.single('avatar'),
    (req, res) => UserController.uploadAvatar(req, res)
);
router.delete(
    '/avatar',
    isAuth,
    (req, res) => UserController.deleteAvatar(req, res)
);
router.post(
    '/avatar',
    isAuth,
    (req, res, next) => {
        if (req.body._method === 'DELETE') {
            return UserController.deleteAvatar(req, res);
        }
        next();
    }
);

export default router;