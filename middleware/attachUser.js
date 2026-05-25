import User from "../models/user.js";

export const attachUser = async (req, res, next) => {
    if (!req.session.user?.id){
        res.locals.user = null;
        req.user = null;
        return next();
    }

    try {
        const user = await User.findById(req.session.user.id).populate('role');
        res.locals.user = user;
        req.user = user;
        next();

    } catch (error) {
        res.locals.user = null;
        req.user = null;
        next();
    }
}