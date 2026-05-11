import User from "../models/user.js";
import {validationResult} from "express-validator";
import {register} from "./auth.controller.js";
import {updateUserProfileService} from "../services/user.service.js";


export const getProfile = async (req, res) => {
    const user = await User.findById(res.locals.user._id).populate('role');
    res.render('profile', {
        user
    });
};
export const editProfile = async (req, res)=>{
    const user = await User.findById(res.locals.user._id).populate('role');

    res.render('edit-profile', {
        user
    });
}
export const updateProfile = async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const user = await User.findById(res.locals.user._id).populate('role');

        return res.status(400).render('edit-profile',{
            user,
            errors: errors.array()
        })
    }

    try {
        const updatedUser = await updateUserProfileService(
            res.locals.user._id,
            req.body
        );
        res.render('edit-profile', {
            user: updatedUser,
            success: 'Profile updated successfully',
            errors: []
        });
    } catch (error){
        console.log(errors);
        res.status(500).render('edit-profile',{
            user: req.body,
            errors:[{msg: 'Something went wrong'}]
        })
    }
}


export const getAllUsers = async (req, res) => {

    const users = await User.find().populate('role');

    res.render('admin/users', {
        users
    });
};