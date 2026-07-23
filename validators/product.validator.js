import { body } from 'express-validator';

export const createProductValidator = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be 2-50 chars'),
    body('description')
        .trim()
        .isLength({ min: 5, max: 500 })
        .withMessage('Description must be 5-500 chars'),
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('category')
        .isInt({ min: 0, max: 11 })
        .withMessage('Category must be a number from 0 to 11'),
    body('imageUrl')
        .optional()
        .isString(),
];
