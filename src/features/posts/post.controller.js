import PostRepository from "./post.repository.js";

export default class PostController {
    constructor() {
        this.postRepository = new PostRepository();
    }

    async createPost(req, res, next) {
        const { caption } = req.body;
        const userId = req.userId;
        const imageUrl = req.file.path;
        try {
            const post = await this.postRepository.createPost(caption, imageUrl, userId);
            res.status(201).send(post);

        } catch (err) {
            console.log(err);
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
        try {
            const posts = await this.postRepository.getAllPost();
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


    async getPost(req, res, next) {
        const postId = req.params.postId;
        try {
            const post = await this.postRepository.getPost(postId);
            if (post) {
                return res.status(200).send(post);
            } else {
                res.status(400).send("Post not found");
            }
        } catch (err) {
            console.log(err);
            next(err);
        }

    }


    async getPostByUser(req, res, next) {
        const userId = req.userId;
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