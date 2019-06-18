const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/check-role');

const Article = require('../models/article');
const CategorySub = require('../models/categorySub');
const Tag = require('../models/tag');

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

// GET user/editor/waiting/:id
router.get('/waiting/:id', (req, res, next) => {
    const messages = req.flash('error');

    Promise.all([Article.findOneById(req.params.id), CategorySub.findAll()])
        .then(result => {
            if (!result[0]) {
                var err = new Error();
                err.status = 404;
                err.message = 'Không tìm thấy bài viết';
                return next(err);
            }

            Tag.findExceptId(result[0].arrayOfTags.map(item => item.id))
                .then(tags => {
                    res.render('editor/details', {
                        layout: 'editor-layout',
                        topic: 'Duyệt bài viết',
                        hasCustomCSS : true,
                        partial: function(){return 'manager-user-css'},
                        messages: messages,
                        hasError: messages.length,
                        article: result[0],
                        listCategory: result[1],
                        tags: tags,
                        mode: 'approve'
                    });
                }).catch(err => {
                    err.status = 500;
                    next(err);
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

// GET /user/editor/confirmed/:id
router.get('/confirmed/:id', (req, res, next) => {
    const messages = req.flash('error');
    Article.findOneById(req.params.id)
        .then(article => {
            if (!article) {
                var err = new Error();
                err.status = 404;
                err.message = 'Không tìm thấy bài viết';
                return next(err);
            }

            res.render('editor/details', {
                layout: 'editor-layout',
                topic: 'Bài viết đã duyệt',
                hasCustomCSS : true,
                partial: function(){return 'manager-user-css'},
                messages: messages,
                hasError: messages.length,
                article: article,
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

// GET /user/editor/deny/:id
router.get('/deny/:id', (req, res, next) => {
    const messages = req.flash('error');
    Article.findOneById(req.params.id)
        .then(article => {
            if (!article) {
                var err = new Error();
                err.status = 404;
                err.message = 'Không tìm thấy bài viết';
                return next(err);
            }

            res.render('editor/details', {
                layout: 'editor-layout',
                topic: 'Bài viết đã từ chối',
                hasCustomCSS : true,
                partial: function(){return 'manager-user-css'},
                messages: messages,
                hasError: messages.length,
                article: article,
            });
        }).catch(err => {
            err.status = 500;
            next(err);
        });
});

module.exports = router;