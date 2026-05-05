import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

router.get('/test', (req, res) => {
    res.send('OK');
});

export default router;