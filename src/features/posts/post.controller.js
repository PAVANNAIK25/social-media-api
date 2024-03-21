import ApiResponse from "../../utils/apiResponse.js";
import ApplicationError from "../../utils/error handle/applicationError.js";
import { getLocalePath, getStaticUrl } from "../../utils/helpers.js";
import PostRepository from "./post.repository.js";

export default class PostController {
    constructor() {
        this.postRepository = new PostRepository();
    }

    async createPost(req, res, next) {
        const { caption, tags } = req.body;
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

            const post = await this.postRepository.createPost(caption, imagesArray, userId, tags);
            res.status(201).send(ApiResponse(201, post, "Post successfully created!"));
        } catch (err) {
            next(err);
        }
    }

    async updatePost(req, res, next) {
        const postId = req.params.postId;
        const { caption } = req.body;
        const userId = req.userId;
        let imageUrl;
        if (req.file) {
            imageUrl = req.file.path;
        }
        try {
            const updatedPost = await this.postRepository.updatePost(postId, userId, caption, imageUrl);
            if (!updatedPost.success) {
                return res.status(400).send(updatedPost.message);
            }
            res.status(200).send(updatedPost);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    async deletePost(req, res, next) {
        const postId = req.params.postId;
        const userId = req.userId;

        try {
            const deletedCount = await this.postRepository.deletePost(postId, userId);
            if (deletedCount) {
                return res.status(200).send("The post deleted successfully!");
            } else {
                res.status(400).send("Post not found");
            }
        } catch (err) {
            console.log(err);
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
            if (result) {
                return res.status(200).json({
                    page: page,
                    totalPages: parseInt(result.totalPosts / 10),
                    posts: result.posts
                });
            } else {
                res.status(400).send("Post not found");
            }
        } catch (err) {
            console.log(err);
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


    async getPostByUser(req, res, next) {
        const userId = req.userId;
        if (!page) {
            page = 1;
        }
        try {
            const posts = await this.postRepository.getPostByUser(userId);
            if (posts) {
                return res.status(200).send(posts);
            } else {
                res.status(400).send("Post not found");
            }
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

}