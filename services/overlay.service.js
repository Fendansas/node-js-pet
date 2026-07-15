import overlayRepository from '../repositories/overlay.repository.js';

class OverlayService {
    async getAll() {
        return await overlayRepository.findAllSorted();
    }

    async getById(id) {
        const overlay = await overlayRepository.findById(id);
        if (!overlay) {
            const error = new Error('OVERLAY_NOT_FOUND');
            error.code = 'OVERLAY_NOT_FOUND';
            throw error;
        }
        return overlay;
    }

    async create(data) {
        return await overlayRepository.create(data);
    }

    async update(id, data) {
        const overlay = await overlayRepository.update(id, data);
        if (!overlay) {
            const error = new Error('OVERLAY_NOT_FOUND');
            error.code = 'OVERLAY_NOT_FOUND';
            throw error;
        }
        return overlay;
    }

    async delete(id) {
        const overlay = await overlayRepository.delete(id);
        if (!overlay) {
            const error = new Error('OVERLAY_NOT_FOUND');
            error.code = 'OVERLAY_NOT_FOUND';
            throw error;
        }
        return overlay;
    }
}

export default new OverlayService();
