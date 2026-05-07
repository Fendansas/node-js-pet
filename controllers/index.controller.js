import user from "../models/user.js";

export const getHomePage = (req, res) =>{
    res.render('index', {
        user: req.session.user || null
    });
};