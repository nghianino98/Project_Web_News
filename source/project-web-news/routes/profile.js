const express = require('express');
const router = express.Router();
const multer = require('../config/multer');
const jwt = require('../FunctionHelper/jwt');
const User = require('../models/user');
const filebase = require('../FunctionHelper/firebase');
const bcrypt = require('bcrypt');

// Load avatar của user
router.use((req, res, next) => {
    res.locals.avatar = req.user.avatar;
    res.locals.userName = req.user.userName;
    next();
});

router.get('/', (req, res, next) => {
    const date = new Date(req.user.dob);
    const user = {
        email: req.user.email,
        role: req.user.role,
        phoneNumber: req.user.phoneNumber,
        date: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        pseudonym: req.user.pseudonym
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
                    throw err;
                });
        }).catch(err => {
            res.status(500).json({message: 'Cập nhật ảnh đại diện thất bại. Lỗi không xác định được ở server'});
        });
});

router.get('/change-password', (req, res, next) => {
    const messages = req.flash('error');
    res.render('user/change-password', {
        csrfToken: req.csrfToken(),
        messages: messages, 
        hasError: messages.length > 0,
        layout: `${req.user.role}-layout`
    });
});

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

module.exports = router;