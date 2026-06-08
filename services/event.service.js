import {Event} from "../models/Event.js";


class EventService {

    async getAllEvents() {
        return await Event.find();
    }
    async createEvent(data) {
        return await Event.create(data);
    }
    async getEventById(id) {
        return await Event.findById(id);
    }
    async updateEvent(id, data){
        return await Event.findByIdAndUpdate(id, data);
    }

    async delete(id) {
        return await Event.findByIdAndDelete(id);
    }



}

export default new EventService();
