import express from 'express'

import { upload } from '../../middlewares/file-upload.middleware.js';
import PostController from './post.controller.js';

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
postRouter.post("/", upload.array('images', 6), (req, res, next)=>{
    postController.createPost(req, res, next)
    
})

//PUT requests
postRouter.put("/:postId", upload.single('imageUrl'), (req, res, next)=>{
    postController.updatePost(req, res, next)
    
})

//delete Requests
postRouter.delete("/:postId", (req, res, next)=>{
    postController.deletePost(req, res, next)
    
})


export default postRouter;