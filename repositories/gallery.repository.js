import BaseRepository from "./base.repository.js";
import GalleryPhoto from "../models/GalleryPhoto.js";


class GalleryRepository extends BaseRepository {
    constructor() {
        super(GalleryPhoto);
    }
}
export default new GalleryRepository()