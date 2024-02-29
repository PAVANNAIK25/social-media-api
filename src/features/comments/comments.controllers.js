import CommentsRepository from "./comments.repository.js";

export default class CommentsController{

    constructor(){
        this.commentsRepository = new CommentsRepository();
    }

    async createComment(req, res, next){
        const text = req.body.text;
        const userId = req.userId;
        const postId = req.params.postId;
        try{
            const result = await this.commentsRepository.createComment(userId, postId, text);
            res.status(201).send(result);

        }catch(err){
            console.log(err);
            next(err);
        }
    }

    async getAllComments(req, res, next){
        const postId = req.params.postId;
        try{
            const result = await this.commentsRepository.getAllComments(postId);
            if(!result.success){
                return res.status(400).send(result.message);
            }
            res.status(200).send(result.comments);
        }catch(err){
            console.log(err);
            next(err);
        }
    }

    async updateComment(req, res, next){
        const text = req.body.text;
        const userId = req.userId;
        const commentId = req.params.commentId;
        try{
            const result = await this.commentsRepository.updateComment(userId, commentId, text);
            if(!result.success){
                return res.status(400).send(result.message);
            }
            res.status(200).send(result.comment);
        }catch(err){
            console.log(err);
            next(err);
        }
    }

    async deleteComment(req, res, next){
        const userId = req.userId;
        const commentId = req.params.commentId;
        try{
            const result = await this.commentsRepository.deleteComment(userId, commentId);
            if(!result){
                return res.status(400).send("Comment deletion unsuccessful");
            }
            res.status(200).send("Comment deleted successfully");
        }catch(err){
            console.log(err);
            next(err);
        }
    }
}