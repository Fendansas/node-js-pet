import adminRoutes from "./admin.routes.js";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import indexRoutes from "./index.routes.js";
import productRoutes from "./product.routes.js";
import express from "express";

const mainRoute = express.Router();

mainRoute.use('/', authRoutes);
mainRoute.use('/', indexRoutes);
mainRoute.use('/admin', adminRoutes);
mainRoute.use('/profile', profileRoutes);
mainRoute.use('/products', productRoutes);

export default mainRoute;
