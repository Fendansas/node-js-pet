import Anomaly from '../models/Anomaly.js';

class AnomaliesService {
    async getAll() {
        return await Anomaly.find().sort({ createdAt: -1 });
    }

    async getById(id) {
        const anomaly = await Anomaly.findById(id);

        if (!anomaly) {
            const error = new Error('ANOMALY_NOT_FOUND');
            error.code = 'ANOMALY_NOT_FOUND';
            throw error;
        }

        return anomaly;
    }

    async create(data) {

        const existing = await Anomaly.findOne({ name: data.name });

        if (existing) {
            const error = new Error('ANOMALY_ALREADY_EXISTS');
            error.code = 'ANOMALY_ALREADY_EXISTS';
            throw error;
        }

        return await Anomaly.create(data);
    }

    async update(id, data) {

        const existing = await Anomaly.findById(id);

        if (!existing) {
            const error = new Error('ANOMALY_NOT_FOUND');
            error.code = 'ANOMALY_NOT_FOUND';
            throw error;
        }

        return await Anomaly.findByIdAndUpdate(
            id,
            data,
            {
                new: true
            }
        );
    }

    async delete(id) {
        const existing = await Anomaly.findById(id);

        if (!existing) {
            const error = new Error('ANOMALY_NOT_FOUND');
            error.code = 'ANOMALY_NOT_FOUND';
            throw error;
        }

        return await Anomaly.findByIdAndDelete(id);
    }
}


export default new AnomaliesService();