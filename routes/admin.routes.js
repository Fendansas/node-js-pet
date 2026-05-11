import express from 'express';
import { isAuth } from '../middleware/auth.middleware.js';
import { allow } from '../middleware/permission.middleware.js';

import * as Admin from '../controllers/admin.controller.js';
import {createPermissionValidator, createRoleValidator, rolePermissionValidator} from "../validators/rbac.validator.js";
import {validate} from "../middleware/validation.middleware.js";
import * as User from '../controllers/user.controller.js';

const router = express.Router();

router.get('/rbac',
                isAuth,
                allow('role:read'),
                Admin.rbacPage
);
router.post('/permissions',
    isAuth,
    allow('permission:create'),
    createPermissionValidator,
    validate,
    Admin.createPermission
);
router.post('/roles',
    isAuth,
    allow('role:create'),
    createRoleValidator,
    validate,
    Admin.createRole
);

router.post('/roles/add-permission',
    isAuth,
    allow('role:update'),
    rolePermissionValidator,
    validate,
    Admin.addPermissionToRole);

router.post('/roles/remove-permission',
    isAuth,
    allow('role:update'),
    rolePermissionValidator,
    validate,
    Admin.removePermissionFromRole);

router.get('/users',
    isAuth,
    allow('role:read'),
    User.getAllUsers
);

export default router;