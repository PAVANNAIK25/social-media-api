import { body } from "express-validator"

export const createPostValidate = () =>{
    return [
        body('content').trim().notEmpty().withMessage("Post content is required"),
        body('tags').optional().isArray().withMessage("Tags field must be an array")
    ]
}

export const updatePostValidate = () =>{
    return [
        body("content")
        .optional()
        .notEmpty()
        .withMessage("Post content is required"),
        body('tags')
        .optional()
        .isArray()
        .withMessage("Tags field must be an array")
    ]
}