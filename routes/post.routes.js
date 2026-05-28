import express from 'express';
import PostController from '../controllers/post.controller.js';
import { isAuth } from '../middleware/auth.middleware.js';
import ProductController from "../controllers/product.controller.js";

const router = express.Router();

router.get('/', (req, res) => PostController.index(req, res));
router.get('/create', (req, res) => PostController.createPage(req, res));
router.post('/create', (req, res) => PostController.create(req, res));
router.get('/:id', (req, res) => PostController.show(req, res));
router.get('/:id/edit', (req, res) => PostController.editPage(req, res));
router.post('/:id/edit', (req, res) => PostController.edit(req, res));
export default router;