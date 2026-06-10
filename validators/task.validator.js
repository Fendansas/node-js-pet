import {body} from "express-validator";

export const TaskValidator = [
    body('eventId','Id События').notEmpty().withMessage('Поле не может быть пустым'),
    body('title', 'Название задачи').notEmpty().withMessage('Поле не может быть пустым'),
    body('description', 'Описание задачи').notEmpty().withMessage('Поле не может быть пустым'),
    body('reward', 'Награда').notEmpty().withMessage('Поле не может быть пустым'),
    body('status', 'Статус').notEmpty().withMessage('Поле не может быть пустым'),

];