import { BaseController } from './base.controller.js';
import { validationResult } from 'express-validator';
import User from '../models/user.js';
import {
    updateUserProfileService,
    getProfileService,
    getAllUsersService,
    editProfileService
} from '../services/user.service.js';


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
}

export default new UserController();