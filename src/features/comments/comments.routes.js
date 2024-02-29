import express from 'express'
import CommentsController from './comments.controllers.js';

const commentRouter = express.Router();
const commentController = new CommentsController();

commentRouter.post("/:postId", (req, res, next) => {
    commentController.createComment(req, res, next)
});

commentRouter.get("/:postId", (req, res, next) => {
    commentController.createComment(req, res, next)
});

commentRouter.put("/:commentId", (req, res, next) => {
    commentController.updateComment(req, res, next)
});

commentRouter.delete("/:commentId", (req, res, next) => {
    commentController.deleteComment(req, res, next)
});



export default commentRouter;