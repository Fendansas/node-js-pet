import { Router } from 'express';
import StudyController from '../controllers/study.controller.js';

const router = Router();

router.get('/', (req, res) => StudyController.index(req, res));
router.get('/theory', (req, res) => StudyController.theory(req, res));

export default router;
