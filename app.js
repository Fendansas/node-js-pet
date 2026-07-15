import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import path from 'path';
import multer from 'multer';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

import connectDB from './config/db.js';

import mainRoute from './routes/index.js';

import { currentUser } from './middleware/current-user.middleware.js';
import { updateLastSeen } from './middleware/online.middleware.js';

export const app = express();

// ===== DB =====
connectDB();

// ===== VIEW ENGINE =====
app.set('view engine', 'ejs');

// ===== MIDDLEWARES =====
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== SECURITY =====
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
            imgSrc: ["'self'", "data:", "https://*.tile.openstreetmap.org"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", "https:", "data:"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'self'"],
            upgradeInsecureRequests: []
        }
    }
}));

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: 'Too many requests, please try again later' }
}));

// ===== SESSION =====
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: false
    }
}));


// ===== GLOBAL USER =====
app.use((req, res, next) => {

    res.locals.user = req.session.user;

    next();
});

// ===== FLASH MESSAGES =====
app.use((req, res, next) => {
    // Pass success message to all views
    res.locals.successMessage = req.session.successMessage || null;
    delete req.session.successMessage;

    // Pass validation errors to all views
    res.locals.validationErrors = req.session.validationErrors || null;
    delete req.session.validationErrors;

    // Pass validation data to all views
    res.locals.validationData = req.session.validationData || null;
    delete req.session.validationData;

    next();
});

// ===== CURRENT USER =====
app.use(currentUser);

// ===== ONLINE SYSTEM =====
app.use(updateLastSeen);

// ===== ROUTES =====
app.use(mainRoute);

// ===== AVATAR ROUTE =====
app.get('/api/avatars/:id', async (req, res) => {
    try {
        const { getAvatarService } = await import('./services/avatar.service.js');
        const stream = await getAvatarService(req.params.id);

        stream.on('error', () => {
            res.sendFile(path.join(process.cwd(), 'public/img/default-avatar.png'));
        });

        stream.on('metadata', (metadata) => {
            res.setHeader('Content-Type', metadata.mimetype || 'image/jpeg');
        });

        stream.pipe(res);

    } catch (error) {
        console.error('Avatar route error:', error);
        res.sendFile(path.join(process.cwd(), 'public/img/default-avatar.png'));
    }
});

// ===== ОБРАБОТКА ОШИБОК MULTER =====
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Файл слишком большой (макс 5MB)'
            });
        }
        return res.status(400).json({
            success: false,
            message: 'Ошибка загрузки файла: ' + error.message
        });
    }
    
    if (error.message) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    
    next(error);
});
// ===== START SERVER =====
app.listen(3001, () => {
    console.log('http://localhost:3001');
    console.log('Avatar service ready');
});
