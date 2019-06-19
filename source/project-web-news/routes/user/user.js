var express = require('express');
var router = express.Router();
const passport = require('passport');
const jwt = require('../../FunctionHelper/jwt');
const csrf = require('csurf');
const csurfProtection = csrf();
const checkAuth = require('../../middleware/check-auth');
const topt = require('../../FunctionHelper/totp');
const bcrypt = require('bcrypt');

const adminRouter = require('../admin/admin');
const editorRouter = require('../editor');
const writerRouter = require('../writer');
const profileRouter = require('./profile');

const User = require('../../models/user');

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
    res.render('user/login', {
        layout: 'empty-layout',
        csrfToken: req.csrfToken(), 
        messages: messages, 
        hasError: messages.length > 0
    });
});

// Xử lí đăng nhập
router.post('/login', notLoggedIn, passport.authenticate('local.login', {
    session: false,
    failureRedirect: '/user/login',
    failureFlash: true
}), (req, res, next) => {
    const token = jwt.generateJWT(req.user, 'fit-hcmus', '1h');

    res.cookie('Authorization', 'Bearer ' + token, {httpOnly: true});

    if (req.user.role === 'subscriber') {
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
        layout: 'empty-layout',
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

// Xử lí quên mật khẩu
router.get('/forget-password', notLoggedIn, (req, res, next) => {
    const messages = req.flash('error');
    res.render('user/forget-pw-step1', {
        csrfToken: req.csrfToken(), 
        messages: messages, 
        hasError: messages.length > 0,
        layout: 'forget-layout'
    });
});

router.post('/forget-pw-step1', notLoggedIn, (req, res, next) => {
    User.findOneByAccount(req.body.account)
        .then(user => {
            if (!user) {
                req.flash('error', 'Tài khoảng không tồn tại');
                return res.redirect('/user/forget-pw-step1');
            }

            const verifyObject = topt.getVerifyObject();
            req.session.fpw= true;
            topt.sendOTPViaMail(user.email, 5, verifyObject.token, 'Quên mật khẩu')
                .then(() => {
                    res.render('user/forget-pw-step2', {
                        layout: 'forget-layout',
                        secret: verifyObject.secret,
                        csrfToken: req.csrfToken(),
                        account: req.body.account
                    });
                }).catch(err => {
                    req.flash('error', 'Có lỗi xãy ra, vui lòng thử lại.');
                    res.redirect('/user/forget-pw-step1');
                });

        }).catch(err => {
            req.flash('error', 'Có lỗi xãy ra, vui lòng thử lại.');
            res.redirect('/user/forget-pw-step1');
        });
});

router.post('/forget-pw-step2', notLoggedIn, (req, res, next) => {
    if (!req.session.fpw) {
        return res.render('user/forget-pw-step2', {
            layout: 'forget-layout',
            secret: req.body.secret,
            csrfToken: req.body._csrf,
            messages: ['Mã OTP không chính xác'],
            hasError: true
        });
    }

    const result = topt.verify(req.body.token, req.body.secret, 5);

    if (!result) {
        return res.render('user/forget-pw-step2', {
            layout: 'forget-layout',
            secret: req.body.secret,
            csrfToken: req.body._csrf,
            messages: ['Mã OTP không chính xác'],
            hasError: true,
            account: req.body.account
        });
    }

    bcrypt.hash(req.body.newPassword, 5, (err, hash) => {
        if (err) {
            req.flash('error', 'Đổi mật khẩu thất bại, vui lòng thử lại sau.');
            req.session.secret = null;
            return res.redirect('/user/login');
        }

        User.update({account: req.body.account}, {password: hash})
        .then(result => {
            req.session.fpw = null;
            res.redirect('/user/login');
        }).catch(err => {
            req.flash('error', 'Đổi mật khẩu thất bại, vui lòng thử lại sau.');
            req.session.fpw = null;
            res.redirect('/user/login');
        })
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (res.locals.isLoggedIn) {
        next();
    } else {
        res.redirect('/');
    }
}

function notLoggedIn(req, res, next) {
    if (!res.locals.isLoggedIn) {
        next();
    } else {
        res.redirect('/');
    }
}
