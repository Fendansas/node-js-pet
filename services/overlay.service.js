import MapOverlay from '../models/MapOverlay.js';

class OverlayService {
    async getAll() {
        return MapOverlay.find().sort({ createdAt: -1 });
    }

    async getById(id) {
        const overlay = await MapOverlay.findById(id);
        if (!overlay) {
            const error = new Error('OVERLAY_NOT_FOUND');
            error.code = 'OVERLAY_NOT_FOUND';
            throw error;
        }
        return overlay;
    }

    async create(data) {
        return MapOverlay.create(data);
    }

    async update(id, data) {
        const overlay = await MapOverlay.findByIdAndUpdate(id, data, { new: true });
        if (!overlay) {
            const error = new Error('OVERLAY_NOT_FOUND');
            error.code = 'OVERLAY_NOT_FOUND';
            throw error;
        }
        return overlay;
    }

    async delete(id) {
        const overlay = await MapOverlay.findByIdAndDelete(id);
        if (!overlay) {
            const error = new Error('OVERLAY_NOT_FOUND');
            error.code = 'OVERLAY_NOT_FOUND';
            throw error;
        }
        return overlay;
    }
}

export default new OverlayService();
