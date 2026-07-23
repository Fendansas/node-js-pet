import BaseRepository from "./base.repository.js";
import Item from "../models/Item.js";

class ItemRepository extends BaseRepository {
    constructor() {
        super(Item);
    }

    async findByPlayer(playerId){
        return await this.findAll({playerId});
    }

    async findActiveByPlayer(playerId){
        return await this.findAll({playerId, isActive: true});
    }

    async findConsumedByPlayer (playerId){
        return await this.findAll({playerId, isConsumed: true})
    }
}

export default new ItemRepository();