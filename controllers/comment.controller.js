import { BaseController } from './base.controller.js';
import CommentService from '../services/comment.service.js';


class CommentController extends BaseController {
    async store(req, res){
        try {
            const {text} = req.body;
            const postId = req.params.id;
            const authorId = req.user._id;

            await CommentService.create(postId, authorId, text);
            return this.successRedirect(req, res, `/posts/${postId}`, 'Комментарий добавлен');
        } catch (error){
            console.error('[COMMENT] Create error:', error);
            return this.handleError(res, error, 'Ошибка создания комментария');
        }
    }

    async delete(req, res){
        try {
            const {commentId} = req.params;
            const userId = req.user._id

            const isOwner = await CommentService.isOwner(commentId,userId)
            const isAdmin = req.user.role?.name === 'admin';

            if(!isOwner && !isAdmin){
                return res.status(403).json({ success: false, message: 'Нет прав доступа' });
            }

            await CommentService.delete(commentId);

            return this.successRedirect(req, res, 'back', 'Коментарий удален')

        } catch (error){
            console.error('[COMMENT] Delete error:', error);
            return this.handleError(res, error, 'Ошибка удаления комментария');
        }
    }

    async rate(req, res){
        try {
            const {commentId} = req.params;
            const rating = Number(req.body.rating);
            const userId = req.user._id;

            await CommentService.rate(commentId, userId, rating);
            return this.successRedirect(req, res, 'back');
        } catch (error){
            console.error('[COMMENT] Rate error:', error);
            if(error.code === 'CANNOT_RATE_OWN_COMMENT'){
                return  this.successRedirect(req, res, 'back', 'Нельзя оценивать свой коментрий')

            }
            return  this.handleError(res, error, 'Ошибка оценки коментария')
        }
    }
}

export default new CommentController()