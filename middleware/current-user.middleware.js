import User from '../models/user.js';

export const currentUser = async (req, res, next) => {

    try {

        if (!req.user?.id) {

            req.currentUser = null;

            res.locals.currentUser = null;

            return next();
        }

        const user = await User.findById(req.user.id)
            .populate({
                path: 'role',
                populate: {
                    path: 'permissions'
                }
            });

        if (!user) {

            req.currentUser = null;

            res.locals.currentUser = null;

            return next();
        }

        req.currentUser = user;

        res.locals.currentUser = user;

        next();

    } catch (err) {

        console.log(err);

        next();
    }
};