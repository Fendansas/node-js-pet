export const validateRegister = (req, res, next) => {
    const {username, password} = req.body;

    if (!username || username.length < 3) {
        return res.status(400).send('Invalid username');
    }

    if (!password || password.length < 6) {
        return res.status(400).send('Password too short');
    }
    next();
}

export const validateLogin = (req, res, next) =>{
    const {username, password} = req.body;

    if (!username || !password){
        return res.status(400).send('Missing credentials');
    }
    next();
}