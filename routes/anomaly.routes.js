import express from "express";
import anomalyController from "../controllers/anomaly.controller.js";
import { allow } from "../middleware/permission.middleware.js";
import {anomalyCreateValidator, anomalyUpdateValidator} from "../validators/anomaly.validator.js";
import { validate } from "../middleware/validation.middleware.js";
import { uploadScreenshot } from "../middleware/upload.js";


const router = express.Router();

router.get(
    "/",
    allow('anomaly:read'),
    (req, res) => anomalyController.index(req, res)
);

router.get(
    "/create",
    allow('anomaly:create'),
    (req, res) => anomalyController.createPage(req, res)
);

router.post('/create',
    allow('anomaly:create'),
    anomalyCreateValidator,
    validate,
    (req, res) => anomalyController.create(req, res));

// Карта аномалий
router.get(
    '/map',
    allow('anomaly:read'),
    (req, res) => anomalyController.showMapPage(req, res)
);

router.post(
    '/save-screenshot',
    uploadScreenshot.single('screenshot'),
    (req, res) => anomalyController.saveScreenshot(req, res)
);

router.get(
    '/export',
    allow('anomaly:export'),
    (req, res) => anomalyController.export(req, res)
);

// Динамические ID
router.get("/:id",
    allow('anomaly:read'),
    (req, res) => anomalyController.show(req, res));

router.get(
    '/:id/edit',
    allow('anomaly:update'),
    (req, res) => anomalyController.editPage(req, res)
);

router.post(
    '/:id/update',
    allow('anomaly:update'),
    anomalyUpdateValidator,
    validate,
    (req, res) => anomalyController.update(req, res)
);

router.post(
    '/:id/delete',
    allow('anomaly:delete'),
    (req, res) => anomalyController.delete(req, res)
);

export default router;