import {Event} from '../models/Event.js';


class EventService {

    async getAllEvents() {
        return await Event.find().sort({ createdAt: -1 });
    }
    async createEvent(data) {
        return await Event.create(data);
    }
    async getEventById(id) {
        const event = await Event.findById(id);
        if (!event) {
            const error = new Error('EVENT_NOT_FOUND');
            error.code = 'EVENT_NOT_FOUND';
            throw error;
        }
        return event;
    }
    async updateEvent(id, data){
        const existing = await Event.findById(id);
        if (!existing) {
            const error = new Error('EVENT_NOT_FOUND');
            error.code = 'EVENT_NOT_FOUND';
            throw error;
        }

        return await Event.findByIdAndUpdate(id, data,{new: true});
    }

    async delete(id) {
        const existing = await Event.findById(id);
        if (!existing) {
            const error = new Error('EVENT_NOT_FOUND');
            error.code = 'EVENT_NOT_FOUND';
            throw error;
        }

        return await Event.findByIdAndDelete(id);
    }

}

export default new EventService();
