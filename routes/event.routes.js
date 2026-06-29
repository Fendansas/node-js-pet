import express from 'express';
import eventController from '../controllers/event.controller.js';
import { allow } from '../middleware/permission.middleware.js';
import { createEventValidator, updateEventValidator } from '../validators/event.validator.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.get('/',
    allow('event:read'),
    (req, res) => eventController.index(req, res));

router.get('/create',
    allow('event:create'),
    (req, res) => eventController.createPage(req, res));

router.post('/create',
    allow('event:create'),
    createEventValidator,
    validate,
    (req, res) => eventController.create(req, res));

router.get('/:id',
    allow('event:read'),
    (req, res) => eventController.show(req, res));

router.get('/:id/edit',
    allow('event:update'),
    (req, res) => eventController.edit(req, res));

router.post('/:id/edit',
    allow('event:update'),
    updateEventValidator,
    validate,
    (req, res) => eventController.update(req, res));

router.post('/:id/delete',
    allow('event:delete'),
    (req, res) => eventController.delete(req, res));

export default router;
