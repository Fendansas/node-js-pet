import { BaseController } from './base.controller.js';
import fs from 'fs';
import path from 'path';
import AnomaliesService from '../services/anomaly.service.js';
import { validationResult } from 'express-validator';

export class AnomalyController extends BaseController {

    async index(req, res) {
        console.log('[ANOMALY] Listing anomalies');

        try {
            const anomalies = await AnomaliesService.getAll();
            console.log('[ANOMALY] Found', anomalies.length, 'anomalies');

            return this.renderView(res, 'anomaly/index', { anomalies });

        } catch (error) {
            return this.handleError(res, error, 'Anomalies list error');
        }
    }

    async createPage(req, res) {

        console.log('[ANOMALY] Showing create page');
        try {
            const anomalies = await AnomaliesService.getAll();
            console.log('[ANOMALY] Found', anomalies.length, 'anomalies');

            return this.renderView(res, 'anomaly/create', {anomalies});

        } catch (error) {
            return this.handleError(res, error, 'Anomalies list error');
        }

    }

    async create(req, res) {
        console.log('[ANOMALY] Creating anomaly');

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.sendValidationError(res, errors, 'anomaly/create');
        }

        try {
            const anomaly = await AnomaliesService.create(req.body);
            console.log('[ANOMALY] Anomaly created:', anomaly.name);

            return this.successRedirect(res, '/anomaly', 'Anomaly created');

        } catch (error) {
            return this.handleError(res, error, 'Create anomaly error');
        }
    }

    async editPage(req, res) {
        console.log('[ANOMALY] Editing anomaly:', req.params.id);

        try {
            const anomaly = await AnomaliesService.getById(req.params.id);

            if (!anomaly) {
                return res.status(404).send('Anomaly not found');
            }

            return this.renderView(res, 'anomaly/edit', { anomaly });

        } catch (error) {
            return this.handleError(res, error, 'Edit anomaly error');
        }
    }

    async update(req, res) {
        console.log('[ANOMALY] Updating anomaly:', req.params.id);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return this.sendValidationError(res, errors, 'anomaly/edit', {
                anomaly: { _id: req.params.id, ...req.body }
            });
        }

        try {
            const updateData = {
                ...req.body,
                latitude: Number(req.body.latitude),
                longitude: Number(req.body.longitude),
                radius: Number(req.body.radius),
                value: Number(req.body.value)
            };

            console.log('[ANOMALY] Update data:', updateData);

            await AnomaliesService.update(req.params.id, updateData);
            console.log('[ANOMALY] Anomaly updated successfully');

            return this.successRedirect(res, '/anomaly', 'Anomaly updated');

        } catch (error) {
            return this.handleError(res, error, 'Update anomaly error');
        }
    }

    async delete(req, res) {
        console.log('[ANOMALY] Deleting anomaly:', req.params.id);

        try {
            await AnomaliesService.delete(req.params.id);
            console.log('[ANOMALY] Anomaly deleted successfully');

            return this.successRedirect(res, '/anomaly', 'Anomaly deleted');

        } catch (error) {
            return this.handleError(res, error, 'Delete anomaly error');
        }
    }

    async export(req, res) {
        console.log('[ANOMALY] Exporting anomalies to file');

        try {
            const anomalies = await AnomaliesService.getAll();
            console.log('[ANOMALY] Total anomalies:', anomalies.length);

            let content = '';
            anomalies.forEach(item => {
                content += `${item.name},${item.latitude},${item.longitude},${item.radius},${item.type},${item.value}\n`;
            });

            console.log('[ANOMALY] Export content length:', content.length);

            const exportDir = path.join(process.cwd(), 'exports');

            if (!fs.existsSync(exportDir)) {
                fs.mkdirSync(exportDir, { recursive: true });
                console.log('[ANOMALY] Created export directory');
            }

            const filePath = path.join(exportDir, 'anomalies.txt');
            fs.writeFileSync(filePath, content, 'utf-8');

            console.log('[ANOMALY] Export completed:', filePath);

            return res.send({
                success: true,
                message: 'Файл успешно обновлен',
                path: filePath
            });

        } catch (error) {
            console.log('[ANOMALY] Export error:', error.message);
            return this.handleError(res, error, 'Export error');
        }
    }
}

export default new AnomalyController();