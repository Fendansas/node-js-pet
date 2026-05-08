import user from "../models/user.js";
import User from "../models/user.js";

export const getHomePage = async (req, res) =>{
    res.render('index', {
        user: res.locals.user || null
    });
};