import express from 'express';
import ProductController from '../controllers/product.controller.js';
import { isAuth } from '../middleware/auth.middleware.js';
import { createProductValidator } from '../validators/product.validator.js';
import { validate } from '../middleware/validation.middleware.js';
const router = express.Router();

router.get('/', (req, res) => ProductController.index(req, res));
router.get('/create', isAuth, (req, res) => ProductController.createPage(req, res));
router.post('/create',
    isAuth,
    createProductValidator,
    validate,
    (req, res) => ProductController.create(req, res));
router.get('/:id', (req, res) => ProductController.show(req, res));
router.get('/:id/edit', isAuth, (req, res) => ProductController.editPage(req, res));
router.post('/:id/update',
    isAuth,
    createProductValidator,
    validate,
    (req, res) => ProductController.update(req, res));
router.post('/:id/delete', isAuth, (req, res) => ProductController.delete(req, res));
router.post('/:id/buy', isAuth, (req, res) => ProductController.buyProduct(req, res));
router.get('/inventory', isAuth, (req, res) => ProductController.inventory(req, res));

export default router;