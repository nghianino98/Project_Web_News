const express = require('express');
const router = express.Router();
const filebase = require('../../FunctionHelper/firebase');
const bcrypt = require('bcrypt');
const multer = require('../../config/multer');
const Role = require('../../FunctionHelper/user-role');

const User = require('../../models/user');
const categoryMain = require('../../models/categoryMain');
const CategorySub = require('../../models/categorySub');
const Tag = require('../../models/tag');

// GET /user/admin/manager-user
router.get('/', (req, res, next) => {
    Tag.find().then(listTags => {
            console.log(listTags);
            res.render('admin/admin-manager-tag', {
                layout: 'admin-layout',
                title: 'Admin | Quản lí thẻ',
                csrfToken: req.csrfToken(),
                listTags
            });
        })
        .catch(err => {
            console.log(err);
        });
});

router.post('/', (req, res, next) => {

    var entity = req.body;
    Tag.add(entity.tagname)
        .then(succ => {
            //console.log(entity);
            const messagesSuccess = "Đã thêm tag mới \"" + entity.tagname + "\" thành công !";
            Tag.find().then(listTags => {
                res.render('admin/admin-manager-tag', {
                    layout: 'admin-layout',
                    title: 'Success | Admin Manager Tag ',
                    csrfToken: req.csrfToken(),
                    messagesSuccess: messagesSuccess,
                    success: true,
                    failure: false,
                    listTags
                });
            });
        })
        .catch(err => {
            console.log(err);
            const messagesFailure = err;
            res.render('admin/admin-manager-tag', {
                layout: 'admin-layout',
                title: 'Error | Admin Manager Tag ',
                csrfToken: req.csrfToken(),
                messagesFailure: messagesFailure,
                failure: true,
                success: false
            });
        });
});

router.get('/delete/:id', (req, res, next) => {
    console.log(req.params.id);
    Tag.findByIdAndDelete(req.params.id)
        .then(succ => {
            res.redirect('/user/admin/manager-tag');
        })
        .catch(err => {
            console.log(err);
        });
});

router.post('/update', (req, res, next) => {

    var entity = req.body;
    console.log(entity);
    Tag.findByIdAndUpdate(entity.tagid, entity.tagnameUpdate)
        .then(succ => {
            Tag.find().then(listTags => {

                const messagesSuccess = "Cập nhật tag thành công !";

                res.render('admin/admin-manager-tag', {
                    layout: 'admin-layout',
                    csrfToken: req.csrfToken(),
                    title: 'Success | Admin Manager Tag',
                    messagesSuccess: messagesSuccess,
                    success: true,
                    failure: false,
                    listTags
                });
            })
        })
        .catch(err => {
            console.log(err);
            const messagesFailure = err;
            res.render('admin/admin-manager-tag', {
                layout: 'admin-layout',
                title: 'Error | Admin Manager Tag ',
                csrfToken: req.csrfToken(),
                messagesFailure: messagesFailure,
                failure: true,
                success: false
            });
        });
});


module.exports = router;