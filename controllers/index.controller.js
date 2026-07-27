import { BaseController } from './base.controller.js';
import UserService from '../services/user.service.js';
import IndexService from '../services/index.service.js';


export class IndexController extends BaseController {

    async getHomePage(req, res) {
        console.log('[INDEX] Loading home page');
        console.log('[INDEX] User:', this.getCurrentUser(req, res)?.username || 'not logged in');

        try {
            const currentUser = this.getCurrentUser(req, res);
            const userId = currentUser?._id;

            let user = null;
            let latestItems = [];
            let latestProducts = [];
            let totalItems = 0;
            let consumedItems = 0;

            if (userId) {
                user = await UserService.getProfile(userId);

                const homeData = await IndexService.getHomePageData(userId);
                latestItems = homeData.latestItems;
                latestProducts = homeData.latestProducts;
                totalItems = homeData.totalItems;
                consumedItems = homeData.consumedItems;
            }

            return this.renderView(res, 'index', { user, latestItems, latestProducts, totalItems, consumedItems });

        } catch (error) {
            console.error('[INDEX] Error:', error);
            return this.handleError(res, error, 'Home page error');
        }
    }
}

export default new IndexController();