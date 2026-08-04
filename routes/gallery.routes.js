import express from 'express';
import GalleryController from '../controllers/gallery.controller.js';
import { allow } from '../middleware/permission.middleware.js';
import { uploadGallery } from '../middleware/upload.js';
import { galleryUploadValidator } from '../validators/gallery.validator.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.get(
    '/',
    allow('gallery:read'),
    (req, res) => GalleryController.index(req, res)
);

router.post(
    '/upload',
    allow('gallery:create'),
    uploadGallery.single('image'),
    galleryUploadValidator,
    validate,
    (req, res) => GalleryController.upload(req, res)
);

router.post(
    '/:id/delete',
    allow('gallery:create'),
    (req, res) => GalleryController.delete(req, res)
);

router.get(
    '/moderation',
    allow('gallery:moderate'),
    (req, res) => GalleryController.moderation(req, res)
);

router.post(
    '/:id/approve',
    allow('gallery:moderate'),
    (req, res) => GalleryController.approve(req, res)
);

router.post(
    '/:id/reject',
    allow('gallery:moderate'),
    (req, res) => GalleryController.reject(req, res)
);

export default router;
