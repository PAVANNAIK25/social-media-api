import express from 'express'
import CommentsController from './comments.controllers.js';
import { commentValidation } from '../../middlewares/validation/comments.validate.js';
import { validate } from '../../middlewares/validate.js';

// comments router
const commentRouter = express.Router();

const commentController = new CommentsController();

//comment Routes

commentRouter.post("/:postId", commentValidation(), validate, (req, res, next) => {
    commentController.createComment(req, res, next)
}).get("/:postId", (req, res, next) => {
    commentController.getAllComments(req, res, next)
});


commentRouter.patch("/:commentId", commentValidation(), validate, (req, res, next) => {
    commentController.updateComment(req, res, next)
}).delete("/:commentId", (req, res, next) => {
    commentController.deleteComment(req, res, next)
});



export default commentRouter;