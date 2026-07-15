import { BaseController } from './base.controller.js';
import fs from 'fs';
import path from 'path';
import AnomaliesService from '../services/anomaly.service.js';

export class AnomalyController extends BaseController {

    async index(req, res) {
        console.log('[ANOMALY] Listing anomalies');

        try {
            const anomalies = await AnomaliesService.getAll();
            console.log('[ANOMALY] Found', anomalies.length, 'anomalies');

            return this.renderView(res, 'anomaly/index', { anomalies });

        } catch (error) {
            console.error('[ANOMALY] Index error:', error);
            return this.handleError(res, error, 'Anomalies list error');
        }
    }

    async createPage(req, res) {
        console.log('[ANOMALY] Showing create page');

        try {
            const anomalies = await AnomaliesService.getAll();
            console.log('[ANOMALY] Found', anomalies.length, 'anomalies');

            return this.renderView(res, 'anomaly/create', {
            anomalies,
            screenshot: req.query.screenshot || '',
            markers: req.query.markers || ''
        });

        } catch (error) {
            console.error('[ANOMALY] Create page error:', error);
            return this.handleError(res, error, 'Anomalies list error');
        }

    }

    async create(req, res) {
        console.log('[ANOMALY] Creating anomaly');

        try {
            const { screenshot, markers, ...body } = req.body;
            const queryScreenshot = req.query.screenshot;
            const queryMarkers = req.query.markers;
            
            const data = {
                ...body,
                screenshot: screenshot || queryScreenshot || null,
                markers: markers || (queryMarkers ? JSON.parse(queryMarkers) : [])
            };

            const anomaly = await AnomaliesService.create(data);
            console.log('[ANOMALY] Anomaly created:', anomaly.name);

            return this.successRedirect(req, res, '/anomaly', 'Anomaly created');

        } catch (error) {
            console.error('[ANOMALY] Create error:', error);
            if (error.code === 'ANOMALY_ALREADY_EXISTS') {
                return res.status(409).json({ success: false, message: 'Anomaly with this name already exists' });
            }
            return this.handleError(res, error, 'Create anomaly error');
        }
    }

    async show(req, res) {
        console.log('[ANOMALY] Showing anomaly:', req.params.id);

        try {
            const anomaly = await AnomaliesService.getById(req.params.id);

            if (!anomaly) {
                console.log('[ANOMALY] Anomaly not found:', req.params.id);
                return res.status(404).json({ success: false, message: 'Anomaly not found' });
            }

            return this.renderView(res, 'anomaly/show', { anomaly });
        } catch (error) {
            console.error('[ANOMALY] Show error:', error);

            if (error.code === 'ANOMALY_NOT_FOUND') {
                return res.status(404).json({ success: false, message: 'Anomaly not found' });
            }

            return this.handleError(res, error, 'Show anomaly error');
        }
    }

    async editPage(req, res) {
        console.log('[ANOMALY] Editing anomaly:', req.params.id);

        try {
            const anomaly = await AnomaliesService.getById(req.params.id);

            if (!anomaly) {
                console.log('[ANOMALY] Anomaly not found:', req.params.id);
                return res.status(404).json({ success: false, message: 'Anomaly not found' });
            }

            return this.renderView(res, 'anomaly/edit', { anomaly });

        } catch (error) {
            console.error('[ANOMALY] Edit page error:', error);

            if (error.code === 'ANOMALY_NOT_FOUND') {
                return res.status(404).json({ success: false, message: 'Anomaly not found' });
            }

            return this.handleError(res, error, 'Edit anomaly error');
        }
    }

    async update(req, res) {
        console.log('[ANOMALY] Updating anomaly:', req.params.id);

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

            return this.successRedirect(req, res, '/anomaly', 'Anomaly updated');

        } catch (error) {
            console.error('[ANOMALY] Update error:', error);

            if (error.code === 'ANOMALY_NOT_FOUND') {
                return res.status(404).json({ success: false, message: 'Anomaly not found' });
            }

            return this.handleError(res, error, 'Update anomaly error');
        }
    }

    async delete(req, res) {
        console.log('[ANOMALY] Deleting anomaly:', req.params.id);

        try {
            await AnomaliesService.delete(req.params.id);
            console.log('[ANOMALY] Anomaly deleted successfully');

            return this.successRedirect(req, res, '/anomaly', 'Anomaly deleted');

        } catch (error) {
            console.error('[ANOMALY] Delete error:', error);

            if (error.code === 'ANOMALY_NOT_FOUND') {
                return res.status(404).json({ success: false, message: 'Anomaly not found' });
            }

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

            return res.json({
                success: true,
                message: 'Файл успешно обновлен',
                path: filePath
            });

        } catch (error) {
            console.log('[ANOMALY] Export error:', error.message);
            return this.handleError(res, error, 'Export error');
        }
    }

    /**
     * Показ страницы с картой
     */
    async showMapPage(req, res) {
        console.log('[ANOMALY] Showing map page');

        try {
            const anomalies = await AnomaliesService.getAll();
            console.log('[ANOMALY] Found', anomalies.length, 'anomalies for map');

            return this.renderView(res, 'anomaly/map', { anomalies });
        } catch (error) {
            console.error('[ANOMALY] Map page error:', error);
            return this.handleError(res, error, 'Map page error');
        }
    }

    /**
     * Сохранение скриншота области карты
     */
    async saveScreenshot(req, res) {
        console.log('[ANOMALY] Saving screenshot');

        try {
            if (!req.file) {
                console.log('[ANOMALY] No file in request');
                return res.status(400).json({
                    success: false,
                    message: 'Файл не загружен'
                });
            }

            const filename = req.file.filename;
            const screenshotPath = `/uploads/screenshots/${filename}`;
            
            // Парсим пометки из body
            let markers = [];
            if (req.body.markers) {
                try {
                    markers = JSON.parse(req.body.markers);
                    console.log('[ANOMALY] Markers count:', markers.length);
                } catch (e) {
                    console.log('[ANOMALY] Failed to parse markers:', e.message);
                }
            }
            
            // Парсим координаты из body
            let coordinates = {};
            if (req.body.coordinates) {
                try {
                    coordinates = JSON.parse(req.body.coordinates);
                } catch (e) {
                    console.log('[ANOMALY] Failed to parse coordinates:', e.message);
                }
            }

            console.log('[ANOMALY] Screenshot saved:', screenshotPath);
            console.log('[ANOMALY] Original name:', req.file.originalname);

            return res.json({
                success: true,
                message: 'Скриншот сохранён',
                path: screenshotPath,
                filename: filename,
                markers: markers,
                coordinates: coordinates
            });

        } catch (error) {
            console.error('[ANOMALY] Save screenshot error:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сохранения скриншота'
            });
        }
    }
}

export default new AnomalyController();