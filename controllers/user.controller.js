import User from "../models/user.js";
import {validationResult} from "express-validator";
import {register} from "./auth.controller.js";
import {
    updateUserProfileService,
    getProfileService,
    getAllUsersService,
    editProfileService
} from "../services/user.service.js";


export const getProfile = async (req, res) => {
    const user = await getProfileService(res.locals.user._id);
    res.render('profile', {
        user
    });
};
export const editProfile = async (req, res)=>{
    const user = await editProfileService(res.locals.user._id);

    res.render('edit-profile', {
        user
    });
}
export const updateProfile = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        const user = await User.findById(res.locals.user._id).populate('role');

        return res.status(400).render('edit-profile', {
            user,
            errors: errors.array()
        });
    }

    try {

        const updatedUser = await updateUserProfileService(
            res.locals.user._id,
            req.body
        );

        return res.render('edit-profile', {
            user: updatedUser,
            success: 'Profile updated successfully',
            errors: []
        });

    } catch (error) {

        console.log(error);

        const user = await User.findById(res.locals.user._id).populate('role');

        return res.status(500).render('edit-profile', {
            user,
            errors: [{ msg: 'Something went wrong' }]
        });
    }
}


export const getAllUsers = async (req, res) => {
    const {users, onlineUsers } = await getAllUsersService();

    res.render('admin/users', {
        users, onlineUsers
    });
};