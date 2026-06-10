import { BaseController } from './base.controller.js';
import {validationResult} from "express-validator";
import TaskService from '../services/task.service.js';
import EventService from '../services/event.service.js';
import {getAllUsersService} from '../services/user.service.js';
// import {validationResult} from "express-validator";


class TaskController extends BaseController {

    async createPage(req, res) {
        console.log('[TASK] Showing create page');
        const {eventId} = req.query;
        return this.renderView(res, 'tasks/create', {eventId});
    }

    async create(req, res) {
        console.log('[TASK] Creating new task');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const eventId = req.body.eventId;
            return this.renderView(res, `tasks/create/?eventId=<%= eventId %>`, {errors});
        }

        try {
            const {eventId, title, description, reward, status} = req.body;
            console.log('[EVENT] event data:', { eventId, title, description, reward, status });

            await TaskService.createTask({eventId, title, description, reward, status});

            return this.renderView(res, 'tasks/create', {task});

        } catch (error){
            console.log(error);
            return this.renderView(res, 'events', {errors: [error.message]});
        }

    }

    async showPage(req, res) {
        console.log('[TASK] Showing show page');

        try {
            const task = await TaskService.getTaskById(req.params.id);
            const event = await EventService.getEventById(task.eventId)
            const users = await getAllUsersService();

            return this.renderView(res, 'tasks/show', {task, event, users});
        } catch (error) {
            console.error(error);
            return this.renderView(res, 'tasks/show', {
                errors: [error.message],
                task: null,
                event: null,
                users: []
            });
        }
    }

    async addUser(req,res){
        console.log('[TASK] Add user to task');
        try {
            console.log('user',req.body.userId )
            console.log('task',req.body.taskId )
            const userId = req.body.userId
            await TaskService.addUserToTask(req.body.taskId, req.body.userId);
            return res.redirect(`/tasks/${req.body.taskId}/show`);

        } catch (error) {
            console.error('[TASK] Error adding user:', error);

        }
    }

    async editPage(){
        console.log('[TASK] Showing edit page');
        const users = await UserService.getAllUsers();
        const task = await TaskService.getTaskById(req.params.id);


        return this.renderView(res, 'tasks/edit', {task});
    }
}

export default new TaskController();