const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/check-role');

const admin = require('../models/user');

// Kiểm tra nếu là admin mới cho qua
router.use(checkRole.isAdmin);

// Load avatar của user
router.use((req, res, next) => {
    res.locals.avatar = req.user.avatar;
    next();
});

// Lấy trang mặc định của admin
router.get('/', (req, res, next) => {
    res.render('admin/admin', { layout: 'admin-layout', title: 'Admin | Quản lí bài viết' });
});

router.get('/add-posts', (req, res, next) => {
    res.render('admin/admin-addposts', { layout: 'admin-layout', title: 'Admin | Quản lí bài viết' });
});

router.get('/confirm-posts', (req, res, next) => {
    res.render('admin/admin-confirm-posts', { layout: 'admin-layout', title: 'Admin | Quản lí bài viết' });
});

router.get('/manager-category', (req, res, next) => {
    res.render('admin/admin-manager-category', { layout: 'admin-layout', title: 'Admin | Quản lí chuyên mục' });
});

router.get('/manager-tag', (req, res, next) => {
    res.render('admin/admin-manager-tag', { layout: 'admin-layout', title: 'Admin | Quản lí thẻ' });
});

router.get('/manager-user', (req, res, next) => {

    admin.findAll().then(succ => {
        // console.log(succ);
        res.render('admin/adminusers', { isModify : false ,userList: succ, layout: 'admin-layout', title: 'Admin | Quản lí người dùng' });
    })
        .catch(err => {
            console.log(err);
        });

    // res.render('admin/adminusers', {layout: 'admin-layout', title: 'Admin | Quản lí người dùng'});
});

module.exports = router;