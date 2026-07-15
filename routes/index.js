import adminRoutes from './admin.routes.js';
import authRoutes from './auth.routes.js';
import profileRoutes from './profile.routes.js';
import indexRoutes from './index.routes.js';
import productRoutes from './product.routes.js';
import anomalyRoutes from './anomaly.routes.js';
import postRoutes from './post.routes.js';
import commentRoutes from './comment.routes.js';
import eventRoutes from './event.routes.js';
import taskRoutes from './task.routes.js';
import apiRoutes from './api.routes.js';
import overlayRoutes from './overlay.routes.js';
import studyRoutes from './study.routes.js';

import express from 'express';

const mainRoute = express.Router();

mainRoute.use('/', authRoutes);
mainRoute.use('/', indexRoutes);
mainRoute.use('/admin', adminRoutes);
mainRoute.use('/profile', profileRoutes);
mainRoute.use('/products', productRoutes);
mainRoute.use('/anomaly', anomalyRoutes);
mainRoute.use('/posts', postRoutes);
mainRoute.use('/posts', commentRoutes)
mainRoute.use('/events', eventRoutes);
mainRoute.use('/tasks', taskRoutes);
mainRoute.use('/api', apiRoutes);
mainRoute.use('/overlays', overlayRoutes);
mainRoute.use('/study', studyRoutes);

export default mainRoute;
