import Anomaly from '../models/Anomaly.js';

class AnomaliesService {
    async getAll() {
        return await Anomaly.find().sort({ createdAt: -1 });
    }

    async getById(id) {

        return await Anomaly.findById(id);
    }

    async create(data) {
        return await Anomaly.create(data);
    }

    async update(id, data) {

        return await Anomaly.findByIdAndUpdate(
            id,
            data,
            {
                new: true
            }
        );
    }

    async delete(id) {

        return await Anomaly.findByIdAndDelete(id);
    }
}


export default new AnomaliesService();