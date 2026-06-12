import express from 'express';
import { isAuth } from '../middleware/auth.middleware.js';
import { allow } from '../middleware/permission.middleware.js';

import AdminController from '../controllers/admin.controller.js';
import UserController from '../controllers/user.controller.js';
import {createPermissionValidator, createRoleValidator, rolePermissionValidator} from "../validators/rbac.validator.js";
import {validate} from "../middleware/validation.middleware.js";

const router = express.Router();

router.get('/rbac', (req, res) => AdminController.showRbacPage(req, res));
router.post('/permissions',
    createPermissionValidator,
    validate,
    (req, res) => AdminController.createPermission(req, res)
)
router.post('/roles',
    createRoleValidator,
    validate,
    (req, res) => AdminController.createRole(req, res)
);
router.post('/roles/add-permission',
    isAuth,
    allow('role:update'),
    rolePermissionValidator,
    validate,
    (req, res) => AdminController.assignPermissionToRole(req, res));

router.post('/roles/remove-permission',
    isAuth,
    allow('role:update'),
    rolePermissionValidator,
    validate,
    (req, res) => AdminController.unassignPermissionToRole(req, res));

router.get('/users',
    isAuth,
    allow('role:read'),
    (req, res) => UserController.getAllUsers(req, res)
);

export default router;