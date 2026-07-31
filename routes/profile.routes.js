import express from 'express';
import { isAuth } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';
import { updateProfileValidator } from '../validators/user.validator.js';
import { validate } from '../middleware/validation.middleware.js';
import UserController from '../controllers/user.controller.js';
const router = express.Router();

router.get('/', (req, res) => UserController.getProfile(req, res));

router.get('/edit-profile', (req, res) => UserController.editProfile(req, res));
router.post('/edit-profile',
    isAuth,
    updateProfileValidator,
    validate,
    (req, res) => UserController.updateProfile(req, res));


router.post(
    '/avatar',
    isAuth,
    (req, res, next) => {
        const method = req.query._method || req.body._method;
        if (method === 'DELETE') {
            return UserController.deleteAvatar(req, res);
        }
        next();
    }
);

router.post('/avatar',
    isAuth,
    upload.single('avatar'),
    (req, res) => UserController.uploadAvatar(req, res)
);
router.delete(
    '/avatar',
    isAuth,
    (req, res) => UserController.deleteAvatar(req, res)
);

export default router;