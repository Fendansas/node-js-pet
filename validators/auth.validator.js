import {body} from 'express-validator';

export const validateRegister = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 6, max: 100 })
        .withMessage("Password must be at least 6 characters"),
];

export const validateLogin =[
    body('email')
        .trim()
        .isEmail()
        .withMessage("Invalid email")
        .normalizeEmail(),
    body('password')
        .trim()
        .notEmpty()
        .withMessage("Password is required"),
]
