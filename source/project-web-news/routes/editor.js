const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/check-role');

const Article = require('../models/article');
const intlData = {
    "locales": "en-US"
};

// Kiểm tra nếu là editor mới cho qua
router.use(checkRole.isEditor);

// Load avatar của user
router.use((req, res, next) => {
    res.locals.avatar = req.user.avatar;
    next();
});

// Lấy trang mặc định của editor
router.get('/', (req, res, next) => {
    res.redirect('/user/editor/waiting');
});

// GET /user/editor/waiting
router.get('/waiting', (req, res, next) => {
    if (req.user.categoryEditor.length === 0) {
        return res.render('editor/waiting', {
            layout: 'editor-layout',
            title: 'Danh sách bài viết chờ duyệt',
            data: {intl: intlData}
        });
    }

    Article.findByStatusAndCategoriesSub('notApproved', req.user.categoryEditor)
        .then(articles => {
            return res.render('editor/waiting', {
                layout: 'editor-layout',
                title: 'Danh sách bài viết chờ duyệt',
                listArticles: articles,
                data: {intl: intlData}
            });
        }).catch(err => {
            err.status = 500;
            next(err);
        });
});

// GET /user/editor/confirmed
router.get('/confirmed', (req, res, next) => {
    if (req.user.categoryEditor.length === 0) {
        return res.render('editor/confirmed', {
            layout: 'editor-layout',
            title: 'Danh sách bài viết đã duyệt',
            data: {intl: intlData}
        });
    }

    Article.findByStatusAndCategoriesSub('approved', req.user.categoryEditor)
        .then(articles => {
            return res.render('editor/confirmed', {
                layout: 'editor-layout',
                title: 'Danh sách bài viết đã duyệt',
                listArticles: articles,
                data: {intl: intlData}
            });
        }).catch(err => {
            err.status = 500;
            next(err);
        });
});

// GET /user/editor/deny
router.get('/deny', (req, res, next) => {
    if (req.user.categoryEditor.length === 0) {
        return res.render('editor/deny', {
            layout: 'editor-layout',
            title: 'Danh sách bài viết đã từ chối',
            data: {intl: intlData}
        });
    }

    Article.findByStatusAndCategoriesSub('rejected', req.user.categoryEditor)
        .then(articles => {
            return res.render('editor/deny', {
                layout: 'editor-layout',
                title: 'Danh sách bài viết đã từ chối',
                listArticles: articles,
                data: {intl: intlData}
            });
        }).catch(err => {
            err.status = 500;
            next(err);
        });
});

module.exports = router;