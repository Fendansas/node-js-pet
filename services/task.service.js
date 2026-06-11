import {Task} from "../models/Task.js";



class TaskService {

    async createTask(data) {
        const { eventId, title, description, reward, status } = data;

        console.log('[TaskService] Creating task with eventId:', eventId);

        if (!eventId) {
            throw new Error('Event ID is required');
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

        console.log('111111111111111',userId)
        if (!task) {
            throw new Error('Task not found');
        }

        const alreadyAssigned = task.assignedTo.some(
            assigned => assigned.user.toString() === userId
        );
        if (alreadyAssigned) {
            throw new Error('User already assigned to this task');
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
            { new: true } // Возвращаем обновленный документ
        );
    }

    async getTasksByEventId(eventId) {
        return await Task.find({ eventId });
    }

    async getAssignmentById(assignmentId){
        const task = await Task.findOne({
            'assignedTo._id': assignmentId
        }).populate('assignedTo.user', 'username email');

        if (!task) {
            throw new Error('Assignment not found');
        }

        const assignment = task.assignedTo.find(
            assigned => assigned._id.toString() === assignmentId
        );

        if (!assignment) {
            throw new Error('Assignment not found');
        }
        return {
            task,
            assignment
        };
    }
}

export default new TaskService();