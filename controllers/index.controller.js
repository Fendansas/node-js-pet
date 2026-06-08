import { BaseController } from './base.controller.js';
import {getProfileService} from "../services/user.service.js";

export class IndexController extends BaseController {

    async getHomePage(req, res) {
        console.log('[INDEX] Loading home page');
        console.log('[INDEX] User:', this.getCurrentUser(req, res)?.username || 'not logged in');
        try {
            const user = await getProfileService(this.getCurrentUser(req, res)?._id);
            console.log('[USER] Profile loaded successfully');

            return this.renderView(res, 'index', {user});

        } catch (error) {
            return this.handleError(res, error, 'Profile error');
        }




    }
}

export default new IndexController();