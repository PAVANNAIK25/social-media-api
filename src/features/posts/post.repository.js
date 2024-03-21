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
                likes: {
                    $cond: [{ $gt: [{ $size: "$likes" }, 0] }, "$likes", null]
                },
                createdAt: { $toDate: '$_id' },
                updatedAt: { $toDate: '$_id' }
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

    async updatePost(postId, userId, caption, imageUrl) {
        try {
            const post = await PostModel.findOne({ _id: new mongoose.Types.ObjectId(postId), user: new mongoose.Types.ObjectId(userId) });
            if (!post) {
                return {
                    success: false,
                    message: "Post not found"
                }
            }

            if (caption) {
                post.caption = caption;
            }

            if (imageUrl) {
                post.imageUrl = imageUrl;
            }
            return await post.save();

        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with Datatbase", 500);
        }
    }

    async deletePost(postId, userId) {
        try {
            const deleted = await PostModel.deleteOne({ _id: new mongoose.Types.ObjectId(postId), user: new mongoose.Types.ObjectId(userId) });
            return deleted.deletedCount > 0;

        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with Datatbase", 500);
        }
    }

    async getAllPost(page) {
        let perPage = 10;

        const posts = await PostModel.find().skip(
            ((page - 1) * perPage)).limit(perPage);
        const totalPosts = await PostModel.countDocuments();
        return {
            posts,
            totalPosts
        };

    }

    async getPost(postId) {

        const post = await PostModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(postId) }
            },
            ...commonPostAggregater()

        ])
        return post[0];

    }

    async getPostByUser(userId) {

        const posts = await PostModel.aggregate([
            { $match: { author: userId } },
            ...commonPostAggregater(),
        ]);
        return posts;

    }

}