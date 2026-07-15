import mongoose from 'mongoose';
import {GridFSBucket} from 'mongodb';
import User from '../models/User.js';

let bucket;

export const initAvatarService = async () => {
    if (!bucket) {
        const db = mongoose.connection.db;
        if (db) {
            bucket = new GridFSBucket(db, { bucketName: 'avatars' });
        } else {
            throw new Error('Database connection not established');
        }
    }
    return bucket;
}

export const uploadAvatarService = async (userId, fileBuffer, filename, mimetype) => {
    try {
        await initAvatarService();
        
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.avatarId) {
            await deleteAvatarService(user.avatarId);
        }

        const uploadStream = bucket.openUploadStream(`${Date.now()}-${filename}`, {
            metadata: {
                userId: userId,
                mimetype: mimetype,
                originalName: filename
            }
        });

        uploadStream.end(fileBuffer);

        const uploadedFile = await new Promise((resolve, reject) => {
            uploadStream.on('finish', () => {
                resolve({ _id: uploadStream.id });
            });
            uploadStream.on('error', reject);
        });

        user.avatarId = uploadedFile._id.toString();
        user.avatarMimeType = mimetype;
        user.avatarUpdatedAt = new Date();
        await user.save();

        return {
            success: true,
            avatar: uploadedFile._id,
            url: `/api/avatars/${uploadedFile._id}`
        };
        
    } catch (error) {
        console.error('Error uploading avatar:', error);
        throw error;
    }
}

export const getAvatarService = async (avatarId) =>{
    try {
        await initAvatarService();
        
        const fileId = new mongoose.Types.ObjectId(avatarId);
        const downloadStream = bucket.openDownloadStream(fileId);

        return downloadStream;
    } catch (error) {
        console.error('Error getting avatar:', error);
        throw error;
    }
}

export const deleteAvatarService = async (avatarID) =>{
    try {
        await initAvatarService();

        const fileId = new mongoose.Types.ObjectId(avatarID);
        await bucket.delete(fileId);
        return {
            success: true,
            message: 'Avatar deleted successfully'
        }
    } catch (error) {
        console.error('Error deleting avatar:', error);
        throw error;
    }
}

export const clearUserAvatarFields = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    user.avatarId = null;
    user.avatarMimeType = null;
    user.avatarUpdatedAt = null;
    await user.save();

    return { success: true };
}

export const getAvatarUrl = (userId, avatarId) => {
    if (!avatarId) {
        return '/img/default-avatar.png';
    }
    return `/api/avatars/${avatarId}`;
}

export default {
    uploadAvatarService,
    getAvatarService,
    deleteAvatarService,
    getAvatarUrl,
    initAvatarService
}