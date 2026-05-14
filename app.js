import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import connectDB from './config/db.js';

import indexRoutes from './routes/index.routes.js';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import adminRoutes from './routes/admin.routes.js';
import mainRoute from './routes/index.js';

import { currentUser } from './middleware/current-user.middleware.js';
import { attachUser } from './middleware/attachUser.js';
import { updateLastSeen } from './middleware/online.middleware.js';

export const app = express();

// ===== DB =====
connectDB();

// ===== VIEW ENGINE =====
app.set('view engine', 'ejs');

// ===== MIDDLEWARES =====
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// ===== SESSION =====
app.use(session({
    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),

    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// ===== GLOBAL USER =====
app.use((req, res, next) => {

    res.locals.user = req.session.user;

    next();
});

// ===== CURRENT USER =====
app.use(currentUser);

app.use(attachUser);

// ===== ONLINE SYSTEM =====
app.use(updateLastSeen);

// ===== ROUTES =====
app.use(mainRoute);

app.use(indexRoutes);

app.use(authRoutes);

app.use(profileRoutes);

app.use(adminRoutes);

// ===== START SERVER =====
app.listen(3000, () => {
    console.log('http://localhost:3000');
});