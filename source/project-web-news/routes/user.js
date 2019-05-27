var express = require('express');
var router = express.Router();
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

router.get('/register', (req, res, next) => {
    res.render('user/registration');
});

module.exports = router;
