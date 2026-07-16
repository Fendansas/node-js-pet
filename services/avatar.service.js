import avatarRepository from '../repositories/avatar.repository.js';
import userRepository from '../repositories/user.repository.js';

export const initAvatarService = async () => {
    await avatarRepository.init();
}

export const uploadAvatarService = async (userId, fileBuffer, filename, mimetype) => {
    try {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.avatarId) {
            await deleteAvatarService(user.avatarId);
        }

        const uploadedFile = await avatarRepository.upload(filename, fileBuffer, {
            userId: userId,
            mimetype: mimetype,
            originalName: filename
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

export const getAvatarService = async (avatarId) => {
    try {
        return await avatarRepository.getDownloadStream(avatarId);
    } catch (error) {
        console.error('Error getting avatar:', error);
        throw error;
    }
}

export const deleteAvatarService = async (avatarID) => {
    try {
        await avatarRepository.delete(avatarID);
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
    const user = await userRepository.findById(userId);
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
