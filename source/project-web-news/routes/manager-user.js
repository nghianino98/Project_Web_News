const express = require('express');
const router = express.Router();
const Role = require('../FunctionHelper/user-role');

const User = require('../models/user');
const categoryMain = require('../models/categoryMain');
const categorySub = require('../models/categorySub');

router.get('/', (req, res, next) => {
    User.findAll().then(succ => {
            res.render('admin/adminusers', {
                isModify: false,
                userList: succ,
                layout: 'admin-layout',
                title: 'Admin | Quản lí người dùng'
            });
        })
        .catch(err => {
            next(err);
        });
});

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
                messages: messages,
                hasError: messages.length > 0,
                isWriter: user.role === 'writer',
                isEditor: user.role === 'editor',
                roles: role.generateArray()
            });
        }).catch(err => {
            next(err);
        })
});



module.exports = router;