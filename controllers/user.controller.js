import { BaseController } from './base.controller.js';
import { validationResult } from 'express-validator';
import path from 'path';
import UserService from '../services/user.service.js';
import {
    uploadAvatarService,
    deleteAvatarService,
    clearUserAvatarFields,
    getAvatarUrl,
    getAvatarService
} from '../services/avatar.service.js';


export class UserController extends BaseController {

    async getProfile(req, res) {
        console.log('[USER] Loading profile for:', req.user?._id);

        try {
            const user = await UserService.getProfile(req.user?._id);
            return this.renderView(res, 'profile', { user });

        } catch (error) {
            console.error('[USER] Profile error:', error);

            if (error.code === 'USER_NOT_FOUND') {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            return this.handleError(res, error, 'Profile error');
        }
    }

    async editProfile(req, res) {
        console.log('[USER] Loading edit profile page');

        try {
            const user = await UserService.getEditProfile(req.user._id);
            console.log('[USER] Edit profile page loaded');

            return this.renderView(res, 'edit-profile', { user });

        } catch (error) {
            console.error('[USER] Edit profile page error:', error);

            if (error.code === 'USER_NOT_FOUND') {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            return this.handleError(res, error, 'Edit profile error');
        }
    }

    async updateProfile(req, res) {
        console.log('[USER] Updating profile');

        try {
            const updatedUser = await UserService.updateProfile(
                req.user._id,
                req.body
            );

            console.log('[USER] Profile updated successfully');

            return this.renderView(res, 'edit-profile', {
                user: updatedUser,
                success: 'Profile updated successfully',
                errors: []
            });

        } catch (error) {
            console.error('[USER] Update profile error:', error);

            if (error.code === 'EMAIL_ALREADY_EXISTS') {
                return res.status(409).json({ success: false, message: 'Email already exists' });
            }

            if (error.code === 'USER_NOT_FOUND') {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            return this.handleError(res, error, 'Update profile error');
        }
    }

    async getAllUsers(req, res) {
        console.log('[USER] Loading all users (admin)');

        try {
            const search = req.query.search || '';
            const { users, onlineUsers } = await UserService.getAll(search);

            console.log('[USER] Found', users.length, 'users,', onlineUsers, 'online');

            return this.renderView(res, 'admin/users', { users, onlineUsers, search });

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
            await clearUserAvatarFields(req.user._id);

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