const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/check-role');

const article = require('../models/article');
const categorySub = require('../models/categorySub')

// Kiểm tra nếu là writer thì mới cho qua
router.use(checkRole.isWriter);

// Load avatar của user
router.use((req, res, next) => {
    res.locals.avatar = req.user.avatar;
    next();
});

router.get('/', (req, res, next) => {
    categorySub.find().then(succ=>{
        console.log(succ);
        res.render('writer/writer', { listCategory: succ, topic: "Thêm bài viết", layout: 'writer-layout', title: 'writer', csrfToken: req.csrfToken() });
    })
    .catch(err=>{
        console.log(err);
    })
});

router.get('/post', (req, res, next) => {
    categorySub.find().then(succ=>{
        console.log(succ);
        res.render('writer/writer', { listCategory: succ, topic: "Thêm bài viết", layout: 'writer-layout', title: 'writer', csrfToken: req.csrfToken() });
    })
    .catch(err=>{
        console.log(err);
    })
});

router.get('/post/:id', (req, res, next) => {
    console.log(req.params.id);

    article.findById(req.params.id)
        .then(succ => {
            categorySub.find().then(list=>{
                console.log(succ);
                let topic = "Chỉnh sửa bài viết";
                res.render('writer/writer', { listCategory: list, article: succ, topic: topic, layout: 'writer-layout', title: 'writer', csrfToken: req.csrfToken() });
            })
            .catch(err=>{
                console.log(err);
            })
        })
        .catch(err => {
            console.log(err);
            const messagesFailure = err;
            res.render('writer/writer', { layout: 'writer-layout', title: 'writer', csrfToken: req.csrfToken(), messagesFailure: messagesFailure, failure: true, success: false });
        });
});

router.post('/post', (req, res, next) => {

    var entity = req.body;
    var accountID = req.user.id;

    article.add(entity, accountID)
        .then(succ => {
            console.log(req.body);
            const messagesSuccess = "Đã đăng bài có tiêu đề \" " + succ.title + " \" thành công";
            res.render('writer/writer', { topic: "Thêm bài viết" ,layout: 'writer-layout', title: 'writer', csrfToken: req.csrfToken(), messagesSuccess: messagesSuccess, success: true, failure: false });
        })
        .catch(err => {
            console.log(err);
            const messagesFailure = err;
            res.render('writer/writer', { layout: 'writer-layout', title: 'writer', csrfToken: req.csrfToken(), messagesFailure: messagesFailure, failure: true, success: false });
        });

});

router.post('/edit', (req, res, next) => {

    var entity = req.body;

    var accountID = req.user.id;

    article.findByIdAndUpdate(entity, accountID)
        .then(succ => {
            console.log(succ);
            const messagesSuccess = "Đã cập nhật bài có tiêu đề \" " + succ.title + " \" thành công";
            res.render('writer/writer', { layout: 'writer-layout', title: 'writer', csrfToken: req.csrfToken(), messagesSuccess: messagesSuccess, success: true, failure: false });
        })
        .catch(err => {
            console.log(err);
            const messagesFailure = err;
            res.render('writer/writer', { layout: 'writer-layout', title: 'writer', csrfToken: req.csrfToken(), messagesFailure: messagesFailure, failure: true, success: false });
        });

});

router.get('/waiting', (req, res, next) => {
    let _writerID = req.user.id;

    article.find("approved", _writerID).then(listArticles => {
        let _writerName = req.user.userName;
        console.log(_writerName);
        res.render('writer/writer-list', {
            topic: "Danh sách bài viết đã duyệt và chờ xuất bản", layout: 'writer-layout',
            title: 'writer', listArticles: listArticles, writerName: _writerName, notEdit: true
        });
    })
        .catch(err => {
            console.log(err);
        });
});
router.get('/published', (req, res, next) => {
    let _writerID = req.user.id;

    article.find("published", _writerID).then(listArticles => {
        let _writerName = req.user.userName;
        console.log(_writerName);
        res.render('writer/writer-list', {
            topic: "Danh sách bài viết đã xuất bản", layout: 'writer-layout',
            title: 'writer', listArticles: listArticles, writerName: _writerName, notEdit: true
        });
    })
        .catch(err => {
            console.log(err);
        });
});

router.get('/rejected', (req, res, next) => {
    let _writerID = req.user.id;

    article.find("rejected", _writerID).then(listArticles => {
        let _writerName = req.user.userName;
        console.log(_writerName);
        res.render('writer/writer-list', { topic: "Danh sách bài viết bị từ chối", layout: 'writer-layout', title: 'writer', listArticles: listArticles, writerName: _writerName });
    })
        .catch(err => {
            console.log(err);
        });
});

router.get('/notApproved', (req, res, next) => {

    let _writerID = req.user.id;

    article.find("notApproved", _writerID).then(listArticles => {
        let _writerName = req.user.userName;
        console.log(_writerName);
        res.render('writer/writer-list', { topic: "Danh sách bài viết chưa được duyệt", layout: 'writer-layout', title: 'writer', listArticles: listArticles, writerName: _writerName });
    })
        .catch(err => {
            console.log(err);
        });

});

module.exports = router;