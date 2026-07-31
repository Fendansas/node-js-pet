import express from 'express';
import rateLimit from "express-rate-limit";
import AuthController from '../controllers/auth.controller.js';
import { isAuth } from '../middleware/auth.middleware.js';
import {apiKeyAuth} from "../middleware/api-auth.middleware.js";
import {validateRegister} from "../validators/auth.validator.js";
import {validate} from "../middleware/validation.middleware.js";

const router = express.Router();

const registerLimiter = rateLimit({
    windowMs: 60*60*1000,
    max: 3,
    message:{success:false, message:'Too many registrations, try again later'}
});

router.use(apiKeyAuth);

router.post('/login', (req, res) => AuthController.apiLogin(req, res));
router.post('/register', registerLimiter, validateRegister, validate, (req, res)=>
    AuthController.apiRegister(req, res)
);

router.get('/sas', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Sas'
    });
});

export default router;