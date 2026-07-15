import BaseRepository from './base.repository.js';
import { Event } from '../models/Event.js';

class EventRepository extends BaseRepository {
    constructor() {
        super(Event);
    }

    async findAllSorted() {
        return await this.findAll({}, { sort: { createdAt: -1 } });
    }
}

export default new EventRepository();
