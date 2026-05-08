import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import crypto from 'crypto';

import connectDB from './config/db.js';

import indexRoutes from './routes/index.routes.js';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { currentUser } from './middleware/current-user.middleware.js';
import {attachUser} from "./middleware/attachUser.js";
import mainRoute from "./routes/index.js";


export const app = express();

// DB
connectDB();

// View engine
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}));

// Global user
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

app.use(currentUser);
app.use(attachUser);
app.use(mainRoute);

// Start
app.listen(3000, () => {
    console.log('http://localhost:3000');
});