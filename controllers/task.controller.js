import { BaseController } from './base.controller.js';
import TaskService from '../services/task.service.js';
import EventService from '../services/event.service.js';
import UserService from '../services/user.service.js';

class TaskController extends BaseController {

    async index(req, res) {
        console.log('[TASK] Listing all tasks');

        try {
            const tasks = await TaskService.getAllTasks();
            console.log('[TASK] Found', tasks.length, 'tasks');

            return this.renderView(res, 'tasks/index', { tasks });
        } catch (error) {
            console.error('[TASK] Index error:', error);
            return this.handleError(res, error, 'Tasks list error');
        }
    }

    async createPage(req, res) {
        console.log('[TASK] Showing create page');
        const { eventId } = req.query;
        return this.renderView(res, 'tasks/create', { eventId });
    }

    async create(req, res) {
        console.log('[TASK] Creating new task');

        try {
            const { eventId, title, description, reward, status } = req.body;
            console.log('[TASK] Task data:', { eventId, title, description, reward, status });

            const task = await TaskService.createTask({ eventId, title, description, reward, status });
            console.log('[TASK] Task created successfully:', task._id);

            return res.redirect(`/tasks/${task._id}/show`);
        } catch (error) {
            console.error('[TASK] Create error:', error);

            if (error.code === 'EVENT_ID_REQUIRED') {
                return res.status(400).json({ success: false, message: 'Event ID is required' });
            }

            return this.renderView(res, 'tasks/create', { errors: [error.message] });
        }
    }

    async showPage(req, res) {
        console.log('[TASK] Showing task:', req.params.id);

        try {
            const task = await TaskService.getTaskById(req.params.id);

            let event = null;
            if (task.eventId) {
                try {
                    event = await EventService.getEventById(task.eventId);
                } catch (eventError) {
                    console.log('[TASK] Event not found for task:', task.eventId);
                }
            }

            const { users } = await UserService.getAll();

            return this.renderView(res, 'tasks/show', { task, event, users });
        } catch (error) {
            console.error('[TASK] Show page error:', error);

            if (error.code === 'TASK_NOT_FOUND') {
                return res.status(404).json({ success: false, message: 'Task not found' });
            }

            return this.handleError(res, error, 'Show task error');
        }
    }

    async addUser(req, res) {
        console.log('[TASK] Adding user to task');

        try {
            const { taskId, userId } = req.body;
            console.log('[TASK] User:', userId, 'Task:', taskId);

            await TaskService.addUserToTask(taskId, userId);
            console.log('[TASK] User added to task successfully');

            return res.redirect(`/tasks/${taskId}/show`);
        } catch (error) {
            console.error('[TASK] Add user error:', error);

            if (error.code === 'TASK_NOT_FOUND') {
                return res.status(404).json({ success: false, message: 'Task not found' });
            }

            if (error.code === 'USER_ALREADY_ASSIGNED') {
                return res.status(400).json({ success: false, message: 'User already assigned to this task' });
            }

            return this.handleError(res, error, 'Add user error');
        }
    }

    async updateStatus(req, res) {
        console.log('[TASK] Updating status for task:', req.params.id);

        try {
            const taskId = req.params.id;
            const { userId, status, assignmentId } = req.body;

            await TaskService.updateAssignmentStatus(taskId, assignmentId, userId, status);

            console.log('[TASK] Status updated successfully');
            return res.redirect(`/tasks/${taskId}/show`);
        } catch (error) {
            console.error('[TASK] Update status error:', error);

            if (error.code === 'INVALID_STATUS') {
                return res.status(400).json({ success: false, message: 'Invalid status' });
            }

            if (error.code === 'USER_NOT_ASSIGNED') {
                return res.status(400).json({ success: false, message: 'User is not assigned to this task' });
            }

            return this.handleError(res, error, 'Update status error');
        }
    }

    async editPage(req, res) {
        console.log('[TASK] Editing task:', req.params.id);

        try {
            const task = await TaskService.getTaskById(req.params.id);
            return this.renderView(res, 'tasks/edit', { task });
        } catch (error) {
            console.error('[TASK] Edit page error:', error);

            if (error.code === 'TASK_NOT_FOUND') {
                return res.status(404).json({ success: false, message: 'Task not found' });
            }

            return this.handleError(res, error, 'Edit task error');
        }
    }

    async delete(req, res) {
        console.log('[TASK] Deleting task:', req.params.id);

        try {
            await TaskService.deleteTask(req.params.id);
            console.log('[TASK] Task deleted successfully');
            return this.successRedirect(req, res, '/tasks', 'Task deleted');
        } catch (error) {
            console.error('[TASK] Delete error:', error);

            if (error.code === 'TASK_NOT_FOUND') {
                return res.status(404).json({ success: false, message: 'Task not found' });
            }

            return this.handleError(res, error, 'Delete task error');
        }
    }
}

export default new TaskController();
