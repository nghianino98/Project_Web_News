const express = require('express');
const router = express.Router();

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