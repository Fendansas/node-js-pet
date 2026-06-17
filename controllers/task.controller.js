import { BaseController } from './base.controller.js';
import TaskService from '../services/task.service.js';
import EventService from '../services/event.service.js';
import { getAllUsersService } from '../services/user.service.js';
import { Task } from "../models/Task.js";

class TaskController extends BaseController {

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
                return res.status(400).send('Event ID is required');
            }

            return this.renderView(res, 'tasks/create', { errors: [error.message] });
        }
    }

    async showPage(req, res) {
        console.log('[TASK] Showing task:', req.params.id);

        try {
            const task = await TaskService.getTaskById(req.params.id);

            if (!task) {
                console.log('[TASK] Task not found:', req.params.id);
                return res.status(404).send('Task not found');
            }

            let event = null;
            if (task.eventId) {
                try {
                    event = await EventService.getEventById(task.eventId);
                } catch (eventError) {
                    console.log('[TASK] Event not found for task:', task.eventId);
                }
            }

            const users = await getAllUsersService();

            return this.renderView(res, 'tasks/show', { task, event, users });
        } catch (error) {
            console.error('[TASK] Show page error:', error);
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
                return res.status(404).send('Task not found');
            }

            if (error.code === 'USER_ALREADY_ASSIGNED') {
                return res.status(400).send('User already assigned to this task');
            }

            return this.handleError(res, error, 'Add user error');
        }
    }

    async updateStatus(req, res) {
        console.log('[TASK] Updating status for task:', req.params.id);

        try {
            const taskId = req.params.id;
            const { userId, status, assignmentId } = req.body;

            console.log('[TASK] Task ID:', taskId);
            console.log('[TASK] Assignment ID:', assignmentId);
            console.log('[TASK] User ID:', userId);
            console.log('[TASK] Status:', status);

            const validStatuses = ['pending', 'in_progress', 'completed', 'failed'];

            if (!validStatuses.includes(status)) {
                return res.status(400).json({ error: 'Invalid status' });
            }

            const { task, assignment } = await TaskService.getAssignmentById(assignmentId);

            if (!task) {
                console.log('[TASK] Task not found:', taskId);
                return res.status(404).json({ error: 'Task not found' });
            }

            if (assignment.user._id.toString() !== userId) {
                return res.status(400).json({ error: 'User is not assigned to this task' });
            }

            const updateData = {
                'assignedTo.$.status': status
            };

            if (status === 'completed' && !assignment.completedAt) {
                updateData['assignedTo.$.completedAt'] = new Date();
            }

            const updatedTask = await Task.findOneAndUpdate(
                {
                    _id: taskId,
                    'assignedTo._id': assignmentId
                },
                {
                    $set: updateData
                },
                { new: true }
            ).populate('assignedTo.user', 'username email');

            if (status === 'completed' && !assignment.rewardGiven) {
                await Task.findOneAndUpdate(
                    {
                        _id: taskId,
                        'assignedTo._id': assignmentId
                    },
                    {
                        $set: { 'assignedTo.$.rewardGiven': true }
                    }
                );

                console.log(`[TASK] Reward ${updatedTask.reward} given to user ${userId}`);
            }

            console.log('[TASK] Status updated successfully');
            return res.redirect(`/tasks/${taskId}/show`);
        } catch (error) {
            console.error('[TASK] Update status error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    async editPage(req, res) {
        console.log('[TASK] Editing task:', req.params.id);

        try {
            const task = await TaskService.getTaskById(req.params.id);

            if (!task) {
                console.log('[TASK] Task not found:', req.params.id);
                return res.status(404).send('Task not found');
            }

            return this.renderView(res, 'tasks/edit', { task });
        } catch (error) {
            console.error('[TASK] Edit page error:', error);
            return this.handleError(res, error, 'Edit task error');
        }
    }
}

export default new TaskController();