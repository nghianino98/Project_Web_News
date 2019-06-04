var express = require('express');
var router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const csrf = require('csurf');
const csurfProrecttion = csrf();
const checkAuth = require('../middleware/check-auth');

const adminRouter = require('./admin');
const editorRouter = require('./editor');
const writerRouter = require('./writer');

// Thêm middle ware chống tấn công CSRF
router.use(csurfProrecttion);

/* GET users listing. */
router.use('/admin', checkAuth, adminRouter);
router.use('/editor', checkAuth, editorRouter);
router.use('/writer', checkAuth, writerRouter);

// Xử lí đăng xuất
router.get('/logout', isLoggedIn, (req, res, next) => {
    res.cookie('Authorization', '');
    res.redirect('/user/login');
});

// middle ware cho qua nếu chưa đăng nhập
router.use('/', notLoggedIn);

// Lấy view đăng nhập
router.get('/login', (req, res, next) => {
    const messages = req.flash('error');
    res.render('user/login', {csrfToken: req.csrfToken(), messages: messages, hasError: messages.length > 0});
});

// Xử lí đăng nhập
router.post('/login', passport.authenticate('local.login', {
    session: false,
    failureRedirect: '/user/login',
    failureFlash: true
}), (req, res, next) => {
    const token = jwt.sign({
        email: req.user.email,
        id: req.user.id,
    }, 'fit-hcmus', {
        expiresIn: '1h'
    });

    res.cookie('Authorization', 'Bearer ' + token, {httpOnly: true});
    res.redirect('/user/admin');
});

// Lấy view đăng ký
router.get('/register', (req, res, next) => {
    res.render('user/registration');
});

// Xử lí đăng ký
router.post('/register', passport.authenticate('local.signup', {
    session: false,
    failureRedirect: '/user/register',
    failureFlash: true
}),  (req, res, next) => {
    const token = jwt.sign({
        email: req.user.email,
        id: req.user.id,
    }, 'fit-hcmus', {
        expiresIn: '1h'
    });

    res.cookie('Authorization', 'Bearer ' + token, {httpOnly: true});
    res.redirect('/user/admin');
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isLoggedIn) {
        next();
    } else {
        res.redirect('/');
    }
}

function notLoggedIn(req, res, next) {
    if (!req.isLoggedIn) {
        next();
    } else {
        res.redirect('/');
    }
}