var express = require('express');
var router = express.Router();
const passport = require('passport');
const jwt = require('../FunctionHelper/jwt');
const csrf = require('csurf');
const csurfProtection = csrf();
const checkAuth = require('../middleware/check-auth');

const adminRouter = require('./admin');
const editorRouter = require('./editor');
const writerRouter = require('./writer');
const profileRouter = require('./profile');

const User = require('../models/user');

// Thêm middle ware chống tấn công CSRF
router.use(csurfProtection);

// Xử lí xác thực tài khoảng
router.get('/confirm/:token', (req, res, next) => {
    const token = req.params.token;
    try {
        const decode = jwt.decodeJWT(token, 'fit-hcmus');

        User.update({_id: decode.id}, {isConfirm: true})
            .then(result => {
                const token = jwt.generateJWT(decode, 'fit-hcmus', '1h');
            
                res.cookie('Authorization', 'Bearer ' + token, {httpOnly: true});
                res.redirect('/');
            })
            .catch();
    } catch(err) {
        req.flash('error', err.message);
        res.redirect('/user/register');
    }
});

/* GET users listing. */
router.use('/profile', checkAuth, profileRouter);
router.use('/admin', checkAuth, adminRouter);
router.use('/editor', checkAuth, editorRouter);
router.use('/writer', checkAuth, writerRouter);

// Xử lí đăng xuất
router.get('/logout', isLoggedIn, (req, res, next) => {
    res.cookie('Authorization', '');
    res.redirect('/user/login');
});

// Lấy view đăng nhập
router.get('/login', notLoggedIn, (req, res, next) => {
    const messages = req.flash('error');
    res.render('user/login', {csrfToken: req.csrfToken(), messages: messages, hasError: messages.length > 0});
});

// Xử lí đăng nhập
router.post('/login', notLoggedIn, passport.authenticate('local.login', {
    session: false,
    failureRedirect: '/user/login',
    failureFlash: true
}), (req, res, next) => {
    const token = jwt.generateJWT(req.user, 'fit-hcmus', '1h');

    res.cookie('Authorization', 'Bearer ' + token, {httpOnly: true});

    if (req.user.role === 'guest') {
        res.redirect('/');
    } else {
        res.redirect(`/user/${req.user.role}`);
    }

    
});

// Lấy view đăng ký
router.get('/register',notLoggedIn, (req, res, next) => {
    const messages = req.flash('error');
    const success = req.flash('success');
    res.render('user/registration', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasError: messages.length > 0,
        success: success,
        isSuccess: success.length > 0
    });
});

// Xử lí đăng ký
router.post('/register', notLoggedIn, passport.authenticate('local.signup', {
    session: false,
    failureRedirect: '/user/register',
    failureFlash: true
}),  (req, res, next) => {
    req.flash('success', 'Đăng ký thành công. Mời bạn kiểm tra email để xác thực tài khoản');
    res.redirect('/user/register');
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