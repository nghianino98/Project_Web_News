const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/check-role');

// Kiểm tra nếu là editor mới cho qua
router.use(checkRole.isEditor);

// Load avatar của user
router.use((req, res, next) => {
    res.locals.avatar = req.user.avatar;
    next();
});

// Lấy trang mặc định của editor
router.get('/', (req, res, next) => {
    res.render('editor/editor', {layout: 'editor-layout', title: 'editor'});
});

router.get('/confirm-posts', (req, res, next) => {
    res.render('editor/editor-confirm', {layout: 'editor-layout', title: 'editor'});
});

router.get('/deny-posts', (req, res, next) => {
    res.render('editor/editor-deny', {layout: 'editor-layout', title: 'editor'});
});

module.exports = router;