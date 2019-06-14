const express = require('express');
const router = express.Router();
const filebase = require('../../FunctionHelper/firebase');
const bcrypt = require('bcrypt');
const multer = require('../../config/multer');
const Role = require('../../FunctionHelper/user-role');

const User = require('../../models/user');
const categoryMain = require('../../models/categoryMain');
const categorySub = require('../../models/categorySub');

// GET /user/admin/manager-user
router.get('/', (req, res, next) => {
    const errors = req.flash('error');
    const success = req.flash('success');
    User.findAllExceptId(req.user.id).then(succ => {
            res.render('admin/adminusers', {
                isModify: false,
                userList: succ,
                layout: 'admin-layout',
                title: 'Admin | Quản lí người dùng',
                errors: errors,
                hasError: errors.length > 0,
                success: success,
                hasSuccess: success.length > 0
            });
        })
        .catch(err => {
            next(err);
        });
});

// GET /user/admin/manager/profile/:id
router.get('/profile/:id', (req, res, next) => {
    const id = req.params.id;
    const messages = req.flash('error');

    User.findById(id)
        .then(user => {
            const date = new Date(user.dob);
            user.date = date.getDate();
            user.month = date.getMonth() + 1;
            user.year = date.getFullYear();
            var role = new Role();
            role.enableRole(user.role);
            res.render('admin/user-profile', {
                layout: 'admin-layout',
                csrfToken: req.csrfToken(),
                user: user,
                titleForm: 'Thông tin người dùng',
                messages: messages,
                hasError: messages.length > 0,
                isWriter: user.role === 'writer',
                isEditor: user.role === 'editor',
                roles: role.generateArray()
            });
        }).catch(err => {
            err.status = 404;
            err.message = 'Không tìm thấy người dùng';
            next(err);
        })
});

// POST /user/admin/manager-admin/profile
router.post('/profile', (req, res, next) => {
    
});

// POST /user/admin/manager-admin/profile/avatar
router.post('/profile/avatar', multer.single('file'), (req, res, next) => {
    filebase.uploadImageToStorage(req.file)
        .then(result => {
            User.update({_id: req.body.id}, {avatar: result})
                .then(success => {
                    res.status(200).json({avatar: result});
                }).catch(err => {
                    res.status(500).json({message: 'Cập nhật ảnh đại diện thất bại. Lỗi không xác định được ở server'});
                });
        }).catch(err => {
            res.status(500).json({message: 'Cập nhật ảnh đại diện thất bại. Lỗi không xác định được ở server'});
        });
});

module.exports = router;