import {BaseController} from "./base.controller.js";
import CommentService from "../services/comment.service.js";


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
                return res.status(403).send('нет прав доступа');
            }

            await CommentService.delete(commentId);

            return this.successRedirect(req, res, 'back', 'Коментарий удален')

        } catch (error){
            console.error('[COMMENT] Delete error:', error);
            return this.handleError(res, error, 'Ошибка удаления комментария');
        }
    }
}

export default new CommentController()