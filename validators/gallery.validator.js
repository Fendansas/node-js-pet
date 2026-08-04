import {body} from "express-validator";

export const galleryUploadValidator = [
    body('title')
        .optional({checkFalsy: true})
        .trim()
        .isLength({max:200})
        .withMessage('Подпись не должна превышать 200 символов')
];

