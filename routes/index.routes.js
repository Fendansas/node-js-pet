import express from 'express';

import IndexController from '../controllers/index.controller.js';

const router = express.Router();
router.get('/', (req, res) => IndexController.getHomePage(req, res));

export default router;