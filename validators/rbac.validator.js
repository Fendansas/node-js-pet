import {body} from "express-validator"

export const createPermissionValidator = [
    body('name')
        .trim()
        .isString()
        .notEmpty()
        .isLength({min: 3})
        .withMessage('Name must be at least 3 characters long'),

    body('description')
        .trim()
        .isString()
        .isLength({min: 3})
        .withMessage('Description must be at least 3 characters long')
];

export const createRoleValidator = [
    body("name")
        .trim()
        .isString()
        .notEmpty()
        .isLength({min: 3})
        .withMessage('Name must be at least 3 characters long')
];

export const rolePermissionValidator = [
    body("roleId")
        .notEmpty()
        .withMessage('Role ID is required'),
    body("permissionId")
        .notEmpty()
        .withMessage('Permission ID is required')
];