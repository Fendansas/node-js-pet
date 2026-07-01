import express from 'express';
import { isAuth } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';
import { allow } from '../middleware/permission.middleware.js';

import AdminController from '../controllers/admin.controller.js';
import UserController from '../controllers/user.controller.js';
import {createPermissionValidator, createRoleValidator, rolePermissionValidator} from "../validators/rbac.validator.js";
import {validate} from "../middleware/validation.middleware.js";

const router = express.Router();

router.use(isAdmin);

router.get('/rbac',
    allow('rbac:manage'),
    (req, res) => AdminController.showRbacPage(req, res));

router.post('/permissions',
    allow('rbac:manage'),
    createPermissionValidator,
    validate,
    (req, res) => AdminController.createPermission(req, res)
);

router.post('/roles',
    allow('rbac:manage'),
    createRoleValidator,
    validate,
    (req, res) => AdminController.createRole(req, res)
);

router.post('/roles/add-permission',
    allow('rbac:manage'),
    rolePermissionValidator,
    validate,
    (req, res) => AdminController.assignPermissionToRole(req, res));

router.post('/roles/remove-permission',
    allow('rbac:manage'),
    rolePermissionValidator,
    validate,
    (req, res) => AdminController.unassignPermissionToRole(req, res));

router.get('/users',
    allow('user:read'),
    (req, res) => UserController.getAllUsers(req, res)
);

export default router;