import anomalyRepository from '../repositories/anomaly.repository.js';

class AnomaliesService {
    async getAll() {
        return await anomalyRepository.findAll({}, { sort: { createdAt: -1 } });
    }

    async getById(id) {
        const anomaly = await anomalyRepository.findById(id);

        if (!anomaly) {
            const error = new Error('ANOMALY_NOT_FOUND');
            error.code = 'ANOMALY_NOT_FOUND';
            throw error;
        }

        return anomaly;
    }

    async create(data) {

        const existing = await anomalyRepository.findByName(data.name);

        if (existing) {
            const error = new Error('ANOMALY_ALREADY_EXISTS');
            error.code = 'ANOMALY_ALREADY_EXISTS';
            throw error;
        }

        return await anomalyRepository.create(data);
    }

    async update(id, data) {

        const existing = await anomalyRepository.findById(id);

        if (!existing) {
            const error = new Error('ANOMALY_NOT_FOUND');
            error.code = 'ANOMALY_NOT_FOUND';
            throw error;
        }

        return await anomalyRepository.update(id, data);
    }

    async delete(id) {
        const existing = await anomalyRepository.findById(id);

        if (!existing) {
            const error = new Error('ANOMALY_NOT_FOUND');
            error.code = 'ANOMALY_NOT_FOUND';
            throw error;
        }

        return await anomalyRepository.delete(id);
    }
}


export default new AnomaliesService();
