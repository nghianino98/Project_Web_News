const express = require('express');
const router = express.Router();
const multer = require('../../config/multer');
const jwt = require('../../FunctionHelper/jwt');
const User = require('../../models/user');
const filebase = require('../../FunctionHelper/firebase');
const bcrypt = require('bcrypt');
const topt = require('../../FunctionHelper/totp');

// Load avatar của user
router.use((req, res, next) => {
    res.locals.avatar = req.user.avatar;
    res.locals.userName = req.user.userName;
    next();
});

// GET /user/profile
router.get('/', (req, res, next) => {
    const date = new Date(req.user.dob);
    const user = {
        email: req.user.email,
        role: req.user.role,
        phoneNumber: req.user.phoneNumber,
        date: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        pseudonym: req.user.pseudonym,
        expire: new Date(req.user.expire).toString()
    }

    var titleForm = 'Thông tin người dùng';

    if (user.role === 'admin') {
        titleForm = 'Thông tin quản trị viên';
    } else if (user.role === 'editor') {
        titleForm = 'Thông tin biên tập viên';
    } else if (user.role === 'writer') {
        titleForm = 'Thông tin phóng viên';
    }

    const messages = req.flash('error');

    res.render('user/profile', {
        layout: `${req.user.role}-layout`, 
        user: user, 
        isWriter: user.role === 'writer',
        titleForm: titleForm,
        csrfToken: req.csrfToken(),
        messages: messages,
        hasError: messages.length > 0
    });
});

// POST /user/profile
router.post('/', (req, res, next) => {
    var propertiesUpdate = {
        userName: req.body.userName,
        dob: new Date(+req.body.year, +req.body.month - 1, +req.body.date),
        phoneNumber: req.body.phoneNumber
    };

    if (req.body.pseudonym) {
        propertiesUpdate.pseudonym = req.body.pseudonym;
    }

    User.update({_id: req.user.id}, propertiesUpdate)
        .then((result) => {
            req.user.userName = propertiesUpdate.userName;
            req.user.dob = propertiesUpdate.dob;
            req.user.phoneNumber = propertiesUpdate.phoneNumber;
            req.user.pseudonym = propertiesUpdate.pseudonym;
            const token = jwt.generateJWT(req.user, 'fit-hcmus', '1h');
            res.cookie('Authorization', 'Bearer ' + token, {httpOnly: true});
            res.redirect('/user/profile');
        }).catch(err => {
            req.flash('error', 'Cập nhật thông tin thất bại, thử lại sau.');
            res.redirect('/user/profile');
        });
});

// POST /user/profile/avatar
router.post('/avatar', multer.single('file'), (req, res, next) => {
    filebase.uploadImageToStorage(req.file)
        .then(result => {
            User.update({_id: req.user.id}, {avatar: result})
                .then(success => {
                    req.user.avatar = result;
                    const token = jwt.generateJWT(req.user, 'fit-hcmus', '1h');
                    res.cookie('Authorization', 'Bearer ' + token, {httpOnly: true});
                    res.status(200).json({avatar: result});
                }).catch(err => {
                    res.status(500).json({message: 'Cập nhật ảnh đại diện thất bại. Lỗi không xác định được ở server'});
                });
        }).catch(err => {
            res.status(500).json({message: 'Cập nhật ảnh đại diện thất bại. Lỗi không xác định được ở server'});
        });
});

// GET /user/profile/change-password
router.get('/change-password', (req, res, next) => {
    const messages = req.flash('error');
    res.render('user/change-password', {
        csrfToken: req.csrfToken(),
        messages: messages, 
        hasError: messages.length > 0,
        layout: `${req.user.role}-layout`
    });
});

// POST /user/profile/change-password
router.post('/change-password', (req, res, next) => {
    User.findById({_id: req.user.id})
        .then(user => {
            bcrypt.compare(req.body.oldPassword, user.password, (err, result) => {
                if (err) {
                    console.log(err);
                    req.flash('error', 'Đổi mật khẩu thất bại, thử lại sau');
                    return res.redirect('/user/profile/change-password');
                } 

                if (!result) {
                    req.flash('error', 'Mật khẩu không đúng');
                    return res.redirect('/user/profile/change-password');
                }

                bcrypt.hash(req.body.newPassword, 5, (err, hash) => {
                    if (err) {
                        console.log(err);
                        req.flash('error', 'Đổi mật khẩu thất bại, thử lại sau');
                        return res.redirect('/user/profile/change-password');
                    }

                    User.update({_id: user.id}, {password: hash})
                        .then(result => {
                            res.redirect('/user/profile');
                        })
                        .catch(err => {
                            req.flash('error', 'Đổi mật khẩu thất bại, thử lại sau');
                            res.redirect('/user/profile/change-password');
                        });
                    });
            });
        }).catch(err => {
            req.flash('error', 'Đổi mật khẩu thất bại, thử lại sau');
            res.redirect('/user/profile/change-password');
        });
});

// GET /user/profile/change-email
router.get('/change-email', (req, res, next) => {
    const messages = req.flash('error');
    const verifyObject = topt.getVerifyObject();
    req.session.fpw= true;

    topt.sendOTPViaMail(req.user.email, 5, verifyObject.token, 'Đổi email')
        .then(() => {
            res.render('user/change-email', {
                layout: `${req.user.role}-layout`,
                secret: verifyObject.secret,
                csrfToken: req.csrfToken(),
                messages: messages, 
                hasError: messages.length > 0
            });
        }).catch(err => {
            req.flash('error', 'Có lỗi xãy ra, vui lòng thử lại sau.');
            res.redirect('/user/profile');
        });
});

// POST /user/profile/change-email
router.post('/change-email', (req, res, next) => {
    if (!req.session.fpw) {
        return res.render('user/change-email', {
            layout: `${req.user.role}-layout`,
            secret: req.body.secret,
            csrfToken: req.body._csrf,
            messages: ['Mã OTP không chính xác'],
            hasError: true
        });
    }

    const result = topt.verify(req.body.token, req.body.secret, 5);

    if (!result) {
        return res.render('user/change-email', {
            layout: `${req.user.role}-layout`,
            secret: req.body.secret,
            csrfToken: req.body._csrf,
            messages: ['Mã OTP không chính xác'],
            hasError: true
        });
    }

    User.update({_id: req.user.id}, {email: req.body.newEmail})
        .then(result => {
            req.session.fpw = null;
            req.user.email = req.body.newEmail;
            const token = jwt.generateJWT(req.user, 'fit-hcmus', '1h');
            res.cookie('Authorization', 'Bearer ' + token, {httpOnly: true});
            res.redirect('/user/profile');
        }).catch(err => {
            req.flash('error', 'Đổi email thất bại, vui lòng thử lại sau.');
            req.session.fpw = null;
            res.redirect('/user/profile');
        })
});

module.exports = router;