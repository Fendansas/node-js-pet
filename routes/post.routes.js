import express from 'express';
import PostController from '../controllers/post.controller.js';
import { createPostValidator, updatePostValidator } from '../validators/post.validator.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.get('/', (req, res) => PostController.index(req, res));
router.get('/create', (req, res) => PostController.createPage(req, res));

router.post('/create',
    createPostValidator,
    validate,
    (req, res) => PostController.create(req, res)
);

router.get('/:id', (req, res) => PostController.show(req, res));
router.get('/:id/edit', (req, res) => PostController.editPage(req, res));

router.post('/:id/update',
    updatePostValidator,
    validate,
    (req, res) => PostController.update(req, res)
);

router.post('/:id/delete', (req, res) => PostController.delete(req, res));

export default router;