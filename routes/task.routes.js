import express from 'express';
import TaskController from '../controllers/task.controller.js';
import { allow } from '../middleware/permission.middleware.js';
import { TaskValidator } from '../validators/task.validator.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.get('/',
    allow('task:read'),
    (req, res) => TaskController.index(req, res));

router.get('/create',
    allow('task:create'),
    (req, res) => TaskController.createPage(req, res));

router.post('/create',
    allow('task:create'),
    TaskValidator,
    validate,
    (req, res) => TaskController.create(req, res)
);

router.get('/:id/show',
    allow('task:read'),
    (req, res) => TaskController.showPage(req, res));

router.post('/:id/add-user',
    allow('task:assign'),
    (req, res) => TaskController.addUser(req, res)
);

router.post('/:id/update-status',
    allow('task:update'),
    (req, res) => TaskController.updateStatus(req, res)
);

router.get('/:id/edit',
    allow('task:update'),
    (req, res) => TaskController.editPage(req, res));

router.post('/:id/delete',
    allow('task:delete'),
    (req, res) => TaskController.delete(req, res));

export default router;
