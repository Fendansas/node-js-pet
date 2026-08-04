import BaseRepository from './base.repository.js';
import Person from '../models/Person.js';

class PersonRepository extends BaseRepository {
    constructor() {
        super(Person);
    }
}

export default new PersonRepository();
