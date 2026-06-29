import { hasPermission } from "../services/rbac.service.js";

export const allow = (permission) => {
    return async (req, res, next) => {
        const userId = req.user?._id || req.currentUser?._id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const hasAccess = await hasPermission(userId, permission);

        if (!hasAccess) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        next();
    };
};