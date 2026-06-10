import {Task} from "../models/Task.js";



class TaskService {

    async createTask(data) {

        const {eventId} = data;
        const idIsExist = await Task.findOne({eventId});
        if (!idIsExist) {
            throw new Error('Event ID not found');
        }
        return await Task.create(data);
    }

    async getTaskById(id) {
        return await Task.findById(id).populate('assignedTo.user', 'username email');
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
}

export default new TaskService();