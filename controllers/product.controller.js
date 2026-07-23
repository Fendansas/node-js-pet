import { BaseController } from './base.controller.js';
import productService from '../services/product.service.js';

class ProductController extends BaseController {

    async index(req, res) {
        console.log('[PRODUCT] Listing products');

        try {
            if (!req.user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const category = req.query.category;
            const products = await productService.getAll(category);
            const categories = await productService.getCategories();

            return this.renderView(res, 'products/index', {
                products,
                user: req.user,
                categories,
                selectedCategory: category || ''
            });

        } catch (error) {
            console.error('[PRODUCT] Index error:', error);
            return this.handleError(res, error, 'Index error');
        }
    }

    async createPage(req, res) {
        return this.renderView(res, 'products/create');
    }

    async create(req, res) {
        console.log('[PRODUCT] Creating new item');

        try {
            const data = { ...req.body };

            if (req.file) {
                data.imageUrl = '/uploads/' + req.file.filename;
            }

            await productService.create(data);

            return this.successRedirect(req, res, '/products', 'Item created');

        } catch (error) {
            console.error('[PRODUCT] Create error:', error);
            return this.handleError(res, error, 'Server Error');
        }
    }

    async show(req, res) {
        console.log('[PRODUCT] Showing item:', req.params.id);

        try {
            const product = await productService.getById(req.params.id);
            return this.renderView(res, 'products/show', { product });

        } catch (error) {
            console.error('[PRODUCT] Show error:', error);

            if (error.code === 'PRODUCT_NOT_FOUND') {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            return this.handleError(res, error, 'Server Error');
        }
    }

    async editPage(req, res) {
        console.log('[PRODUCT] Editing item:', req.params.id);

        try {
            const product = await productService.getById(req.params.id);
            return this.renderView(res, 'products/edit', { product, errors: [] });

        } catch (error) {
            console.error('[PRODUCT] Edit page error:', error);

            if (error.code === 'PRODUCT_NOT_FOUND') {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            return this.handleError(res, error, 'Server Error');
        }
    }

    async update(req, res) {
        console.log('[PRODUCT] Updating item:', req.params.id);

        try {
            const updateData = { ...req.body };

            if (req.file) {
                updateData.imageUrl = '/uploads/' + req.file.filename;
            }

            await productService.update(req.params.id, updateData);

            return this.successRedirect(req, res, '/products', 'Item updated');

        } catch (error) {
            console.error('[PRODUCT] Update error:', error);
            return this.handleError(res, error, 'Server Error');
        }
    }

    async delete(req, res) {
        console.log('[PRODUCT] Deleting item:', req.params.id);

        try {
            await productService.delete(req.params.id);
            return this.successRedirect(req, res, '/products', 'Item deleted');

        } catch (error) {
            console.error('[PRODUCT] Delete error:', error);
            return this.handleError(res, error, 'Server Error');
        }
    }

    async buyProduct(req, res) {
        console.log('[PRODUCT] Buying product:', req.params.id);

        try {
            const userId = req.user._id;
            const productId = req.params.id;

            await productService.buyProduct(userId, productId);

            return this.successRedirect(req, res, '/products', 'Product purchased');

        } catch (error) {
            console.log('[PRODUCT] Buy error:', error.message);

            if (error.code === 'USER_NOT_FOUND') {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            if (error.code === 'PRODUCT_NOT_FOUND') {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            if (error.code === 'INSUFFICIENT_FUNDS') {
                return res.status(400).json({ success: false, message: 'Not enough money' });
            }

            return this.handleError(res, error, 'Buy error');
        }
    }

    async inventory(req, res) {
        console.log('[PRODUCT] Loading inventory');

        try {
            if (!req.user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const inventory = await productService.getUserInventory(req.user._id);

            return this.renderView(res, 'products/inventory', {
                inventory,
                user: req.user
            });

        } catch (error) {
            console.error('[PRODUCT] Inventory error:', error);
            return this.handleError(res, error, 'Server Error');
        }
    }
}

export default new ProductController();
