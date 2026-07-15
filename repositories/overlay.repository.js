import BaseRepository from './base.repository.js';
import MapOverlay from '../models/MapOverlay.js';

class OverlayRepository extends BaseRepository {
    constructor() {
        super(MapOverlay);
    }

    async findAllSorted() {
        return await this.findAll({}, { sort: { createdAt: -1 } });
    }
}

export default new OverlayRepository();
