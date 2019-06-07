const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/check-role');

const article = require('../models/article');

// Kiểm tra nếu là writer thì mới cho qua
router.use(checkRole.isWriter);

// Load avatar của user
router.use((req, res, next) => {
    res.locals.avatar = req.user.avatar;
    next();
});

router.get('/', (req, res, next) => {
    res.render('writer/writer', {layout: 'writer-layout', title: 'writer', csrfToken: req.csrfToken()});
});

router.post('/', (req, res, next) => {
    res.status(200).json({message: 'post thành công ko có lỗi gì cả'});
});

router.post('/',(req, res, next)=>{
    console.log(req.body);
    res.end('...');
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