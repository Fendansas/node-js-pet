export const getProfile = (req, res) => {
    res.render('profile', {
        user: req.session.user
    });
};