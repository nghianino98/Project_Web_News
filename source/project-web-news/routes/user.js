var express = require('express');
var router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const adminRouter = require('./admin');
const editorRouter = require('./editor');
const writerRouter = require('./writer');

/* GET users listing. */
router.use('/admin', adminRouter);
router.use('/editor', editorRouter);
router.use('/writer', writerRouter);

router.get('/login', (req, res, next) => {
    res.render('user/login');
});

router.post('/login', passport.authenticate('local.login', {
    session: false,
    failureRedirect: '/user/login',
    failureFlash: true
}), (req, res, next) => {
    const token = jwt.sign({
        email: req.user.email,
        id: req.user.id,
    }, 'fit-hcmus', {
        expiresIn: '1h'
    });

    res.cookie('Authorization', 'Bearer ' + token, {httpOnly: true});
    res.redirect('/');
});

router.get('/register', (req, res, next) => {
    res.render('user/registration');
});

router.post('/register', passport.authenticate('local.signup', {
    session: false,
    failureRedirect: '/user/register',
    failureFlash: true
}),  (req, res, next) => {
    const token = jwt.sign({
        email: req.user.email,
        id: req.user.id,
    }, 'fit-hcmus', {
        expiresIn: '1h'
    });

    res.cookie('Authorization', 'Bearer ' + token, {httpOnly: true});
    res.redirect('/');
});

module.exports = router;
