import { BaseController } from './base.controller.js';
import productService from '../services/product.service.js';


class ProductController extends BaseController {


    async index(req, res){
        console.log('[PRODUCT] Listing products')
        try {
            if (!req.user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const category = req.query.category;
            console.log('[PRODUCT] Category filter:', category || 'all');

            const products = await productService.getAll(category);
            const categories = await productService.getCategories();

            console.log('[PRODUCT] Found', products.length, 'products');

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

    async createPage(req, res){
        console.log('[PRODUCT] Showing create page');

        return this.renderView(res, 'products/create');
    }

    async create(req, res) {
        console.log('[PRODUCT] Creating new product');

        if (!req.file){
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }


        try {
            const { title, description, price, category } = req.body;

            console.log('[PRODUCT] Product data:', { title, price, category });

            await productService.create({
                title,
                description,
                price,
                category,
                image: '/uploads/' + req.file.filename
            });

            console.log('[PRODUCT] Product created successfully');
            return this.successRedirect(req, res, '/products', 'Product created');

        } catch (error) {
            console.error('[PRODUCT] Create error:', error);
            return this.handleError(res, error, 'Server Error');
        }
    }

    async show(req, res) {
        console.log('[PRODUCT] Showing product:', req.params.id);

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

        console.log('[PRODUCT] Editing product:', req.params.id);

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
        console.log('[PRODUCT] Updating product:', req.params.id);

        try {
            const { title, description, price, category } = req.body;
            const updateData = { title, description, price, category };

            if (req.file) {
                updateData.image = '/uploads/' + req.file.filename;
                console.log('[PRODUCT] New image uploaded:', req.file.filename);
            }

            await productService.update(req.params.id, updateData);
            console.log('[PRODUCT] Product updated successfully');

            return this.successRedirect(req, res, '/products', 'Product updated');

        } catch (error) {
            console.error('[PRODUCT] Update error:', error);
            return this.handleError(res, error, 'Server Error');
        }
    }

    async delete(req, res) {
        console.log('[PRODUCT] Deleting product:', req.params.id);

        try {
            await productService.delete(req.params.id);
            console.log('[PRODUCT] Product deleted successfully');
            return this.successRedirect(req, res, '/products', 'Product deleted');

        } catch (error) {
            console.error('[PRODUCT] Delete error:', error);
            return this.handleError(res, error, 'Server Error');
        }
    }


    async buyProduct(req, res) {
        console.log('[PRODUCT] Buying product:', req.params.id);
        console.log('[PRODUCT] User ID:', this.getCurrentUser(req, res)?._id);

        try {
            const userId = req.user._id;
            const productId = req.params.id;

            const result = await productService.buyProduct(userId, productId);
            console.log('[PRODUCT] Product purchased successfully');

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