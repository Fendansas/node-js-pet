import { BaseController } from './base.controller.js';

export class IndexController extends BaseController {

    getHomePage(req, res) {
        console.log('[INDEX] Loading home page');
        console.log('[INDEX] User:', this.getCurrentUser(req, res)?.username || 'not logged in');

        return this.renderView(res, 'index', {
            user: this.getCurrentUser(req, res) || null
        });
    }
}

export default new IndexController();