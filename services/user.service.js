import User from "../models/user.js";
import {editProfile} from "../controllers/user.controller.js";

export const updateUserProfileService = async (userId, data)=>{

    const user = await User.findByIdAndUpdate (
        userId,
        {
            username: data.username,
            email: data.email,
            bio: data.bio,
            avatar: data.avatar,
            rank: data.rank
        },
        {
            new:true,
            runValidators: true
        }
    ).populate('role');

    return user;

}

export const getProfileService = async (userId) => {
    const user = await User.findById(userId).populate('role');
    return user;
}

export const getAllUsersService = async () => {
    const users = await User.find().populate('role');
    const onlineUsers = users.filter(user => user.isOnline).length;
    return {users, onlineUsers} ;
}

export const editProfileService = async (userId) => {
    const user = await User.findById(userId).populate('role')
    return user;
}