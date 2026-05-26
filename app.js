import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import path from 'path';
import multer from 'multer';

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// ===== CURRENT USER =====
app.use(currentUser);

app.use(attachUser);

// ===== ONLINE SYSTEM =====
app.use(updateLastSeen);

// ===== ROUTES =====
app.use(mainRoute);
app.use(indexRoutes);
app.use(profileRoutes);
app.use(adminRoutes);

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
app.listen(3000, () => {
    console.log('http://localhost:3000');
    console.log('Avatar service ready');
});