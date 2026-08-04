import fs from 'fs';
import path from "path";
import galleryRepository from "../repositories/gallery.repository.js";
import personRepository from "../repositories/person.repository.js";
import faceService from "./face.service.js";

class GalleryService{
    async getApproved (){
        return await galleryRepository.findAll(
            {status: 'approved'},
            {sort: {createdAt: -1}, populate: 'author'}
        )
    }

    async getUserPhotos(userId){
        return await galleryRepository.findAll(
            {author: userId},
            {sort: {createdAt: -1}, populate: 'author'}
        )
    }

    async getPending(){
        return await galleryRepository.findAll(
            {status: 'pending'},
            {sort:{createdAt: -1}, populate: 'author'}
        )
    }

    async getById(id){
        return await galleryRepository.findById(id, 'author');
    }

    async create (data, isAdmin){
        return await galleryRepository.create({
            ...data,
            status: isAdmin ? 'approved' : 'pending'
        });
    }

    async approve (id, moderatorId){
        const photo = await galleryRepository.findById(id);

        if(!photo){
            const error = new Error('PHOTO_NOT_FOUND');
            error.code = 'PHOTO_NOT_FOUND';
            throw error;
        }

        return await galleryRepository.update(id, {
            status: 'approved',
            moderatedBy: moderatorId,
            moderatedAt: new Date()
        })
    }

    async reject(id, moderatorId){
        const photo = await galleryRepository.findById(id);
        if(!photo){
            const error = new Error('PHOTO_NOT_FOUND');
            error.code = 'PHOTO_NOT_FOUND';
            throw error;
        }

        await this.deleteFile(photo.imageUrl);

        return await galleryRepository.update(id,{
            status: 'rejected',
            moderatedBy: moderatorId,
            moderatedAt: new Date()
        })

    }

    async delete(id){
        const photo = await galleryRepository.findById(id);
        if(!photo){
            const error = new Error('PHOTO_NOT_FOUND');
            error.code = 'PHOTO_NOT_FOUND';
            throw error;
        }

        await this.deleteFile(photo.imageUrl);
        return await galleryRepository.delete(id);
    }

    async deleteFile(imageUrl){
        const filePath = path.join(process.cwd(), 'public', imageUrl.replace(/^\//, ''));
        try {
            if (fs.existsSync(filePath)){
                fs.unlinkSync(filePath)
            }
        }catch (error){
            console.error('[GALLERY] file delete error:', error.message);
        }
    }

    async scanFaces(photo){
        try {
            const filePath = path.join(process.cwd(), 'public', photo.imageUrl.replace(/^\//, ''));
            if (!fs.existsSync(filePath)) return 0;

            const faces = await faceService.scanImage(filePath);
            if (!faces.length) return 0;

            const persons = await personRepository.findAll({}, { select: '_id name photos' });
            const matched = faceService.matchFaces(faces, persons);

            await galleryRepository.update(photo._id, { faces: matched });
            console.log('[GALLERY] Faces scanned for', photo._id, ':', matched.length);
            return matched.length;
        } catch (error) {
            console.error('[GALLERY] Face scan error:', error.message);
            return 0;
        }
    }

    async rescanFaces(filter = { status: 'approved' }){
        const photos = await galleryRepository.findAll(filter);
        let processed = 0;
        let withFaces = 0;

        for (const photo of photos) {
            const count = await this.scanFaces(photo);
            processed++;
            if (count > 0) withFaces++;
        }

        return { processed, withFaces };
    }

    async reMatchFaces(){
        const photos = await galleryRepository.findAll({ 'faces.0': { $exists: true } });
        const persons = await personRepository.findAll({}, { select: '_id name photos' });
        let updated = 0;

        for (const photo of photos) {
            const matched = faceService.matchFaces(photo.faces || [], persons);
            const before = JSON.stringify((photo.faces || []).map(f => [String(f.personId || ''), f.name]));
            const after = JSON.stringify(matched.map(f => [String(f.personId || ''), f.name]));
            if (before !== after) {
                await galleryRepository.update(photo._id, { faces: matched });
                updated++;
            }
        }

        console.log('[GALLERY] Re-match done, updated:', updated);
        return { checked: photos.length, updated };
    }
}

export default new GalleryService();