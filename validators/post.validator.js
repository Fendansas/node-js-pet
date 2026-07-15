import { body } from 'express-validator';

export const createPostValidator = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters'),

    body('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required'),

    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required'),

    body('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['draft', 'published'])
        .withMessage('Status must be draft or published')
];

export const updatePostValidator = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters'),

    body('content')
        .optional()
        .trim(),

    body('category')
        .optional()
        .trim(),

    body('status')
        .optional()
        .isIn(['draft', 'published'])
        .withMessage('Status must be draft or published')
];