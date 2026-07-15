import {Router} from "express";
import CommentController from "../controllers/comment.controller.js";
import {allow} from "../middleware/permission.middleware.js";
import {createCommentValidator} from "../validators/comment.validator.js";
import {validate} from "../middleware/validation.middleware.js";

const router = Router();

router.post('/:id/comments', allow('comment:create'), createCommentValidator, validate, (req, res) => {
    CommentController.store(req, res);
});

router.post('/:id/comments/:commentId/delete', allow('comment:delete'), (req, res)=>{
    CommentController.delete(req,res)
    });

export default router;