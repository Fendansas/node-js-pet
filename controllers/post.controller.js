import { BaseController } from './base.controller.js';
import User from "../models/user.js";
import postService from "../services/post.service.js";
import {validationResult} from "express-validator";
import Post from "../models/post.js";
import productService from "../services/product.service.js";

class PostController extends BaseController {
    async index(req, res) {

        try {
            console.log('[POST] Listing products');

            const categoryFilter = req.query.category;
            let filter = {};
            if (categoryFilter && categoryFilter !== 'all') {
                filter.category = categoryFilter;
            }
            const posts = await postService.getAll(filter);
            const categories = await postService.getCategories();
            const selectedCategory = categoryFilter || 'all';

            return this.renderView(res, 'posts/index', {
                posts,
                categories,
                selectedCategory
            });

        } catch (error) {
            return this.handleError(res, error, 'Server Error');
        }

    }

    async createPage(req, res) {
        console.log('[POST] Showing create page');

        const statuses = await postService.getStatuses();
        const categories = await postService.getCategories();
        console.log(statuses, categories)
        return this.renderView(res, 'posts/create',{statuses, categories});
    }

    async create(req, res) {
        console.log('[POST] Creating new product');

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.sendValidationError(res, errors, 'products/create');
        }

        try {
            const { title, content, category, status } = req.body;

            console.log('[PRODUCT] Product data:', { title, content, category, status });

            await postService.create({
                title,
                content,
                category,
                status,
                author: req.user._id
            });

            console.log('[PRODUCT] Product created successfully');
            return this.successRedirect(res, '/posts', 'Post created');

        } catch (error) {
            return this.handleError(res, error, 'Server Error');
        }
    }
    async show(req, res) {

        console.log('[POST] Showing product:', req.params.id);

        try {
            const post = await postService.getById(req.params.id);

            if (!post) {
                console.log('[PRODUCT] Product not found:', req.params.id);
                return res.status(404).send('Product not found');
            }

            return this.renderView(res, 'posts/show', { post });

        } catch (error) {
            return this.handleError(res, error, 'Server Error');
        }
    }

    async editPage (req, res){

        console.log('[POST] Showing edit page:', req.params.id);

        return this.renderView(res, 'posts/edit', {
            post: await postService.getById(req.params.id),
            statuses: await postService.getStatuses(),
            categories: await postService.getCategories()
        });
    }
    async edit(req, res){
        console.log('[POST] Edit new product');

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return this.sendValidationError(res, errors, 'products/create');
        }

        try {
            const { title, content, category, status } = req.body;

            console.log('[PRODUCT] Product data:', { title, content, category, status });
            await postService.update(req.params.id,{
                title,
                content,
                category,
                status,
                author: req.user._id
            });

            console.log('[PRODUCT] Product created successfully');
            return this.successRedirect(res, '/posts', 'Post updated');
        } catch (error) {
            return this.handleError(res, error, 'Server Error');
        }
    }
}

export default new PostController();