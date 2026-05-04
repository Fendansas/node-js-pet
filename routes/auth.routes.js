const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res)=>{
    try{
        const {username, password} = req.body;

        const exists = await User.findOne({username});
        if (exists) {
            return res.status(409).send('User already exists');
        }

        const hashed = await bcrypt.hash(password, 10);

        await User.create({
            username,
            password: hashed
        });
        res.redirect('/login');

    } catch (err){
        console.log(err);
        res.send('Register error');
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res)=>{
    try{

        const {username, password} = req.body;

        const user = await User.findOne({username});
        if (!user) {
            return res.status(401).send('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid password');
        }

        req.session.user = {
            id: user._id,
            username: user.username
        }

        res.redirect('/');


    } catch (err){
        console.log(err);
        res.send('Login error');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;