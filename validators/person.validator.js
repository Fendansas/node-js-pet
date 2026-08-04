import { body } from 'express-validator';

export const personValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Укажите имя человека')
        .isLength({ max: 100 })
        .withMessage('Имя не должно превышать 100 символов')
];
