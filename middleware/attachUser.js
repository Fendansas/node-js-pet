import User from "../models/user.js";

export const attachUser = async (req, res, next) => {
    if (!req.user?.id){
        res.locals.user = null;
        return next();
    }

    try {
        const user = await User.findById(req.user.id).populate('role');
        res.locals.user = user;
        next();

    } catch (error) {
        next();
    }
}