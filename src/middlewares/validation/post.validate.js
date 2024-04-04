import { body } from "express-validator"

export const createPostValidation = () =>{
    return [
        body('content').trim().notEmpty().withMessage("Post content is required"),
        body('tags').optional().isArray().withMessage("Tags field must be an array")
    ]
}

export const updatePostValidation = () =>{
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