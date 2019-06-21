const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/check-role');

const multer = require('../config/multer-disk-storage');
const sharp = require('sharp');

const article = require('../models/article');
const categorySub = require('../models/categorySub')
const Tag = require('../models/tag');

const intlData = {
    "locales": "en-US"
};

sharp.cache(false);

// Kiểm tra nếu là writer thì mới cho qua
router.use(checkRole.isWriter);

// Load avatar của user
router.use((req, res, next) => {
    res.locals.avatar = req.user.avatar;
    next();
});

router.get('/', (req, res, next) => {
    res.redirect('/user/writer/post');
});

router.get('/post', (req, res, next) => {
    const errors = req.flash('errorPost');
    const success = req.flash('successPost');
    categorySub.find().then(succ => {
        Tag.find()
            .then(tags => {
                res.render('writer/writer', {
                    actionpost: "/user/writer/post",
                    action: "/user/writer/edit",
                    listCategory: succ, topic: "Thêm bài viết", layout: 'writer-layout', title: 'writer'
                    , csrfToken: req.csrfToken(),
                    errors: errors,
                    hasError: errors.length > 0,
                    success: success,
                    hasSuccess: success.length > 0,
                    hasCustomCSS: true,
                    partial: function () { return 'manager-user-css' },
                    tags: tags,
                    key: 'fit-hcmus'
                });
            }).catch(err => {
                err.status = 500;
                next(err);
            });
    }).catch(err => {
        console.log(err);
    })
})


router.get('/post/:id', (req, res, next) => {

    let id = req.params.id;
    const errors = req.flash('errorPost');
    const success = req.flash('successPost');

    article.findById(id)
        .then(succ => {
            categorySub.find().then(list => {
                
                var tags = [];

                if (succ.arrayOfTags) {
                    tag = succ.arrayOfTags.map(item => item.id);
                }

                Tag.findExceptId(tags)
                    .then(tags => {
                        let topic = "Chỉnh sửa bài viết";
                        res.render('writer/writer',
                            {
                                actionpost: "/user/writer/post",
                                action: "/user/writer/edit",
                                listCategory: list,
                                article: succ, topic: topic,
                                layout: 'writer-layout',
                                title: 'writer',
                                csrfToken: req.csrfToken(),
                                tags: tags,
                                hasCustomCSS: true,
                                partial: function () { return 'manager-user-css' },
                                errors: errors,
                                hasError: errors.length > 0,
                                success: success,
                                hasSuccess: success.length > 0,
                            });
                    }).catch(err => {
                        err.status = 500;
                        next(err);
                    })

            })
                .catch(err => {
                    console.log(err);
                    const messagesFailure = err;
                    res.render('writer/writer', { actionpost: "/user/writer/post", layout: 'writer-layout', title: 'writer', csrfToken: req.csrfToken(), messagesFailure: messagesFailure, failure: true, success: false });
                })
        })
        .catch(err => {
            console.log(err);
        })
});


router.post('/post', multer.single('avatar'), (req, res, next) => {

    var entity = req.body;
    var accountID = req.user.id;

    entity.arrayOfTags = JSON.parse(req.body.arrayOfTags);

    if (!req.file) {
        return res.status(500).json({message: 'Something wrong !!!'});
    }

    entity.bigAvatar = req.file.path.substring(req.file.path.indexOf('\\')).replace(/\\/g,'/');
    entity.smallAvatar = '/uploads/thumbnail-' + req.file.filename;

    Promise.all([sharp(req.file.path).resize({width: 200}).toFile(`./public${entity.smallAvatar}`), article.add(entity, accountID)])
        .then(succ => {
            req.flash('successPost', 'Thêm bài viết thành công');
            res.status(200).json({message: 'success'});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: err.message});
        });
});

router.post('/edit', multer.single('avatar'), (req, res, next) => {

    var entity = req.body;
    entity.smallAvatar = req.body.oldSmallAvatar;
    entity.bigAvatar = req.body.oldBigAvatar;
    var accountID = req.user.id;
    var updateSmallAvatar;
    entity.arrayOfTags = JSON.parse(req.body.arrayOfTags);

    if (req.file) {
        updateSmallAvatar = sharp(req.file.path).resize({width: 200}).toFile(`./public${entity.smallAvatar}`);
    }

    Promise.all([updateSmallAvatar, article.findByIdAndUpdate(entity, accountID)])
        .then(result => {
            req.flash('successPost', 'Chỉnh sửa bài viết thành công');
            res.status(200).json({message: 'success'});
        }).catch(err => {
            console.log(err);
            res.status(500).json({message: err.message});
        });
});



router.get('/waiting', (req, res, next) => {
    let _writerID = req.user.id;

    article.findWaiting("approved", _writerID).then(listArticles => {
        let _writerName = req.user.userName;
        
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

    article.findPublished("approved", _writerID).then(listArticles => {
        let _writerName = req.user.userName;
        
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
        
        res.render('writer/writer-list',
         { topic: "Danh sách bài viết bị từ chối",
         
          layout: 'writer-layout', title: 'writer',
           listArticles: listArticles, writerName: _writerName,
           csrfToken: req.csrfToken() });
    })
        .catch(err => {
            console.log(err);
        });
});

router.get('/notApproved', (req, res, next) => {

    let _writerID = req.user.id;

    const errors = req.flash('errorDelete');
    const success = req.flash('successDelete');

    article.find("notApproved", _writerID).then(listArticles => {
        let _writerName = req.user.userName;
        
        res.render('writer/writer-list',
         { data: { intl: intlData },
         errors: errors,
         hasError: errors.length > 0,
         success: success,
         hasSuccess: success.length > 0,
          topic: "Danh sách bài viết chưa được duyệt",
           layout: 'writer-layout', title: 'writer', listArticles: listArticles, writerName: _writerName,
           csrfToken: req.csrfToken() });
    })
        .catch(err => {
            console.log(err);
        });

});

router.delete('/delete-article', (req, res, next) => {
    
    article.deleteOne({ _id: req.body.id })
        .then(result => {
            req.flash('successDelete', 'Xóa bài viết thành công');
            res.status(200).json({ message: 'successful' });
        }).catch(err => {
            req.flash('errorDelete', 'Xóa bài viết thất bại, thử lại sau.');
            res.status(500).json({ message: 'Something wrong!' });
        });
});

module.exports = router;