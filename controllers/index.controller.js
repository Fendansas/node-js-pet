import { BaseController } from './base.controller.js';
import {getProfileService} from "../services/user.service.js";

export class IndexController extends BaseController {

    async getHomePage(req, res) {
        console.log('[INDEX] Loading home page');
        console.log('[INDEX] User:', this.getCurrentUser(req, res)?.username || 'not logged in');

        try {
            const currentUser = this.getCurrentUser(req, res);
            const userId = currentUser?._id;

            let user = null;
            if (userId) {
                user = await getProfileService(userId);
                console.log('[USER] Profile loaded successfully');
            }

            return this.renderView(res, 'index', { user });

        } catch (error) {
            console.error('[INDEX] Error:', error);
            return this.handleError(res, error, 'Home page error');
        }
    }
}

export default new IndexController();