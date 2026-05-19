import { body } from "express-validator";

export const anomalyCreateValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long'),

    body('latitude')
        .notEmpty()
        .withMessage('Latitude is required')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be a valid number between -90 and 90'),

    body('longitude')
        .notEmpty()
        .withMessage('Longitude is required')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be a valid number between -180 and 180'),

    body('radius')
        .notEmpty()
        .withMessage('Radius is required')
        .isInt({ min: 0 })
        .withMessage('Radius must be a positive integer'),

    body('type')
        .trim()
        .notEmpty()
        .withMessage('Type is required'),

    body('value')
        .notEmpty()
        .withMessage('Value is required')
        .isInt({ min: 0 })
        .withMessage('Value must be a positive integer'),
];