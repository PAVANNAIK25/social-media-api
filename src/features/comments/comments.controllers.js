import ApiResponse from "../../utils/apiResponse.js";
import CommentsRepository from "./comments.repository.js";

export default class CommentsController{

    constructor(){
        this.commentsRepository = new CommentsRepository(); // instance of repository
    }

    // this is controller to add comment
    async createComment(req, res, next){
        const content = req.body.content;
        const userId = req.userId;
        const postId = req.params.postId;
        try{
            const result = await this.commentsRepository.createComment(userId, postId, content);
            res.status(201).send(new ApiResponse(201, result, "Comment added successfully"));

        }catch(err){
            next(err);
        }
    }

    // retrives all comment of a post
    async getAllComments(req, res, next){
        let page = req.query?.page;
        const postId = req.params.postId;
        if(!page){
            page =1;
        }
        try{
            const result = await this.commentsRepository.getAllComments(postId, page);
            res.status(200).send(new ApiResponse(200, {
                page: `${page} / ${parseInt((result.totalComments / 5) + 1)}`,
                totalComments: result.totalComments,
                comments: result.comments
            }, "Post comments fetched successfully"));
        }catch(err){
            next(err);
        }
    }

    async updateComment(req, res, next){
        const content = req.body.content;
        const userId = req.userId;
        const commentId = req.params.commentId;
        try{
            const result = await this.commentsRepository.updateComment(userId, commentId, content);
            res.status(200).send(new ApiResponse(200, result, "Comment updated Successfully"));
        }catch(err){
            next(err);
        }
    }

    async deleteComment(req, res, next){
        const userId = req.userId;
        const commentId = req.params.commentId;
        try{
            const result = await this.commentsRepository.deleteComment(userId, commentId);
            res.status(200).send(new ApiResponse(200, result, "Comment deleted successfully"));
        }catch(err){
            next(err);
        }
    }
}