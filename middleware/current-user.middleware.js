import User from '../models/User.js';

export const currentUser = async (req, res, next) => {

    try {

        if (!req.session?.user?.id) {
            res.locals.user = null;
            req.user = null;
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
            res.locals.user = null;
            req.user = null;
            req.session.destroy(() => {});
            return next();
        }

        req.user = user;
        req.currentUser = user;

        res.locals.user = user;
        res.locals.currentUser = user;

        next();

    } catch (err) {

        console.error('[AUTH] Error loading user:', err.message);
        res.locals.user = null;
        req.user = null;
        next();
    }
};
