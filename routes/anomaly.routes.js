import express from "express";
import anomalyController from "../controllers/anomaly.controller.js";
import {anomalyCreateValidator, anomalyUpdateValidator} from "../validators/anomaly.validator.js";
import { validate } from "../middleware/validation.middleware.js";


const router = express.Router();

router.get(
    "/",
    (req, res) => anomalyController.index(req, res)
);

router.get(
    "/create",
    (req, res) => anomalyController.createPage(req, res)
);
router.post('/create',
    anomalyCreateValidator,
    validate,
    (req, res) => anomalyController.create(req, res));

router.get("/:id", (req, res) => anomalyController.show(req, res));

router.get(
    '/:id/edit',
    (req, res) => anomalyController.editPage(req, res)
);

router.post(
    '/:id/update',
    anomalyUpdateValidator,
    validate,
    (req, res) => anomalyController.update(req, res)
);

router.post(
    '/:id/delete',
    (req, res) => anomalyController.delete(req, res)
);

router.get(
    '/export',
    (req, res) => anomalyController.export(req, res)
);

export default router;