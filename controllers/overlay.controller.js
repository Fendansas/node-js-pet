import { BaseController } from './base.controller.js';
import OverlayService from '../services/overlay.service.js';

class OverlayController extends BaseController {
    async index(req, res) {
        try {
            const overlays = await OverlayService.getAll();
            res.json({ success: true, data: overlays });
        } catch (error) {
            console.error('[OVERLAY] Index error:', error);
            res.status(500).json({ success: false, message: 'Ошибка сервера' });
        }
    }

    async uploadImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'Файл не загружен' });
            }

            const imageUrl = '/uploads/overlays/' + req.file.filename;

            res.json({ success: true, data: { imageUrl } });
        } catch (error) {
            console.error('[OVERLAY] Upload error:', error);
            res.status(500).json({ success: false, message: 'Ошибка загрузки' });
        }
    }

    async store(req, res) {
        try {
            const data = {
                name: req.body.name,
                imageUrl: req.body.imageUrl,
                bounds: {
                    lat1: Number(req.body.lat1),
                    lng1: Number(req.body.lng1),
                    lat2: Number(req.body.lat2),
                    lng2: Number(req.body.lng2)
                },
                opacity: Number(req.body.opacity) || 0.8,
                zIndex: Number(req.body.zIndex) || 1
            };

            const overlay = await OverlayService.create(data);
            res.json({ success: true, data: overlay });
        } catch (error) {
            console.error('[OVERLAY] Store error:', error);
            res.status(500).json({ success: false, message: 'Ошибка сервера' });
        }
    }

    async update(req, res) {
        try {
            const data = {
                name: req.body.name,
                bounds: {
                    lat1: Number(req.body.lat1),
                    lng1: Number(req.body.lng1),
                    lat2: Number(req.body.lat2),
                    lng2: Number(req.body.lng2)
                },
                opacity: Number(req.body.opacity) || 0.8
            };

            if (req.body.imageUrl) {
                data.imageUrl = req.body.imageUrl;
            }

            const overlay = await OverlayService.update(req.params.id, data);
            res.json({ success: true, data: overlay });
        } catch (error) {
            console.error('[OVERLAY] Update error:', error);
            if (error.code === 'OVERLAY_NOT_FOUND') {
                return res.status(404).json({ success: false, message: 'Overlay не найден' });
            }
            res.status(500).json({ success: false, message: 'Ошибка сервера' });
        }
    }

    async destroy(req, res) {
        try {
            await OverlayService.delete(req.params.id);
            res.json({ success: true, message: 'Overlay удалён' });
        } catch (error) {
            console.error('[OVERLAY] Delete error:', error);
            if (error.code === 'OVERLAY_NOT_FOUND') {
                return res.status(404).json({ success: false, message: 'Overlay не найден' });
            }
            res.status(500).json({ success: false, message: 'Ошибка сервера' });
        }
    }
}

export default new OverlayController();
