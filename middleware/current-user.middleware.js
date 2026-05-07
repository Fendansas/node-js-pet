import User from '../models/user.js';

export const currentUser = async (req, res, next) => {

    try {

        if (!req.session?.user?.id) {
            return next();
        }

        const user = await User.findById(req.session.user.id)
            .populate({
                path: 'role',
                populate: {
                    path: 'permissions'
                }
            });

        if (!user) {
            req.session.destroy(() => {});
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