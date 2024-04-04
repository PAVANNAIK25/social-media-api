import mongoose from "mongoose";
import { PostModel } from "./post.schema.js";
import ApplicationError from "../../utils/error handle/applicationError.js"


const commonPostAggregater = () => {
    return [
        {
            $lookup: {
                from: 'profiles',
                localField: 'author',
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
                comments_counts: { $size: "$comments" },
                likes_counts: { $size: "$likes" },
                author: { $first: "$author" },
            }
        },
        {
            $project: {
                author: 1,
                content: 1,
                tags: 1,
                images: 1,
                comments: {
                    $cond: [{ $gt: [{ $size: "$comments" }, 0] }, "$comments", null]
                },
                likes: { $size:"$likes"},
                createdAt: 1,
                updatedAt: 1
            }
        }


    ];

}

export default class PostRepository {

    async createPost(content, images, userId, tags) {
        const newPost = new PostModel({ content, tags, images, author: userId });
        await newPost.save();
        const post = await PostModel.aggregate([
            {
                $match: { _id: newPost._id }
            },
            ...commonPostAggregater(),
        ]);
        return post[0];
    }

    async updatePost(postId, content, imagesArray, userId, tags) {

        const post = await PostModel.findOne({_id: new mongoose.Types.ObjectId(postId), author: new mongoose.Types.ObjectId(userId)});
        if (!post) {
            throw new ApplicationError("Post not found", 404);
        }
        if (content) {
            post.content = content;
        }
        if (imagesArray) {
            post.imagesArray = imagesArray;
        }
        if (tags) {
            post.tags = tags;
        }
        await post.save();
        const updatedPost = await PostModel.aggregate([
            {
                $match: { _id: post._id }
            },
            ...commonPostAggregater(),
        ]);
        return updatedPost[0];
    }

    // This repository is used to delete the post
    async deletePost(postId, userId) {
        const deleted = await PostModel.deleteOne({ _id: new mongoose.Types.ObjectId(postId), author: new mongoose.Types.ObjectId(userId) });
        if (deleted.deletedCount < 1) {
            throw new ApplicationError("Post not found", 404);
        }
        return deleted.deletedCount > 0;

    }

    async getAllPost(page) {
        let perPage = 10; // it returns 10 posts per page

        const posts = await PostModel.aggregate([
            {
                $skip: (page - 1) * perPage
            },
            {
                $limit: perPage
            },
            ...commonPostAggregater()
        ]);

        if (!posts) {
            throw new ApplicationError("Post not found", 404);
        } else {
            const totalPosts = await PostModel.countDocuments();
            return {
                posts,
                totalPosts
            }
        }

    }

    async getPost(postId) {

        const post = await PostModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(postId) }
            },
            ...commonPostAggregater()
        ])
        if (!post) {
            throw new ApplicationError("Post not found", 404);
        }

        return post[0];

    }

    // get the post created by users
    async getPostByUser(userId, page) {
        let perPage = 10;
        const posts = await PostModel.aggregate([
            { $match: { author: userId } },
            {
                $skip: (page - 1) * perPage
            },
            {
                $limit: perPage
            },
            ...commonPostAggregater(),
        ]);
        if (!posts) {
            throw new ApplicationError("Post not found", 404);
        } else {
            const totalPosts = await PostModel.countDocuments({ author: userId });
            return {
                posts,
                totalPosts
            }
        }

    }

}