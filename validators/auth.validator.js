import {body} from "express-validator";

export const validateRegister = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be 3-20 chars')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can contain only letters, numbers and _'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 6, max: 100 })
        .withMessage("Password must be at least 6 characters"),

    body('bio')
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage('Bio too long'),

    body('avatar')
        .optional()
        .isURL()
        .withMessage('Avatar must be a valid URL')
];

export const validateLogin =[
    body('username')
        .trim()
        .notEmpty()
        .withMessage("Username is required"),
    body('password')
        .trim()
        .notEmpty()
        .withMessage("Password is required"),
]
