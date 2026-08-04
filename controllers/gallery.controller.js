import {BaseController} from "./base.controller.js";
import GalleryService from "../services/gallery.service.js";


class GalleryController extends BaseController {
    async index(req,res){
        console.log('[GALLERY] Listing photos');

        try {
            const photos = await GalleryService.getApproved();

            let myPhotos = [];
            if(req.user){
                myPhotos = await GalleryService.getUserPhotos(req.user._id)
            }
            return this.renderView(res, 'gallery/index', {photos, myPhotos})
        } catch (error){

            console.error('[GALLERY] Index error:', error)
            return this.handleError(res, error, 'Gallery list error');

        }
    }

    async upload (req, res){
        console.log('[GALLERY] Uploading photo');

        try {
            if (!req.file){
                return res.status(400).json({success: false, message: 'Фаил не загружен'})
            }

            const isAdmin = req.user?.role?.name === 'admin';
            const imageUrl = '/uploads/gallery/' + req.file.filename;
            const data = {
                imageUrl,
                title: req.body.title || '',
                author: req.user._id
            }
            const photo = await GalleryService.create(data, isAdmin);

            GalleryService.scanFaces(photo).catch(error => {
                console.error('[GALLERY] Background face scan error:', error.message);
            });

            console.log('[GALLERY] Photo created:', photo._id, 'status:', photo.status);

            const message = isAdmin
                ? 'Фото опубликованно'
                : 'Фото отправленно на модерацию';

            return this.successRedirect(req, res, '/gallery', message);

        }catch (error){
            console.error('[GALLERY] Upload error:', error)
            return this.handleError(res, error, 'Upload photo error');
        }
    }

    async delete(req, res){
        console.log('[GALLERY] Deleting photo:', req.params.id);

        try {
            const photo = await GalleryService.getById(req.params.id);

            if(!photo){
                return res.status(404).json({success: false, message: 'Фото не найдено'})
            }

            const isAdmin = req.user?.role?.name === 'admin';
            const isOwner = photo.author._id.toString() === req.user._id.toString();

            if(!isAdmin && !isOwner){
                return res.status(403).json({success: false, message: 'Forbidden'})
            }

            await GalleryService.delete(req.params.id);

            return this.successRedirect(req, res, '/gallery', 'Фото удалено');

        }catch (error){
            console.error('[GALLERY] Delete error:', error)
            return this.handleError(res, error, 'Delete photo error');
        }
    }

    async moderation(req, res){
        console.log('[GALLERY] Showing moderation page');

        try {
            const photos = await GalleryService.getPending();
            return this.renderView(res, 'gallery/moderation', {photos})
        }catch (error){
            console.error('[GALLERY] Moderation error:', error)
            return this.handleError(res, error, 'Moderation page error');
        }
    }

    async approve(req, res){
        console.log('[GALLERY] Approving photo:', req.params.id);

        try {
            await GalleryService.approve(req.params.id, req.user._id);
            return this.successRedirect(req, res, '/gallery/moderation', 'Фото одобрено');
        }catch (error){
            console.error('[GALLERY] Approve error:', error)
            return this.handleError(res, error, 'Approve photo error');
        }
    }

    async reject(req, res){
        console.log('[GALLERY] Rejecting photo:', req.params.id);

        try {
            await GalleryService.reject(req.params.id, req.user._id);
            return this.successRedirect(req, res, '/gallery/moderation', 'Фото отклонено');
        }catch (error){
            console.error('[GALLERY] Reject error:', error)
            return this.handleError(res, error, 'Reject photo error');
        }
    }

}

export default new GalleryController();