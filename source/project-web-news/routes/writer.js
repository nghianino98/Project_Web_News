const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/check-role');

const article = require('../models/article');

// Kiểm tra nếu là writer thì mới cho qua
router.use(checkRole.isWriter);

// Load avatar của user
router.use((req, res, next) => {
    res.locals.avatar = req.user.avatar;
    next();
});

router.get('/post', (req, res, next) => {
    res.render('writer/writer', { layout: 'writer-layout', title: 'writer', csrfToken: req.csrfToken() });
});

// router.post('/', (req, res, next) => {
//     article.add(req.body);
//     console.log(req.body);
//     res.end("...");
// });

router.post('/post', (req, res, next) => {

    var entity = req.body;
    var accountID = req.user.id;

    console.log(req.user.id);

    article.add(entity, accountID)
        .then(succ => { 
            console.log(req.body);
            const messagesSuccess = "Đã đăng bài có tiêu đề \" " + succ.title + " \" thành công";
            res.render('writer/writer', { layout: 'writer-layout', title: 'writer', csrfToken: req.csrfToken(),  messagesSuccess: messagesSuccess, success: true , failure: false});
        })
        .catch(err => {
            console.log(err);
            const messagesFailure = err;
            res.render('writer/writer', { layout: 'writer-layout', title: 'writer', csrfToken: req.csrfToken(),  messagesFailure: messagesFailure, failure: true , success: false });
        });
    
});

router.get('/waiting', (req, res, next) => {
    res.render('writer/writer-waiting', { layout: 'writer-layout', title: 'writer' });
});

router.get('/published', (req, res, next) => {
    res.render('writer/writer-published', { layout: 'writer-layout', title: 'writer' });
});

router.get('/deny', (req, res, next) => {
    res.render('writer/writer-deny', { layout: 'writer-layout', title: 'writer' });
});

router.get('/not-confirm', (req, res, next) => {
    res.render('writer/writer-not-confirm', { layout: 'writer-layout', title: 'writer' });
});

module.exports = router;