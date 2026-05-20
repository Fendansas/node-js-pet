import express from "express";
import anomalyController from "../controllers/anomaly.controller.js";
import {anomalyCreateValidator} from "../validators/anomaly.validator.js";



const router = express.Router();

router.get(
    "/",
    anomalyController.index
);

router.get(
    "/create",
    anomalyController.createPage
);
router.post('/create',
    anomalyCreateValidator, anomalyController.create);

router.get(
    '/edit/:id',
    anomalyController.editPage
);

router.post(
    '/edit/:id',
    anomalyCreateValidator,
    anomalyController.update
);

router.post(
    '/delete/:id',
    anomalyController.delete
);

router.get(
    '/export',
    anomalyController.export
);

export default router;