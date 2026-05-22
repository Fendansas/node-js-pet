import express from "express";
import anomalyController from "../controllers/anomaly.controller.js";
import {anomalyCreateValidator} from "../validators/anomaly.validator.js";



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
    anomalyCreateValidator, (req, res) => anomalyController.create(req, res));

router.get(
    '/edit/:id',
    (req, res) => anomalyController.editPage(req, res)
);

router.post(
    '/edit/:id',
    anomalyCreateValidator,
    (req, res) => anomalyController.update(req, res)
);

router.post(
    '/delete/:id',
    (req, res) => anomalyController.delete(req, res)
);

router.get(
    '/export',
    (req, res) => anomalyController.export(req, res)
);

export default router;