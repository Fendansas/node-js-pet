export const getProfile = (req, res) => {
    res.render('profile', {
        user: res.locals.user
    });
};