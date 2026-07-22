import {body} from 'express-validator';

export const createCommentValidator =[
    body('text')
        .trim()
        .notEmpty()
        .withMessage('Текст коментария обязателен')
        .isLength({min:1, max:500})
        .withMessage('Коментарий от 1 до 500 символов')
];

export const rateCommentValidator = [
    body('rating')
        .notEmpty().withMessage('Оченка обязательна')
        .isLength({min:1, max:5}).withMessage('Оценка должна быть числом')
];