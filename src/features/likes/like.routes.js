import express from 'express'
import LikesController from './like.controller.js';

const likesRouter = express.Router();
const likeController = new LikesController();

likesRouter.get('/toggle/:typeId', (req, res, next)=>{
    likeController.toggleLike(req, res, next)
});

likesRouter.get('/:typeId/:customId', (req, res, next)=>{
    likeController.getLikes(req, res, next)
});


export default likesRouter;