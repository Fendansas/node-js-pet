import {body} from 'express-validator';

export const updateProfileValidator = [
    body('username')
        .trim()
        .isLength({min: 3, max: 20})
        .withMessage('Username must be 3-20 chars'),
    body('email')
        .optional({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email')
        .normalizeEmail(),
    body('bio')
        .optional()
        .isLength({ max: 200 })
        .withMessage('Bio max length 200'),

    body('avatar')
        .optional()
        .isString(),

    body('rank')
        .optional()
        .isIn(['stalker', 'svoboda', 'dolg', 'monolit'])
        .withMessage('Invalid rank')
];