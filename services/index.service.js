import itemRepository from "../repositories/item.repository.js";
import itemDescriptorRepository from "../repositories/itemDescriptor.repository.js";

class IndexService{

    async getHomePageData(userId){
        const latestItems = await itemRepository.findAll(
            {playerId: userId},
            {sort:{createdAt: -1}, limit: 5}
        )

        const itemsWithDescriptors = await Promise.all(
            latestItems.map(async (item)=>{
                const desc = await itemDescriptorRepository.findByCode(item.code);
                return {...item.toObject(), descriptor:desc};
            })
        )

        const latestProducts = await itemDescriptorRepository.findAll(
            {},
            {sort: {createdAt:-1}, limit:5}
        )

        const totalItems = await itemRepository.count({playerId: userId});
        const consumedItems = await itemRepository.count({playerId: userId, isConsumed: true});

        return {latestItems: itemsWithDescriptors, latestProducts, totalItems, consumedItems}
    }
}

export default new IndexService();