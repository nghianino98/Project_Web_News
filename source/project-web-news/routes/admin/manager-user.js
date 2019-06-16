const express = require('express');
const router = express.Router();
const filebase = require('../../FunctionHelper/firebase');
const bcrypt = require('bcrypt');
const multer = require('../../config/multer');
const Role = require('../../FunctionHelper/user-role');

const User = require('../../models/user');
const categoryMain = require('../../models/categoryMain');
const CategorySub = require('../../models/categorySub');

// GET /user/admin/manager-user
router.get('/', (req, res, next) => {
    const errors = req.flash('error');
    const success = req.flash('success');
    User.findAllExceptId(req.user.id).then(succ => {
            res.render('admin/adminusers', {
                userList: succ,
                layout: 'admin-layout',
                title: 'Admin | Quản lí người dùng',
                errors: errors,
                hasError: errors.length > 0,
                success: success,
                hasSuccess: success.length > 0,
                hasCustomCSS:true,
                partial: function(){return 'manager-user-css';},
                csrfToken: req.csrfToken()
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

    Promise.all([User.getUserAndCategoryEditorById(id), CategorySub.findAll()])
        .then(result => {
            const user = result[0];
            if (!user) {
                var err = new Error();
                err.status = 404;
                err.message = 'Không tìm thấy user';
                return next(err);
            }

            const temp = user.categoryEditor.map(element => element.id);
            const categories = result[1].filter(item => !temp.includes(item.id));
            const date = new Date(user.dob);
            user.date = date.getDate();
            user.month = date.getMonth() + 1;
            user.year = date.getFullYear();
            user.expire = new Date(user.expire).toString();
            var role = new Role();
            role.enableRole(user.role);
            res.render('admin/user-profile', {
                layout: 'admin-layout',
                csrfToken: req.csrfToken(),
                user: user,
                categories: categories,
                titleForm: 'Thông tin người dùng',
                messages: messages,
                hasError: messages.length > 0,
                isWriter: user.role === 'writer',
                isEditor: user.role === 'editor',
                roles: role.generateArray(),
                hasCustomCSS: true,
                partial: function() {return 'manager-user-css';}
                
            });
        }).catch(err => {
            next(err);
        });
});

// POST /user/admin/manager-admin/profile
router.post('/profile', (req, res, next) => {
    var propertiesUpdate = {
        userName: req.body.userName,
        dob: new Date(+req.body.year, +req.body.month - 1, +req.body.date),
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        role: req.body.role,
    };
   

    if (req.body.pseudonym) {
        propertiesUpdate.pseudonym = req.body.pseudonym;
    }

    if (req.body.categoryEditor) {
        propertiesUpdate.categoryEditor = req.body.categoryEditor;
    };

    User.update({_id: req.body.id}, propertiesUpdate)
        .then(result => {
            res.redirect(`/user/admin/manager-user/profile/${req.body.id}`);
        }).catch(err => {
            req.flash('error', 'Cập nhật thông tin thất bại, thử lại sau.');
            res.redirect(`/user/admin/manager-user/profile/${req.body.id}`);
        });
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

// POST /user/admin/manager-user/profile/change-password
router.post('/profile/change-password', (req, res, next) => {
    bcrypt.hash(req.body.newPassword, 5, (err, hash) => {
        if (err) {
            return res.status(500).json({message: 'Something wrong!!!'});
        }
        
        User.update({_id: req.body.id}, {password: hash})
            .then(result => {
                res.status(200).json({message: "success"});
            })
            .catch(err => {
                res.status(500).json({message: 'Something wrong!!!'});
            });
        });
});

// POST /user/admin/manager-user/add-time
router.post('/add-time', (req, res, next) => {
    User.update({_id: req.body.id}, {expire: req.body.expire})
        .then(result => {
            res.status(200).json({message: 'success'});
        }).catch(err => {
            err.status = 500;
            next(err);
        });
});

// GET user/admin/manager-user/add-user
router.get('/add-user', (req, res, next) => {
    const messages = req.flash('error');
    const success = req.flash('success');

    res.render('admin/add-user', {
        layout: 'admin-layout',
        titleForm: 'Thêm tài khoản',
        hasError: messages.length > 0,
        messages: messages,
        hasSuccess: success.length > 0,
        success: success,
        csrfToken: req.csrfToken()
    });
});

// POST user/admin/manager-user/add-user
router.post('/add-user', (req, res, next) => {
    User.findOneByAccount(req.body.account)
        .then(user => {
            if (user) {
                req.flash('error', 'Tài khoản đã tồn tại.');
                return res.redirect('/user/admin/manager-user/add-user');
            }

            bcrypt.hash(req.body.password, 5, (err, hash) => {
                if (err) {
                    req.flash('error', 'Thêm tài khoản thất bại, thử lại sau');
                    return res.redirect('/user/admin/manager-user/add-user');
                }
        
                User.saveAccountIsConfirmed(req.body, hash)
                    .then(result => {
                        req.flash('success', 'Thêm tài khoản thành công');
                        res.redirect('/user/admin/manager-user/add-user');
                    }).catch(err => {
                        console.log(err);
                        req.flash('error', 'Thêm tài khoản thất bại, thử lại sau');
                        res.redirect('/user/admin/manager-user/add-user');
                    })
            });
        }).catch(err => {
            req.flash('error', 'Thêm tài khoản thất bại, thử lại sau');
            res.redirect('/user/admin/manager-user/add-user');
        });
});

module.exports = router;