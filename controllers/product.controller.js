import { BaseController } from './base.controller.js';
import productService from '../services/product.service.js';
import { validationResult } from 'express-validator';
import User from '../models/user.js';
import Product from '../models/Product.js'


class ProductController extends BaseController {


    async index(req, res){

        try {
            console.log('[PRODUCT] Listing products');
            const user = await User.findById(this.getCurrentUser(req, res)?._id).populate('role');

            const category = req.query.category;

            console.log('[PRODUCT] Category filter:', category || 'all');

            const products = await productService.getAll(category);
            const categories = await productService.getCategories();

            console.log('[PRODUCT] Found', products.length, 'products');

            return this.renderView(res, 'products/index', {
                products,
                user,
                categories,
                selectedCategory: category || ''
            });

        } catch (error) {
            return this.handleError(res, error, 'Server Error');
        }
    }

    createPage(req, res){
        console.log('[PRODUCT] Showing create page');

        return this.renderView(res, 'products/create');
    }

    async create(req, res) {
        console.log('[PRODUCT] Creating new product');

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.sendValidationError(res, errors, 'products/create');
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
            return this.successRedirect(res, '/products', 'Product created');

        } catch (error) {
            return this.handleError(res, error, 'Server Error');
        }
    }

    async show(req, res) {

        console.log('[PRODUCT] Showing product:', req.params.id);

        try {
            const product = await productService.getById(req.params.id);

            if (!product) {
                console.log('[PRODUCT] Product not found:', req.params.id);
                return res.status(404).send('Product not found');
            }

            return this.renderView(res, 'products/show', { product });

        } catch (error) {
            return this.handleError(res, error, 'Server Error');
        }
    }

    async editPage(req, res) {

        console.log('[PRODUCT] Editing product:', req.params.id);

        try {
            const product = await productService.getById(req.params.id);

            if (!product) {
                return res.status(404).send('Product not found');
            }

            return this.renderView(res, 'products/edit', { product, errors: [] });

        } catch (error) {
            return this.handleError(res, error, 'Server Error');
        }
    }

    async update(req, res) {
        console.log('[PRODUCT] Updating product:', req.params.id);

        const errors = validationResult(req);
        const product = await productService.getById(req.params.id);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        if (!errors.isEmpty()) {
            return this.sendValidationError(res, errors, 'products/edit', { product });
        }

        try {
            const { title, description, price, category } = req.body;
            const updateData = { title, description, price, category };

            if (req.file) {
                updateData.image = '/uploads/' + req.file.filename;
                console.log('[PRODUCT] New image uploaded:', req.file.filename);
            }

            await productService.update(req.params.id, updateData);
            console.log('[PRODUCT] Product updated successfully');

            return this.successRedirect(res, '/products', 'Product updated');

        } catch (error) {
            return this.handleError(res, error, 'Server Error');
        }
    }

    async delete(req, res) {
        console.log('[PRODUCT] Deleting product:', req.params.id);

        try {
            await productService.delete(req.params.id);
            console.log('[PRODUCT] Product deleted successfully');
            return this.successRedirect(res, '/products', 'Product deleted');

        } catch (error) {
            return this.handleError(res, error, 'Server Error');
        }
    }


    async buyProduct(req, res) {
        console.log('[PRODUCT] Buying product:', req.params.id);
        console.log('[PRODUCT] User ID:', this.getCurrentUser(req, res)?._id);

        try {
            const userId = this.getCurrentUser(req, res)?._id;
            const productId = req.params.id;

            await productService.buyProduct(userId, productId);
            console.log('[PRODUCT] Product purchased successfully');

            return this.successRedirect(res, '/products', 'Product purchased');

        } catch (error) {
            console.log('[PRODUCT] Buy error:', error.message);

            const user = await User.findById(this.getCurrentUser(req, res)?._id)
                .populate('role')
                .populate('inventory.product');

            const products = await productService.getAll();
            const categories = await productService.getCategories();

            return this.renderView(res, 'products/index', {
                user,
                products,
                categories,
                selectedCategory: '',
                success: null,
                errors: [{ msg: error.message }]
            });
        }
    }


    async inventory(req, res) {

        console.log('[PRODUCT] Loading inventory');

        try {
            const user = await User.findById(this.getCurrentUser(req, res)?._id)
                .populate('role')
                .populate('inventory.product');

            return this.renderView(res, 'products/inventory', {
                inventory: user.inventory,
                user
            });

        } catch (error) {
            return this.handleError(res, error, 'Server Error');
        }
    }



}

export default new ProductController();