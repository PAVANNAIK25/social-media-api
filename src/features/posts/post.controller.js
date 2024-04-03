import ApiResponse from "../../utils/apiResponse.js";
import ApplicationError from "../../utils/error handle/applicationError.js";
import { getLocalePath, getStaticUrl } from "../../utils/helpers.js";
import PostRepository from "./post.repository.js";

export default class PostController {
    constructor() {
        this.postRepository = new PostRepository();
    }

    async createPost(req, res, next) {
        const { content, tags } = req.body;
        const userId = req.userId;
        let imagesArray = [];
        try {
            req?.files.forEach(file => {
                const url = getStaticUrl(req, file.filename);
                const localPath = getLocalePath(file.filename);
                imagesArray.push({
                    url,
                    localPath
                });
            });

            const post = await this.postRepository.createPost(content, imagesArray, userId, tags);
            res.status(201).send(new ApiResponse(201, post, "Post successfully created!"));
        } catch (err) {
            next(err);
        }
    }

    async updatePost(req, res, next) {
        const postId = req.params.postId;
        const { content, tags } = req.body;
        const userId = req.userId;
        let imagesArray = [];
        try {
            req?.files.forEach(file => {
                const url = getStaticUrl(req, file.filename);
                const localPath = getLocalePath(file.filename);
                imagesArray.push({
                    url,
                    localPath
                });
            });

            const post = await this.postRepository.updatePost(postId, content, imagesArray, userId, tags);
            res.status(200).send(new ApiResponse(200, post, "Post updated successfully!"));
        } catch (err) {
            next(err);
        }
    }

    // This controller is used to delete the post
    async deletePost(req, res, next) {
        const postId = req.params.postId;
        const userId = req.userId;
        try {
            const result = await this.postRepository.deletePost(postId, userId);
            if (result) {
                return res.status(200).send(new ApiResponse(200, {}, "The post deleted successfully!"));
            }
        } catch (err) {
            next(err);
        }

    }

    async getAllPost(req, res, next) {
        let page = req.query.page;
        if (!page) {
            page = 1;
        }
        try {
            const result = await this.postRepository.getAllPost(page);
            if (result.posts) {
                return res.status(200).json(

                    new ApiResponse(200, {
                        page: `${page}/${parseInt((result.totalPosts / 10) + 1)}`,
                        totalPosts: result.totalPosts,
                        posts: result.posts
                    }, "Posts retrived successfully"
                    ))

            }
        } catch (err) {
            next(err);
        }

    }


    async getPost(req, res, next) {
        const postId = req.params.postId;
        try {
            const post = await this.postRepository.getPost(postId);
            if (!post) {
                throw new ApplicationError("Post not found!", 400);
            }
            res.status(200).send(ApiResponse(200, post, "Post retrived successfully"));

        } catch (err) {
            next(err);
        }

    }

    // get the post created by users
    async getPostByUser(req, res, next) {
        const userId = req.userId;
        const page = req.query.page;
        if (!page) {
            page = 1;
        }
        try {
            const result = await this.postRepository.getPostByUser(userId, page);
            if (result.posts) {
                return res.status(200).send(new ApiResponse(200, {
                    page: `${page}/${parseInt((result.totalPosts / 10) + 1)}`,
                    totalPosts: result.totalPosts,
                    posts: result.posts
                }, "Posts retrived successfully"));
            }
        } catch (err) {
            next(err);
        }
    }

}