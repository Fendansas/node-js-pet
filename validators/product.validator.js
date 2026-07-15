import {body} from 'express-validator';

export const createProductValidator = [
    body('title')
        .trim()
        .isLength({min: 3, max: 30})
        .withMessage('Title must be 2-100 chars'),
    body('description')
        .trim()
        .isLength({min: 10, max: 300})
        .withMessage('Description must be 10-300 chars'),
    body('price')
        .isFloat({min: 0})
        .withMessage('Price must be a positive number'),
    body('category')
        .trim()
        .isLength({min:2, max: 30})
        .withMessage('Category must be 2-30 chars'),

    body('image')
        .optional()
        .isString(),
]