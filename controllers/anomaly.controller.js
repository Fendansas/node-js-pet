import fs from "fs";
import path from "path";

import AnomaliesService from "../services/anomaly.service.js";
import {validationResult} from "express-validator";
import { anomalyCreateValidator } from '../validators/anomaly.validator.js';

class AnomalyController {

    async index(req, res) {
        const anomalies = await AnomaliesService.getAll();

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

    async editPage(req, res) {
        try {
            const anomaly = await AnomaliesService.getById(req.params.id);
            if (!anomaly) {
                return res.status(404).send('Anomaly not found');
            }
            res.render('anomaly/edit', {anomaly});

        } catch (error) {
            console.log(error)
            res.status(500).send('Error editing anomaly');
        }
    }

    async update(req, res) {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.render('anomaly/edit', {
                anomaly: {
                    _id: req.params.id,
                    ...req.body
                },
                errors: errors.array()
            });
        }

        try {

            await AnomaliesService.update(
                req.params.id,
                {
                    ...req.body,
                    latitude: Number(req.body.latitude),
                    longitude: Number(req.body.longitude),
                    radius: Number(req.body.radius),
                    value: Number(req.body.value)
                }
            );

            res.redirect('/anomaly');

        } catch (error) {

            console.log(error);

            res.status(500).send('Error updating anomaly');
        }
    }

    async delete(req, res) {

        try {

            await AnomaliesService.delete(req.params.id);

            res.redirect('/anomaly');

        } catch (error) {

            console.log(error);

            res.status(500).send('Error deleting anomaly');
        }
    }

    async export(req, res){
        console.log('start')
        try {
            const anomalies = await AnomaliesService.getAll();
            console.log('allAnomalies', anomalies)
            let content ='';

            anomalies.forEach(item => {
                content += `${item.name},${item.latitude},${item.longitude},${item.radius},${item.type},${item.value}\n`;
            });
            console.log('content', content)
            const exportDir = path.join(process.cwd(), 'exports');

            if (!fs.existsSync(exportDir)) {
                fs.mkdirSync(exportDir, {
                    recursive: true
                });
            }

            const filePath = path.join(
                exportDir,
                'anomalies.txt'
            );

            fs.writeFileSync(
                filePath,
                content,
                'utf-8'
            );


            res.send({
                success: true,
                message: 'Файл успешно обновлен',
                path: filePath
            });

        } catch (error) {

        }
    }



}


export default new AnomalyController();