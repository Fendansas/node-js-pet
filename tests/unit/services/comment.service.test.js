import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../repositories/comment.repository.js', () => ({
    default: {
        findById: vi.fn(),
        findByPostId: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
    }
}));

import commentRepository from '../../../repositories/comment.repository.js';
import CommentService from '../../../services/comment.service.js';

describe('CommentService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('create', () => {
        it('should create comment', async () => {
            commentRepository.create.mockResolvedValue({ _id: 'c1', text: 'test' });
            const result = await CommentService.create('post1', 'user1', 'test');
            expect(result._id).toBe('c1');
        });
    });

    describe('delete', () => {
        it('should throw COMMENT_NOT_FOUND', async () => {
            commentRepository.findById.mockResolvedValue(null);
            await expect(CommentService.delete('c1')).rejects.toThrow('COMMENT_NOT_FOUND');
        });

        it('should delete comment', async () => {
            commentRepository.findById.mockResolvedValue({ _id: 'c1' });
            commentRepository.delete.mockResolvedValue({ _id: 'c1' });
            await expect(CommentService.delete('c1')).resolves.toBeDefined();
        });
    });

    describe('isOwner', () => {
        it('should return true if user is owner', async () => {
            commentRepository.findById.mockResolvedValue({
                _id: 'c1', author: { toString: () => 'user1' }
            });
            const result = await CommentService.isOwner('c1', 'user1');
            expect(result).toBe(true);
        });

        it('should return false if user is not owner', async () => {
            commentRepository.findById.mockResolvedValue({
                _id: 'c1', author: { toString: () => 'other' }
            });
            const result = await CommentService.isOwner('c1', 'user1');
            expect(result).toBe(false);
        });

        it('should return falsy if comment not found', async () => {
            commentRepository.findById.mockResolvedValue(null);
            const result = await CommentService.isOwner('c1', 'user1');
            expect(result).toBeFalsy();
        });
    });

    describe('getPost', () => {
        it('should return comments for post', async () => {
            commentRepository.findByPostId.mockResolvedValue([{ _id: 'c1' }]);
            const result = await CommentService.getPost('post1');
            expect(result).toHaveLength(1);
        });
    });
});
