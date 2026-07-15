import taskRepository from '../repositories/task.repository.js';
import userRepository from '../repositories/user.repository.js';

class TaskService {

    async getAllTasks() {
        return await taskRepository.findAllSorted();
    }

    async createTask(data) {
        const { eventId, title, description, reward, status } = data;

        console.log('[TaskService] Creating task with eventId:', eventId);

        if (!eventId) {
            const error = new Error('EVENT_ID_REQUIRED');
            error.code = 'EVENT_ID_REQUIRED';
            throw error;
        }

        return await taskRepository.create({
            eventId,
            title,
            description,
            reward,
            status: status || 'pending'
        });
    }

    async getTaskById(id) {
        console.log('[TaskService] Looking for task with ID:', id);
        const task = await taskRepository.findByIdWithAssignees(id);
        console.log('[TaskService] Task found:', task ? task._id : 'null');

        if (!task) {
            const error = new Error('TASK_NOT_FOUND');
            error.code = 'TASK_NOT_FOUND';
            throw error;
        }

        return task;
    }

    async addUserToTask(taskId, userId) {
        const task = await taskRepository.findById(taskId);

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

        return await taskRepository.addAssignment(taskId, userId);
    }

    async getTasksByEventId(eventId) {
        return await taskRepository.findByEventId(eventId);
    }

    async getAssignmentById(assignmentId) {
        const task = await taskRepository.findByAssignmentId(assignmentId);

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

        const updatedTask = await taskRepository.updateAssignmentWithPopulate(
            taskId,
            assignmentId,
            updateData
        );

        if (status === 'completed' && !assignment.rewardGiven) {
            const user = await userRepository.findById(userId);

            if (user) {
                user.money += updatedTask.reward;
                await user.save();
                console.log(`[TaskService] Reward ${updatedTask.reward} given to user ${userId}. New balance: ${user.money}`);
            } else {
                console.log(`[TaskService] User not found for reward: ${userId}`);
            }

            await taskRepository.setRewardGiven(taskId, assignmentId);
        }

        return updatedTask;
    }

    async deleteTask(id) {
        const existing = await taskRepository.findById(id);

        if (!existing) {
            const error = new Error('TASK_NOT_FOUND');
            error.code = 'TASK_NOT_FOUND';
            throw error;
        }

        return await taskRepository.delete(id);
    }
}

export default new TaskService();
