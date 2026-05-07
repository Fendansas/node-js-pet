import express from 'express';


import { getHomePage } from '../controllers/index.controller.js';

const router = express.Router();
router.get('/', getHomePage);

export default router;