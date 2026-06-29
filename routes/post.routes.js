import express from 'express';
import PostController from '../controllers/post.controller.js';
import { allow } from '../middleware/permission.middleware.js';
import { createPostValidator, updatePostValidator } from '../validators/post.validator.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.get('/',
    allow('post:read'),
    (req, res) => PostController.index(req, res));

router.get('/create',
    allow('post:create'),
    (req, res) => PostController.createPage(req, res));

router.post('/create',
    allow('post:create'),
    createPostValidator,
    validate,
    (req, res) => PostController.create(req, res)
);

router.get('/:id',
    allow('post:read'),
    (req, res) => PostController.show(req, res));

router.get('/:id/edit',
    allow('post:update'),
    (req, res) => PostController.editPage(req, res));

router.post('/:id/update',
    allow('post:update'),
    updatePostValidator,
    validate,
    (req, res) => PostController.update(req, res)
);

router.post('/:id/delete',
    allow('post:delete'),
    (req, res) => PostController.delete(req, res));

export default router;