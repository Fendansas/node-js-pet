import { verifyToken } from '../utils/jwt.js';

export const authUser = (req, res, next) => {

    const token = req.cookies?.token;

    if (!token) {

        req.user = null;

        return next();
    }

    const decoded = verifyToken(token);

    if (!decoded) {

        req.user = null;

        return next();
    }

    req.user = decoded;

    next();
};