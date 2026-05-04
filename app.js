global.crypto = require('crypto');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const app = express();

const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
        .then(()=> console.log('Connected to MongoDB'))
        .catch((err)=> console.log(err));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}));

app.use((req, res, next)=>{
    res.locals.user = req.session.userId;
    next();
})

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res)=>{
    try {
        const {username, password} = req.body;
        const existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(409).send('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            password: hashedPassword
        });
        await user.save();

        res.redirect('/');


    } catch (err) {
        console.log(err);
        res.send('Ошибка регистрации');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res)=>{
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if (!user){
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

    } catch (err) {
        console.log(err);
        res.send('Ошибка входа');
    }

});

app.get('/logout', (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/');
    });

});

app.listen(3000, () => {
    console.log('http://localhost:3000');
});

