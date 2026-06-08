import {body} from "express-validator";

export const CreatePostValidator = [
    body('title').isLength({min: 3}).withMessage('Название события должно быть не менее 3 символов'),
    body('description').isLength({min: 3}).withMessage('Описание события должно быть не менее 3 символов'),
    body('startTime').isDate().withMessage('Дата и время начала события должны быть в формате даты'),
    body('endTime').isDate().withMessage('Дата и время окончания события должны быть в формате даты'),
    body('status').isIn(['draft', 'active', 'completed']).withMessage('Недопустимый статус события'),

];