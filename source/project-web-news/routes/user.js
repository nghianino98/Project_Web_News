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

const User = require('../models/user');

// Thêm middle ware chống tấn công CSRF
router.use(csurfProrecttion);

// Xử lí xác thực tài khoảng
router.use('/confirm/:token', (req, res, next) => {
    const token = req.params.token;
    try {
        const decode = jwt.decode(token, 'fit-hcmus');

        User.update({_id: decode.id}, {$set: {isConfirm: true}})
            .exec()
            .then(result => {
                const token = jwt.sign({
                    email: decode.email,
                    id: decode.id,
                }, 'fit-hcmus', {
                    expiresIn: '1h'
                });
            
                res.cookie('Authorization', 'Bearer ' + token, {httpOnly: true});
                res.redirect('/user/admin');
            })
            .catch();
    } catch(err) {
        req.flash('error', err.message);
        res.redirect('/user/register');
    }
});

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
        role: req.user.role,
        avatar: req.user.avatar
    }, 'fit-hcmus', {
        expiresIn: '1h'
    });

    res.cookie('Authorization', 'Bearer ' + token, {httpOnly: true});
    res.redirect('/user/admin');
});

// Lấy view đăng ký
router.get('/register', (req, res, next) => {
    const messages = req.flash('error');
    res.render('user/registration', {csrfToken: req.csrfToken(), messages: messages, hasError: messages.length > 0});
});

// Xử lí đăng ký
router.post('/register', passport.authenticate('local.signup', {
    session: false,
    failureRedirect: '/user/register',
    failureFlash: true
}),  (req, res, next) => {
    req.flash('error', 'Đăng ký thành công. Mời bạn kiểm tra email để xác thực tài khoảng');
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