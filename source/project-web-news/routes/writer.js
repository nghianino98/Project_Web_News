const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/check-role');

// Kiểm tra nếu là writer thì mới cho qua
router.use(checkRole.isWriter);

// Load avatar của user
router.get((req, res, next) => {
    res.locals.avatar = req.user.avatar;
    next();
});

router.get('/', (req, res, next) => {
    res.render('writer/writer', {layout: 'writer-layout', title: 'writer'});
});

router.get('/waiting', (req, res, next) => {
    res.render('writer/writer-waiting', {layout: 'writer-layout', title: 'writer'});
});

router.get('/published', (req, res, next) => {
    res.render('writer/writer-published', {layout: 'writer-layout', title: 'writer'});
});

router.get('/deny', (req, res, next) => {
    res.render('writer/writer-deny', {layout: 'writer-layout', title: 'writer'});
});

router.get('/not-confirm', (req, res, next) => {
    res.render('writer/writer-not-confirm', {layout: 'writer-layout', title: 'writer'});
});

module.exports = router;