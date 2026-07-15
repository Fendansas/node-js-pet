import { Router } from 'express';
import overlayController from '../controllers/overlay.controller.js';
import { uploadOverlay } from '../middleware/upload.js';
import { allow } from '../middleware/permission.middleware.js';

const router = Router();

router.get('/', allow('overlay:read'), (req, res) => overlayController.index(req, res));

router.post(
    '/upload',
    allow('overlay:create'),
    uploadOverlay.single('image'),
    (req, res) => overlayController.uploadImage(req, res)
);

router.post('/', allow('overlay:create'), (req, res) => overlayController.store(req, res));

router.put('/:id', allow('overlay:update'), (req, res) => overlayController.update(req, res));
router.patch('/:id', allow('overlay:update'), (req, res) => overlayController.update(req, res));

router.delete('/:id', allow('overlay:delete'), (req, res) => overlayController.destroy(req, res));

export default router;
