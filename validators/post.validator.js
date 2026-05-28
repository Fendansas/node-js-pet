import {body} from "express-validator";

export const CreatePostValidator = [
    body('title', 'Название не может быть пустым').notEmpty(),
    body('content', 'Описание не может быть пустым').notEmpty(),
    body('category', 'Категория не может быть пустой').notEmpty(),
    body('status','Статус не может быть пустым').notEmpty()

];