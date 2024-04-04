import express from 'express'
import { upload } from '../../middlewares/file-upload.middleware.js';
import PostController from './post.controller.js';
import {  createPostValidation, updatePostValidation } from '../../middlewares/validation/post.validate.js';
import { validate } from '../../middlewares/validate.js';

const postRouter = express.Router();
const postController = new PostController();

//get requests
postRouter.get("/all", (req, res, next)=>{
    postController.getAllPost(req, res, next)
    
})

postRouter.get("/", (req, res, next)=>{
    postController.getPostByUser(req, res, next)
    
})

postRouter.get("/:postId", (req, res, next)=>{
    postController.getPost(req, res, next)
    
})

//POST requests
postRouter.post("/", upload.array('images', 6), createPostValidation(), validate, (req, res, next)=>{
    postController.createPost(req, res, next)
    
})

//PATCH requests
postRouter.patch("/:postId", upload.array('images',6), updatePostValidation(), validate, (req, res, next)=>{
    postController.updatePost(req, res, next)
    
})

//delete Requests
postRouter.delete("/:postId", (req, res, next)=>{
    postController.deletePost(req, res, next)
    
})


export default postRouter;