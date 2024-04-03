import express from 'express'
import CommentsController from './comments.controllers.js';

// comments router
const commentRouter = express.Router();

const commentController = new CommentsController();

//comment Routes

commentRouter.post("/:postId", (req, res, next) => {
    commentController.createComment(req, res, next)
}).get("/:postId", (req, res, next) => {
    commentController.getAllComments(req, res, next)
});


commentRouter.put("/:commentId", (req, res, next) => {
    commentController.updateComment(req, res, next)
}).delete("/:commentId", (req, res, next) => {
    commentController.deleteComment(req, res, next)
});



export default commentRouter;