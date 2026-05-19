import AnomaliesService from "../services/anomaly.service.js";
import {validationResult} from "express-validator";
import { anomalyCreateValidator } from '../validators/anomaly.validator.js';

class AnomalyController {

    async index(req, res) {
        const anomalies = await AnomaliesService.getAll();
        console.log(anomalies)
        res.render('anomaly/index', {anomalies});
    }

    async createPage (req, res){
        res.render('anomaly/create');
    }

    async create(req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('anomaly/create', { errors: errors.array() });
        }

        try {

            const anomaly = await AnomaliesService.create(req.body);
            res.redirect('/anomaly');
        } catch (error) {
            console.log(error)
            res.status(500).send('Error creating anomaly');
        }

    }



}


export default new AnomalyController();