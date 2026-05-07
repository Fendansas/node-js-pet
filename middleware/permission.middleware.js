import {hasPermission} from "../services/rbac.service.js";

export const allow = (permission) => {

    return async (req, res, next) => {

        if (!req.currentUser) {
            return res.status(401).send('Unauthorized');
        }

        // Временно разрешаем доступ админам ко всем admin роутам
        if (req.currentUser.role?.name === 'admin') {
            return next();
        }

        const permissions =
            req.currentUser.role?.permissions || [];

        const hasPermission = permissions.some(
            p => p.name === permission
        );

        if (!hasPermission) {
            return res.status(403).send('Forbidden');
        }

        next();
    };
};