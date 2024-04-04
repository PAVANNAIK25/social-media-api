import { body } from "express-validator"

//this will validate the input comment from user
export const commentValidation = ()=> {
    return [
        body('content').trim().notEmpty().withMessage("Content is required")
    ]
}