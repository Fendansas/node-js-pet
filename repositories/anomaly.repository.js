import BaseRepository from './base.repository.js';
import Anomaly from '../models/Anomaly.js';

class AnomalyRepository extends BaseRepository {
    constructor() {
        super(Anomaly);
    }

    async findByName(name) {
        return await this.findOne({ name });
    }
}

export default new AnomalyRepository();
