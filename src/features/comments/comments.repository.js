import mongoose from "mongoose";
import { commentSchema } from "./comments.schema.js";
import ApplicationError from '../../error handle/applicationError.js'
import { PostModel } from "../posts/post.repository.js";

export const CommentModel = mongoose.model('Comment', commentSchema);

export default class CommentsRepository {

    async createComment(userId, postId, text) {
        try {
            const newComment = new CommentModel({ text:text, post: postId, user: userId });
            await newComment.save();
            const post = await PostModel.findById(postId);
            post.comments.push(newComment._id);
            await post.save();
            return newComment;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Somthing went wrong with database", 500)
        }
    }

    async getAllComments(postId) {
        try {
            const comments = await CommentModel.find({ post: new mongoose.Types.ObjectId(postId) });
            if (!comments) {
                return {
                    success: false,
                    message: "No comments found"
                };
            }
            return {
                success: true,
                comments: comments
            };
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Somthing went wrong with database", 500)
        }
    }

    async updateComment(userId, commentId, text) {
        try {
            const comment = await CommentModel.findOne({ _id: new mongoose.Types.ObjectId(commentId), user: new mongoose.Types.ObjectId(userId) });
            if (!comment) {
                return {
                    success: false,
                    message: "Comment not found"
                };
            }
            comment.text = text;
            await comment.save();
            return {
                success: true,
                comment: comment
            };

        } catch (err) {
            console.log(err);
            throw new ApplicationError("Somthing went wrong with database", 500)
        }
    }

    async deleteComment(userId, commentId) {
        try {
            const result = await CommentModel.deleteOne({ _id: new mongoose.Types.ObjectId(commentId), user: userId });
            await PostModel.updateOne({comments: commentId}, {$pull: {comments: commentId}});
            return result.deletedCount>0;

        } catch (err) {
            console.log(err);
            throw new ApplicationError("Somthing went wrong with database", 500)
        }
    }

}