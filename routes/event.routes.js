import express from 'express';
import eventController from '../controllers/event.controller.js';
import PostController from "../controllers/post.controller.js";

const router = express.Router();

router.get('/',(req, res) => eventController.index(req, res));

router.get('/create', (req, res) => eventController.createPage(req, res));
router.post('/create', (req, res) => eventController.create(req, res));
router.get('/:id', (req, res) => eventController.show(req, res));

router.get('/:id/edit', (req, res) => eventController.edit(req, res));
router.post('/:id/edit', (req, res) => eventController.update(req, res));
router.post('/:id/delete', (req, res) => eventController.delete(req, res));

export default router;
