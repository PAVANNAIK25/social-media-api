import mongoose from "mongoose";
import ApplicationError from "../../utils/error handle/applicationError.js";
import { PostModel } from "../posts/post.schema.js";
import { CommentModel } from "./comments.schema.js";

//common aggregation pipeline
const commonCommentAggregation = () => {
    return [
        {
            $lookup: {
                from: 'profiles',
                localField: 'user',
                foreignField: 'owner',
                as: "author",
                pipeline: [{
                    $lookup: {
                        from: 'users',
                        localField: 'owner',
                        foreignField: '_id',
                        as: "account",
                        pipeline: [{
                            $project: {
                                name: 1,
                                email: 1,
                                gender: 1,
                                role: 1
                            },
                        }]
                    }
                },
                {
                    $addFields: {
                        account: { $first: "$account" }
                    }

                }
                ]

            }

        },

        {
            $addFields: {
                likes_counts: { $size: "$likes" },
                author: { $first: "$author" },
            }
        },
        {
            $project: {
                author: 1,
                content: 1,
                likes: { $size: "$likes" },
                createdAt: 1,
                updatedAt: 1
            }
        }
    ]

}

export default class CommentsRepository {

    // this method will create a comment on a post
    async createComment(userId, postId, content) {
        const newComment = new CommentModel({ content, post: postId, user: userId });
        await newComment.save();
        const post = await PostModel.findById(postId);
        post.comments.push(newComment._id);
        await post.save();
        const comment = await CommentModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(newComment._id)
                }
            },
            {
                $project: {
                    content: 1,
                    postId: 1,
                    user: 1,
                    likes: {
                        $size: "$likes"

                    },
                    createdAt: 1,
                    updatedAt: 1
                }
            }

        ])
        return comment[0];

    }

    // this method will retrive all comments on a post

    async getAllComments(postId, page) {
        let perPage = 5;

        const comments = await CommentModel.aggregate([
            {
                $match: { post: new mongoose.Types.ObjectId(postId) }
            },
            {
                $skip: (page - 1) * 5
            },
            {
                $limit: perPage
            },
            ...commonCommentAggregation()

        ]);
        if (!comments) {
            throw new ApplicationError("Comment not found", 404);
        }

        const totalComments = await CommentModel.countDocuments({ post: new mongoose.Types.ObjectId(postId) });

        return { comments, totalComments };
    }

    // This method will update the existing comment

    async updateComment(userId, commentId, content) {
        const comment = await CommentModel.findOneAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(commentId),
                user: new mongoose.Types.ObjectId(userId)
            }, {
            $set: { content }
        },
            { new: true }
        );

        if (!comment) {
            throw new ApplicationError("Comment not found", 404);
        }

        const updatedComment = await CommentModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(comment._id)
                }
            },
            {
                $project: {
                    content: 1,
                    postId: 1,
                    user: 1,
                    likes: {
                        $size: "$likes"

                    },
                    createdAt: 1,
                    updatedAt: 1
                }
            },

        ])

        return updatedComment[0];
    }

    // this method will delete the comment based of commentId

    async deleteComment(userId, commentId) {
        const result = await CommentModel.deleteOne({ _id: new mongoose.Types.ObjectId(commentId), user: userId });
        await PostModel.updateOne({ comments: commentId }, { $pull: { comments: commentId } });
        if(result.deletedCount<=0){
            throw new ApplicationError("Comment not found", 404);
        }
        return result;
    }

}