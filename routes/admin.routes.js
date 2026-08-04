import express from 'express';
import { isAuth } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';
import { allow } from '../middleware/permission.middleware.js';

import AdminController from '../controllers/admin.controller.js';
import UserController from '../controllers/user.controller.js';
import PersonController from '../controllers/person.controller.js';
import { personValidator } from '../validators/person.validator.js';
import { uploadPerson } from '../middleware/upload.js';
import {createPermissionValidator, createRoleValidator, rolePermissionValidator} from '../validators/rbac.validator.js';
import {validate} from '../middleware/validation.middleware.js';

const router = express.Router();

router.use(isAdmin);

router.get('/',
    allow('dashboard:read'),
    (req, res) => AdminController.dashboard(req, res));

router.get('/dashboard',
    allow('dashboard:read'),
    (req, res) => AdminController.dashboard(req, res));

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

// ===== Эталоны лиц (распознавание) =====

router.get('/persons',
    allow('person:read'),
    (req, res) => PersonController.index(req, res));

router.get('/persons/create',
    allow('person:manage'),
    (req, res) => PersonController.createPage(req, res));

router.post('/persons',
    allow('person:manage'),
    uploadPerson.single('photo'),
    personValidator,
    validate,
    (req, res) => PersonController.create(req, res));

router.get('/persons/:id',
    allow('person:read'),
    (req, res) => PersonController.show(req, res));

router.post('/persons/:id/photos',
    allow('person:manage'),
    uploadPerson.single('photo'),
    (req, res) => PersonController.addPhoto(req, res));

router.post('/persons/:id/photos/:photoIndex/delete',
    allow('person:manage'),
    (req, res) => PersonController.deletePhoto(req, res));

router.post('/persons/:id/delete',
    allow('person:manage'),
    (req, res) => PersonController.delete(req, res));

router.post('/persons/rescan',
    allow('person:manage'),
    (req, res) => PersonController.rescan(req, res));

export default router;