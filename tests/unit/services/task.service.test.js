import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../repositories/task.repository.js', () => ({
    default: {
        findById: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
        findAllSorted: vi.fn(),
        findByIdWithAssignees: vi.fn(),
        findByEventId: vi.fn(),
        findByAssignmentId: vi.fn(),
        addAssignment: vi.fn(),
        updateAssignmentWithPopulate: vi.fn(),
        setRewardGiven: vi.fn(),
    }
}));

vi.mock('../../../repositories/user.repository.js', () => ({
    default: {
        findById: vi.fn(),
    }
}));

import taskRepository from '../../../repositories/task.repository.js';
import userRepository from '../../../repositories/user.repository.js';
import TaskService from '../../../services/task.service.js';

describe('TaskService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createTask', () => {
        it('should throw EVENT_ID_REQUIRED if no eventId', async () => {
            await expect(TaskService.createTask({ title: 'test' })).rejects.toThrow('EVENT_ID_REQUIRED');
        });

        it('should create task with eventId', async () => {
            taskRepository.create.mockResolvedValue({ _id: 't1', eventId: 'e1' });
            const result = await TaskService.createTask({ eventId: 'e1', title: 'test' });
            expect(result._id).toBe('t1');
        });
    });

    describe('getTaskById', () => {
        it('should throw TASK_NOT_FOUND', async () => {
            taskRepository.findByIdWithAssignees.mockResolvedValue(null);
            await expect(TaskService.getTaskById('missing')).rejects.toThrow('TASK_NOT_FOUND');
        });

        it('should return task', async () => {
            taskRepository.findByIdWithAssignees.mockResolvedValue({ _id: 't1' });
            const result = await TaskService.getTaskById('t1');
            expect(result._id).toBe('t1');
        });
    });

    describe('addUserToTask', () => {
        it('should throw TASK_NOT_FOUND', async () => {
            taskRepository.findById.mockResolvedValue(null);
            await expect(TaskService.addUserToTask('t1', 'u1')).rejects.toThrow('TASK_NOT_FOUND');
        });

        it('should throw USER_ALREADY_ASSIGNED', async () => {
            taskRepository.findById.mockResolvedValue({
                _id: 't1',
                assignedTo: [{ user: { toString: () => 'u1' } }]
            });
            await expect(TaskService.addUserToTask('t1', 'u1')).rejects.toThrow('USER_ALREADY_ASSIGNED');
        });

        it('should add user to task', async () => {
            taskRepository.findById.mockResolvedValue({
                _id: 't1', assignedTo: []
            });
            taskRepository.addAssignment.mockResolvedValue({ _id: 't1' });
            const result = await TaskService.addUserToTask('t1', 'u1');
            expect(result._id).toBe('t1');
        });
    });

    describe('deleteTask', () => {
        it('should throw TASK_NOT_FOUND', async () => {
            taskRepository.findById.mockResolvedValue(null);
            await expect(TaskService.deleteTask('t1')).rejects.toThrow('TASK_NOT_FOUND');
        });

        it('should delete task', async () => {
            taskRepository.findById.mockResolvedValue({ _id: 't1' });
            taskRepository.delete.mockResolvedValue({ _id: 't1' });
            await expect(TaskService.deleteTask('t1')).resolves.toBeDefined();
        });
    });

    describe('updateAssignmentStatus', () => {
        it('should throw INVALID_STATUS for bad status', async () => {
            await expect(
                TaskService.updateAssignmentStatus('t1', 'a1', 'u1', 'bad')
            ).rejects.toThrow('INVALID_STATUS');
        });

        it('should throw USER_NOT_ASSIGNED if userId does not match', async () => {
            taskRepository.findByAssignmentId.mockResolvedValue({
                _id: 't1',
                assignedTo: [{
                    _id: 'a1',
                    user: { _id: { toString: () => 'other_user' } },
                    status: 'pending'
                }]
            });
            await expect(
                TaskService.updateAssignmentStatus('t1', 'a1', 'u1', 'completed')
            ).rejects.toThrow('USER_NOT_ASSIGNED');
        });

        it('should update status and give reward on completion', async () => {
            const mockUser = { _id: 'u1', money: 100, save: vi.fn() };
            taskRepository.findByAssignmentId.mockResolvedValue({
                _id: 't1',
                reward: 50,
                assignedTo: [{
                    _id: 'a1',
                    user: { _id: { toString: () => 'u1' } },
                    status: 'in_progress',
                    completedAt: null,
                    rewardGiven: false
                }]
            });
            taskRepository.updateAssignmentWithPopulate.mockResolvedValue({ reward: 50 });
            userRepository.findById.mockResolvedValue(mockUser);
            taskRepository.setRewardGiven.mockResolvedValue();

            await TaskService.updateAssignmentStatus('t1', 'a1', 'u1', 'completed');

            expect(mockUser.money).toBe(150);
            expect(mockUser.save).toHaveBeenCalled();
            expect(taskRepository.setRewardGiven).toHaveBeenCalledWith('t1', 'a1');
        });

        it('should not give reward if already given', async () => {
            taskRepository.findByAssignmentId.mockResolvedValue({
                _id: 't1',
                reward: 50,
                assignedTo: [{
                    _id: 'a1',
                    user: { _id: { toString: () => 'u1' } },
                    status: 'in_progress',
                    completedAt: null,
                    rewardGiven: true
                }]
            });
            taskRepository.updateAssignmentWithPopulate.mockResolvedValue({ reward: 50 });

            await TaskService.updateAssignmentStatus('t1', 'a1', 'u1', 'completed');

            expect(userRepository.findById).not.toHaveBeenCalled();
        });
    });
});
