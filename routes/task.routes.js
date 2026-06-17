import express from 'express';
import TaskController from '../controllers/task.controller.js';
import { TaskValidator } from '../validators/task.validator.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.get('/create', (req, res) => TaskController.createPage(req, res));

router.post('/create',
    TaskValidator,
    validate,
    (req, res) => TaskController.create(req, res)
);

router.get('/:id/show', (req, res) => TaskController.showPage(req, res));

router.post('/:id/add-user',
    (req, res) => TaskController.addUser(req, res)
);

router.post('/:id/update-status',
    (req, res) => TaskController.updateStatus(req, res)
);

router.get('/:id/edit', (req, res) => TaskController.editPage(req, res));

export default router;
