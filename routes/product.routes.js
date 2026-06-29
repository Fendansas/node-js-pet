import express from 'express';
import ProductController from '../controllers/product.controller.js';
import { isAuth } from '../middleware/auth.middleware.js';
import { allow } from '../middleware/permission.middleware.js';
import { createProductValidator } from '../validators/product.validator.js';
import { validate } from '../middleware/validation.middleware.js';
const router = express.Router();

router.get('/',
    allow('product:read'),
    (req, res) => ProductController.index(req, res));

router.get('/create',
    allow('product:create'),
    (req, res) => ProductController.createPage(req, res));

router.post('/create',
    allow('product:create'),
    createProductValidator,
    validate,
    (req, res) => ProductController.create(req, res));

router.get('/:id',
    allow('product:read'),
    (req, res) => ProductController.show(req, res));

router.get('/:id/edit',
    allow('product:update'),
    (req, res) => ProductController.editPage(req, res));

router.post('/:id/update',
    allow('product:update'),
    createProductValidator,
    validate,
    (req, res) => ProductController.update(req, res));

router.post('/:id/delete',
    allow('product:delete'),
    (req, res) => ProductController.delete(req, res));

router.post('/:id/buy',
    allow('product:buy'),
    (req, res) => ProductController.buyProduct(req, res));

router.get('/inventory',
    allow('product:inventory'),
    (req, res) => ProductController.inventory(req, res));

export default router;