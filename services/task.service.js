import { Task } from "../models/Task.js";

class TaskService {

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
}

export default new TaskService();