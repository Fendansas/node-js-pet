import BaseRepository from './base.repository.js';
import { Task } from '../models/Task.js';

class TaskRepository extends BaseRepository {
    constructor() {
        super(Task);
    }

    async findAllSorted() {
        return await this.findAll(
            {},
            {
                sort: { createdAt: -1 },
                populate: { path: 'assignedTo.user', select: 'username email' }
            }
        );
    }

    async findByIdWithAssignees(id) {
        return await this.findById(id, { path: 'assignedTo.user', select: 'username email' });
    }

    async findByEventId(eventId) {
        return await this.findAll({ eventId });
    }

    async findByAssignmentId(assignmentId) {
        return await this.findOne(
            { 'assignedTo._id': assignmentId },
            { path: 'assignedTo.user', select: 'username email' }
        );
    }

    async addAssignment(taskId, userId) {
        return await this.model.findByIdAndUpdate(
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

    async updateAssignment(taskId, assignmentId, updateData) {
        return await this.model.findOneAndUpdate(
            { _id: taskId, 'assignedTo._id': assignmentId },
            { $set: updateData },
            { new: true }
        );
    }

    async updateAssignmentWithPopulate(taskId, assignmentId, updateData) {
        return await this.model.findOneAndUpdate(
            { _id: taskId, 'assignedTo._id': assignmentId },
            { $set: updateData },
            { new: true }
        ).populate('assignedTo.user', 'username email');
    }

    async setRewardGiven(taskId, assignmentId) {
        return await this.model.findOneAndUpdate(
            { _id: taskId, 'assignedTo._id': assignmentId },
            { $set: { 'assignedTo.$.rewardGiven': true } }
        );
    }

    async findByAssignedUser(userId) {
        return await this.findAll({ 'assignedTo.user': userId });
    }
}

export default new TaskRepository();
