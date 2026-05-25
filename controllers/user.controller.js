import { BaseController } from './base.controller.js';
import { validationResult } from 'express-validator';
import User from '../models/user.js';
import path from 'path';
import {
    updateUserProfileService,
    getProfileService,
    getAllUsersService,
    editProfileService
} from '../services/user.service.js';
import {
    uploadAvatarService,
    deleteAvatarService,
    getAvatarUrl,
    getAvatarService
} from '../services/avatar.service.js';
import fs from 'fs';


export class UserController extends BaseController {

    async getProfile(req, res) {
        console.log('[USER] Loading profile for:', this.getCurrentUser(req, res)?._id);

        try {
            const user = await getProfileService(this.getCurrentUser(req, res)?._id);
            console.log('[USER] Profile loaded successfully');

            return this.renderView(res, 'profile', { user });

        } catch (error) {
            return this.handleError(res, error, 'Profile error');
        }
    }

    async editProfile(req, res) {
        console.log('[USER] Loading edit profile page');

        try {
            const user = await editProfileService(this.getCurrentUser(req, res)?._id);
            console.log('[USER] Edit profile page loaded');

            return this.renderView(res, 'edit-profile', { user });

        } catch (error) {
            return this.handleError(res, error, 'Edit profile error');
        }
    }

    async updateProfile(req, res) {
        console.log('[USER] Updating profile');

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log('[USER] Validation errors:', errors.array());

            const user = await User.findById(this.getCurrentUser(req, res)?._id).populate('role');
            return this.sendValidationError(res, errors, 'edit-profile', { user });
        }

        try {
            const updatedUser = await updateUserProfileService(
                this.getCurrentUser(req, res)?._id,
                req.body
            );

            console.log('[USER] Profile updated successfully');

            return this.renderView(res, 'edit-profile', {
                user: updatedUser,
                success: 'Profile updated successfully',
                errors: []
            });

        } catch (error) {
            console.log('[USER] Update profile error:', error.message);

            const user = await User.findById(this.getCurrentUser(req, res)?._id).populate('role');

            return this.renderView(res, 'edit-profile', {
                user,
                errors: [{ msg: 'Something went wrong' }]
            });
        }
    }

    async getAllUsers(req, res) {
        console.log('[USER] Loading all users (admin)');

        try {
            const { users, onlineUsers } = await getAllUsersService();

            console.log('[USER] Found', users.length, 'users,', onlineUsers.length, 'online');

            return this.renderView(res, 'admin/users', { users, onlineUsers });

        } catch (error) {
            return this.handleError(res, error, 'Users list error');
        }
    }


    async uploadAvatar(req, res){
        try {
            if (!req.user || !req.user._id) {
                return res.status(401).json({
                    success: false,
                    message: 'Требуется авторизация'
                });
            }

            if(!req.file){
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }

            if (req.file.error){
                return res.status(400).json({
                    success: false,
                    message: req.file.error
                });
            }

            const result = await uploadAvatarService(
                req.user._id,
                req.file.buffer,
                req.file.originalname,
                req.file.mimetype
            );

            console.log('[USER] Avatar uploaded:', result.url);
            if(req.accepts('html')){
                return res.status(200).redirect('/profile');
            }

            return res.status(200).json({
                success: true,
                message: 'Avatar uploaded successfully',
                url: result.url
            });

        } catch (error) {
            console.error('[USER] Upload avatar error:', error);
            return this.handleError(res, error, 'Avatar upload error');
        }
    }

    async deleteAvatar(req, res) {
        try {
            if (!req.user.avatarId) {
                return res.status(400).json({
                    success: false,
                    message: 'Аватар не установлен'
                });
            }

            await deleteAvatarService(req.user.avatarId);

            req.user.avatarId = null;
            req.user.avatarMimeType = null;
            req.user.avatarUpdatedAt = null;
            await req.user.save();

            console.log('[USER] Avatar deleted');

            if (req.accepts('html')) {
                return res.status(200).redirect('/profile');
            }


            return res.json({
                success: true,
                message: 'Аватар успешно удалён'
            });

        } catch (error) {
            console.error('[USER] Delete avatar error:', error);
            return this.handleError(res, error, 'Ошибка удаления аватара');
        }
    }

    async getAvatar(req, res, next) {
        try {
            const stream = await getAvatarService(req.params.id);


            stream.on('error', () => {
                return res.sendFile(path.join(process.cwd(), 'public/img/default-avatar.png'));
            });


            stream.on('metadata', (metadata) => {
                res.setHeader('Content-Type', metadata.mimetype || 'image/jpeg');
            });


            stream.pipe(res);

        } catch (error) {
            console.error('[AVATAR] Get error:', error);
            return res.sendFile(path.join(process.cwd(), 'public/img/default-avatar.png'));
        }
    }
}

export default new UserController();