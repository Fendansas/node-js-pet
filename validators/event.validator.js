import {body} from 'express-validator';

export const createEventValidator = [
    body('title')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be 3-100 characters'),
    body('description')
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('Description must be 10-500 characters'),
    body('startTime')
        .optional({ checkFalsy: true })
        .isISO8601()
        .withMessage('Start time must be a valid date'),
    body('endTime')
        .optional({ checkFalsy: true })
        .isISO8601()
        .withMessage('End time must be a valid date'),
    body('status')
        .optional()
        .isIn(['draft', 'active', 'completed'])
        .withMessage('Status must be draft, active, or completed'),
];

export const updateEventValidator = [
    body('title')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be 3-100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('Description must be 10-500 characters'),
    body('startTime')
        .optional({ checkFalsy: true })
        .isISO8601()
        .withMessage('Start time must be a valid date'),
    body('endTime')
        .optional({ checkFalsy: true })
        .isISO8601()
        .withMessage('End time must be a valid date'),
    body('status')
        .optional()
        .isIn(['draft', 'active', 'completed'])
        .withMessage('Status must be draft, active, or completed'),
];