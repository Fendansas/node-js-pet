import { BaseController } from './base.controller.js';

class StudyController extends BaseController {

    async index(req, res) {
        return this.renderView(res, 'study/index');
    }

    async theory(req, res) {
        return this.renderView(res, 'study/theory');
    }
}

export default new StudyController();
