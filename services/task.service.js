import { Task } from '../models/Task.js';
import User from '../models/User.js';

class TaskService {

    async getAllTasks() {
        return await Task.find().sort({ createdAt: -1 }).populate('assignedTo.user', 'username email');
    }

    async createTask(data) {
        const { eventId, title, description, reward, status } = data;

        console.log('[TaskService] Creating task with eventId:', eventId);

        if (!eventId) {
            const error = new Error('EVENT_ID_REQUIRED');
            error.code = 'EVENT_ID_REQUIRED';
            throw error;
        }

        return await Task.create({
            eventId,
            title,
            description,
            reward,
            status: status || 'pending'
        });
    }

    async getTaskById(id) {
        console.log('[TaskService] Looking for task with ID:', id);
        const task = await Task.findById(id).populate('assignedTo.user', 'username email');
        console.log('[TaskService] Task found:', task ? task._id : 'null');

        if (!task) {
            const error = new Error('TASK_NOT_FOUND');
            error.code = 'TASK_NOT_FOUND';
            throw error;
        }

        return task;
    }

    async addUserToTask(taskId, userId) {
        const task = await Task.findById(taskId);

        console.log('[TaskService] Adding user:', userId, 'to task:', taskId);

        if (!task) {
            const error = new Error('TASK_NOT_FOUND');
            error.code = 'TASK_NOT_FOUND';
            throw error;
        }

        const alreadyAssigned = task.assignedTo.some(
            assigned => assigned.user.toString() === userId
        );

        if (alreadyAssigned) {
            const error = new Error('USER_ALREADY_ASSIGNED');
            error.code = 'USER_ALREADY_ASSIGNED';
            throw error;
        }

        return await Task.findByIdAndUpdate(
            taskId,
            {
                $push: {
                    assignedTo: {
                        user: userId,
                        status: 'pending',
                        completedAt: null,
                        rewardGiven: false
                    }
                }
            },
            { new: true }
        );
    }

    async getTasksByEventId(eventId) {
        return await Task.find({ eventId });
    }

    async getAssignmentById(assignmentId) {
        const task = await Task.findOne({
            'assignedTo._id': assignmentId
        }).populate('assignedTo.user', 'username email');

        if (!task) {
            const error = new Error('ASSIGNMENT_NOT_FOUND');
            error.code = 'ASSIGNMENT_NOT_FOUND';
            throw error;
        }

        const assignment = task.assignedTo.find(
            assigned => assigned._id.toString() === assignmentId
        );

        if (!assignment) {
            const error = new Error('ASSIGNMENT_NOT_FOUND');
            error.code = 'ASSIGNMENT_NOT_FOUND';
            throw error;
        }

        return { task, assignment };
    }

    async updateAssignmentStatus(taskId, assignmentId, userId, status) {
        const validStatuses = ['pending', 'in_progress', 'completed', 'failed'];

        if (!validStatuses.includes(status)) {
            const error = new Error('INVALID_STATUS');
            error.code = 'INVALID_STATUS';
            throw error;
        }

        const { task, assignment } = await this.getAssignmentById(assignmentId);

        if (assignment.user._id.toString() !== userId) {
            const error = new Error('USER_NOT_ASSIGNED');
            error.code = 'USER_NOT_ASSIGNED';
            throw error;
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
            const user = await User.findById(userId);

            if (user) {
                user.money += updatedTask.reward;
                await user.save();
                console.log(`[TaskService] Reward ${updatedTask.reward} given to user ${userId}. New balance: ${user.money}`);
            } else {
                console.log(`[TaskService] User not found for reward: ${userId}`);
            }

            await Task.findOneAndUpdate(
                {
                    _id: taskId,
                    'assignedTo._id': assignmentId
                },
                {
                    $set: { 'assignedTo.$.rewardGiven': true }
                }
            );
        }

        return updatedTask;
    }

    async deleteTask(id) {
        const existing = await Task.findById(id);

        if (!existing) {
            const error = new Error('TASK_NOT_FOUND');
            error.code = 'TASK_NOT_FOUND';
            throw error;
        }

        return await Task.findByIdAndDelete(id);
    }
}

export default new TaskService();