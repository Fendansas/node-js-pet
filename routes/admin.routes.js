import express from 'express';
import { isAuth } from '../middleware/auth.middleware.js';
import { allow } from '../middleware/permission.middleware.js';

import * as Admin from '../controllers/admin.controller.js';

const router = express.Router();


router.get('/rbac', isAuth, allow('role:read'), Admin.rbacPage)

router.post('/permissions', isAuth, allow('permission:create'), Admin.createPermission);
router.post('/roles', isAuth, allow('role:create'), Admin.createRole);

router.post('/roles/add-permission', isAuth, allow('role:update'), Admin.addPermissionToRole);
router.post('/roles/remove-permission', isAuth, allow('role:update'), Admin.removePermissionFromRole);

export default router;