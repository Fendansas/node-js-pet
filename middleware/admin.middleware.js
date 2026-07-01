export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role?.name !== 'admin') {
        return res.status(403).render('errors/403', { message: 'Доступ запрещён' });
    }
    next();
};