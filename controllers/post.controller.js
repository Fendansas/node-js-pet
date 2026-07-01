import { BaseController } from './base.controller.js';
import PostService from '../services/post.service.js';

class PostController extends BaseController {

    async index(req, res) {
        console.log('[POST] Listing posts');

        try {
            const posts = await PostService.getAll();
            const selectedCategory = req.query.category || 'all';
            
            const allCategories = [...new Set(posts.map(p => p.category).filter(Boolean))];
            const categories = ['all', ...allCategories];

            console.log('[POST] Found', posts.length, 'posts');

            return this.renderView(res, 'posts/index', { posts, selectedCategory, categories });
        } catch (error) {
            console.error('[POST] Index error:', error);
            return this.handleError(res, error, 'Posts list error');
        }
    }

    async createPage(req, res) {
        console.log('[POST] Showing create page');
        const categories = ['weapon', 'anomaly', 'news', 'blog'];
        const statuses = ['draft', 'published'];
        return this.renderView(res, 'posts/create', { categories, statuses });
    }

    async create(req, res) {
        console.log('[POST] Creating new post');

        try {
            const { title, content, category, status } = req.body;

            const author = req.user ? req.user._id : null;

            await PostService.create({
                title,
                content,
                category,
                status,
                author
            });

            console.log('[POST] Post created successfully');
            return this.successRedirect(req, res, '/posts', 'Post created');
        } catch (error) {
            console.error('[POST] Create error:', error);
            return this.handleError(res, error, 'Create post error');
        }
    }

    async show(req, res) {
        console.log('[POST] Showing post:', req.params.id);

        try {
            const post = await PostService.getById(req.params.id);

            if (!post) {
                console.log('[POST] Post not found:', req.params.id);
                return res.status(404).send('Post not found');
            }

            return this.renderView(res, 'posts/show', { post });
        } catch (error) {
            console.error('[POST] Show error:', error);
            return this.handleError(res, error, 'Show post error');
        }
    }

    async editPage(req, res) {
        console.log('[POST] Editing post:', req.params.id);

        try {
            const post = await PostService.getById(req.params.id);

            if (!post) {
                console.log('[POST] Post not found:', req.params.id);
                return res.status(404).send('Post not found');
            }

            const categories = ['weapon', 'anomaly', 'news', 'blog'];
            const statuses = ['draft', 'published'];

            return this.renderView(res, 'posts/edit', { post, categories, statuses });
        } catch (error) {
            console.error('[POST] Edit page error:', error);
            return this.handleError(res, error, 'Edit post error');
        }
    }

    async update(req, res) {
        console.log('[POST] Updating post:', req.params.id);

        try {
            const { title, content, category, status } = req.body;

            await PostService.update(req.params.id, {
                title,
                content,
                category,
                status
            });

            console.log('[POST] Post updated successfully');
            return this.successRedirect(req, res, '/posts', 'Post updated');
        } catch (error) {
            console.error('[POST] Update error:', error);
            return this.handleError(res, error, 'Update post error');
        }
    }

    async delete(req, res) {
        console.log('[POST] Deleting post:', req.params.id);

        try {
            await PostService.delete(req.params.id);
            console.log('[POST] Post deleted successfully');
            return this.successRedirect(req, res, '/posts', 'Post deleted');
        } catch (error) {
            console.error('[POST] Delete error:', error);
            return this.handleError(res, error, 'Delete post error');
        }
    }
}

export default new PostController();
