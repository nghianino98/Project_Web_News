const express = require('express');
const router = express.Router();
const multer = require('../config/multer');
const jwt = require('../FunctionHelper/jwt');
const User = require('../models/user');
const filebase = require('../FunctionHelper/firebase');

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

    res.render('user/profile', {
        layout: 'admin-layout', 
        user: user, 
        isWriter: user.role === 'writer',
        titleForm: titleForm,
        csrfToken: req.csrfToken()
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

module.exports = router;