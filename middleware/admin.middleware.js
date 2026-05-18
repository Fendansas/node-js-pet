export function isAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).send('Access denied');
    }
    next();
}