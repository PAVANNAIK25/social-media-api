import { validationResult } from "express-validator"

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = []
    errors.array().map((err) => {
        extractedErrors.push({ [err.path]: err.msg })
    });
    return res.status(400).json({ errors: extractedErrors });
}