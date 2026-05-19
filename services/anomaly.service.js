import Anomaly from '../models/Anomaly.js';

class AnomaliesService {
    async getAll() {
        return await Anomaly.find().sort({ createdAt: -1 });
    }

    async create(data) {
        return await Anomaly.create(data);
    }
}


export default new AnomaliesService();