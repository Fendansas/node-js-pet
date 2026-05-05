import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import {validateLogin, validateRegister} from "../validators/auth.validator.js";

const router = express.Router();

router.get('/login', (req, res) => res.render('login'));
router.post('/login', validateLogin, login);

router.get('/register', (req, res) => res.render('register'));
router.post('/register', validateRegister, register);

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

export default router;