import eventRepository from '../repositories/event.repository.js';


class EventService {

    async getAllEvents() {
        return await eventRepository.findAllSorted();
    }
    async createEvent(data) {
        return await eventRepository.create(data);
    }
    async getEventById(id) {
        const event = await eventRepository.findById(id);
        if (!event) {
            const error = new Error('EVENT_NOT_FOUND');
            error.code = 'EVENT_NOT_FOUND';
            throw error;
        }
        return event;
    }
    async updateEvent(id, data){
        const existing = await eventRepository.findById(id);
        if (!existing) {
            const error = new Error('EVENT_NOT_FOUND');
            error.code = 'EVENT_NOT_FOUND';
            throw error;
        }

        return await eventRepository.update(id, data);
    }

    async delete(id) {
        const existing = await eventRepository.findById(id);
        if (!existing) {
            const error = new Error('EVENT_NOT_FOUND');
            error.code = 'EVENT_NOT_FOUND';
            throw error;
        }

        return await eventRepository.delete(id);
    }

}

export default new EventService();
