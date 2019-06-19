const express = require('express');
const router = express.Router();
const checkRole = require('../../middleware/check-role');
const csrf = require('csurf');
const csurfProtection = csrf();


const admin = require('../../models/user');
const categoryMain = require('../../models/categoryMain');
const categorySub = require('../../models/categorySub');
const article = require('../../models/article');

const managerTagRouter = require('./manager-tag');
const managerUserRouter = require('./manager-user');

// Kiểm tra nếu là admin mới cho qua
router.use(checkRole.isAdmin);

// Load avatar của user
router.use((req, res, next) => {
    res.locals.avatar = req.user.avatar;
    res.locals.userName = req.user.userName;
    next();
});

// Lấy trang mặc định của admin
router.get('/', (req, res, next) => {
    res.redirect('/user/admin/manager-category');
});

router.get('/add-posts', (req, res, next) => {
    res.render('admin/admin-addposts', {
        layout: 'admin-layout',
        title: 'Admin | Quản lí bài viết'
    });
});

router.get('/confirm-posts', (req, res, next) => {
    res.render('admin/admin-confirm-posts', {
        layout: 'admin-layout',
        title: 'Admin | Quản lí bài viết'
    });
});

router.get('/manager-category', (req, res, next) => {
    categoryMain.find().then(listCategorys => {

        categorySub.find().then(listCategorySub => {
            //console.log(listCategorySub);

            res.render('admin/admin-manager-category', {
                layout: 'admin-layout',
                csrfToken: req.csrfToken(),
                title: 'Admin | Quản lí chuyên mục',
                listCategorys: listCategorys,
                listCategorySub: listCategorySub
            });
        });
    })
        .catch(err => {
            console.log(err);
        });
});

router.use('/manager-tag', managerTagRouter);

router.use('/manager-user', managerUserRouter);


// Quản lý chuyên mục


router.post('/manager-category', (req, res, next) => {

    var entity = req.body;


    if (entity.category_parent === "Chọn làm chuyên mục cha") {
        categoryMain.add(entity)
            .then(succ => {
                //console.log(entity);
                const messagesSuccess = "Đã thêm chuyên mục \" " + succ.categoryName + " \" thành công";
                categoryMain.find().then(listCategorys => {

                    categorySub.find().then(listCategorySub => {

                        res.render('admin/admin-manager-category', {
                            layout: 'admin-layout',
                            title: 'Success | Admin Manager category ',
                            csrfToken: req.csrfToken(),
                            messagesSuccess: messagesSuccess,
                            success: true,
                            failure: false,
                            listCategorys: listCategorys,
                            listCategorySub: listCategorySub
                        });
                    });
                });
            })
            .catch(err => {
                console.log(err);
                const messagesFailure = err;
                res.render('admin/admin-manager-category', {
                    layout: 'admin-layout',
                    title: 'Error | Admin Manager category ',
                    csrfToken: req.csrfToken(),
                    messagesFailure: messagesFailure,
                    failure: true,
                    success: false
                });
            });
    } else {
        categoryMain.findById(entity.category_parent)
            .then(succ => {
                const category_parentID = succ._id;
                categorySub.add(entity, category_parentID)
                    .then(succ => {
                        const messagesSuccess = "Đã thêm chuyên mục con \" " + entity.category_name + " \" vào chuyên mục \" " + succ.populate('categoryMainID', 'categoryName').categoryName + " \" thành công !";
                        categoryMain.find().then(listCategorys => {
                            categorySub.find().then(listCategorySub => {


                                res.render('admin/admin-manager-category', {
                                    layout: 'admin-layout',
                                    title: 'Success | Admin Manager category ',
                                    csrfToken: req.csrfToken(),
                                    messagesSuccess: messagesSuccess,
                                    success: true,
                                    failure: false,
                                    listCategorys: listCategorys,
                                    listCategorySub: listCategorySub
                                });
                            });
                        });
                    })
                    .catch(err => {
                        //console.log(err);
                        const messagesFailure = err;
                        res.render('admin/admin-manager-category', {
                            layout: 'admin-layout',
                            title: 'Error | Admin Manager category ',
                            csrfToken: req.csrfToken(),
                            messagesFailure: messagesFailure,
                            failure: true,
                            success: false
                        });
                    });
            })
            .catch(err => {
                console.log(err);
            });
    }
});

router.get('/manager-category/delete/category/:id', (req, res, next) => {
    console.log(req.params.id);
    categoryMain.findByIdAndDeletePre(req.params.id)
        .then(succ => {
            res.redirect('/user/admin/manager-category');
        })
        .catch(err => {
            console.log(err);
        });
});

router.post('/manager-category/update', (req, res, next) => {

    var entity = req.body;
    console.log(entity);
    categoryMain.findByIdAndUpdate(entity.categoryID_update, entity.category_name_update)
        .then(succ => {
            categoryMain.find().then(listCategorys => {
                //console.log(listCategorys.length);
                categorySub.find().then(listCategorySub => {

                    const messagesSuccess = "Cập nhật chuyên mục thành công !";

                    res.render('admin/admin-manager-category', {
                        layout: 'admin-layout',
                        csrfToken: req.csrfToken(),
                        title: 'Admin | Quản lí chuyên mục',
                        messagesSuccess: messagesSuccess,
                        success: true,
                        failure: false,
                        listCategorys: listCategorys,
                        listCategorySub: listCategorySub
                    });
                });
            })
        })
        .catch(err => {
            console.log(err);
            const messagesFailure = err;
            res.render('admin/admin-manager-category', {
                layout: 'admin-layout',
                title: 'Error | Admin Manager category ',
                csrfToken: req.csrfToken(),
                messagesFailure: messagesFailure,
                failure: true,
                success: false
            });
        });
});

router.get('/manager-category/delete/categorysub/:id', (req, res, next) => {
    console.log(req.params.id);
    categorySub.findByIdAndDeletePre(req.params.id)
        .then(succ => {
            res.redirect('/user/admin/manager-category');
        })
        .catch(err => {
            console.log(err);
        });
});

router.post('/manager-category/update/categorySub', (req, res, next) => {

    var entity = req.body;


    categoryMain.findByCategoryName(entity.categorysub_parent)
        .then(succ => {
            let category_parentID
            if (succ !== null) {
                category_parentID = succ._id;
            } else {
                category_parentID = null;
            }
            categorySub.findByIdAndUpdate(entity.categorySubID, entity.categorysub_name, category_parentID)
                .then(succ => {
                    res.redirect('/user/admin/manager-category');
                })
                .catch(err => {
                    console.log(err);
                });
        });
});


// Quản lý bài viết


router.get('/manager-post', (req, res, next) => {
    const errors = req.flash('error');
    const success = req.flash('success');
    article.findAll().then(succ => {
        console.log(succ);
        res.render('admin/admin-manager-post', {
            errors: errors,
            hasError: errors.length > 0,
            success: success,
            hasSuccess: success.length > 0, listArticles: succ, layout: 'admin-layout', title: 'Admin | Quản lí bài viết', csrfToken: req.csrfToken()
        });
    })
        .catch(err => {
            console.log(err);
        })


});

router.get('/edit/:id', (req, res, next) => {
    const errors = req.flash('errorPost');
    const success = req.flash('successPost');

    article.findById(req.params.id)
        .then(succ => {
            categorySub.find().then(list => {
                console.log(succ);
                let topic = "Chỉnh sửa bài viết";
                res.render('writer/writer', {
                    actionpost: "/user/admin/post", action: "/user/admin/edit", listCategory: list, article: succ, topic: topic,
                    errors: errors,
                    hasError: errors.length > 0,
                    success: success,
                    hasSuccess: success.length > 0,
                    hasCustomCSS: true,
                    partial: function () { return 'manager-user-css' },
                    layout: 'admin-layout', title: 'writer', csrfToken: req.csrfToken()
                });
            })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
            const messagesFailure = err;
            res.render('writer/writer', { actionpost: "/user/admin/post", action: "/user/admin/edit", layout: 'admin-layout', title: 'writer', csrfToken: req.csrfToken(), messagesFailure: messagesFailure, failure: true, success: false });
        });
});

router.post('/edit', (req, res, next) => {

    var entity = req.body;

    var accountID = req.body.writerMain;

    article.findByIdAndUpdate(entity, accountID)
        .then(succ => {
            req.flash('successPost', 'Chỉnh sửa bài viết thành công');
            console.log(succ);
            const messagesSuccess = "Đã cập nhật bài có tiêu đề \" " + succ.title + " \" thành công";
            // res.render('writer/writer', {actionpost:"/user/admin/post", action:"/user/admin/edit",layout: 'admin-layout', title: 'admin', csrfToken: req.csrfToken(), messagesSuccess: messagesSuccess, success: true, failure: false });
            res.redirect('/user/admin/edit/' + succ._id);
        })
        .catch(err => {
            req.flash('errorPost', 'Chỉnh sửa bài viết thất bại, thử lại sau.');
            console.log(err);
            const messagesFailure = err;
            res.render('writer/writer', { actionpost: "/user/admin/post", action: "/user/admin/edit", action: "/user/admin/edit", layout: 'admin-layout', title: 'admin', csrfToken: req.csrfToken(), messagesFailure: messagesFailure, failure: true, success: false });
        });

});

router.delete('/delete-article', (req, res, next) => {
    console.log("call router delete");
    article.deleteOne({ _id: req.body.id })
        .then(result => {
            req.flash('success', 'Xóa bài viết thành công');
            res.status(200).json({ message: 'successful' });
        }).catch(err => {
            req.flash('error', 'Xóa bài viết thất bại, thử lại sau.');
            res.status(500).json({ message: 'Something wrong!' });
        });
});

router.get('/post', (req, res, next) => {
    const errors = req.flash('errorPost');
    const success = req.flash('successPost');

    // article.findById(req.params.id)
    //     .then(succ => {
    categorySub.find().then(list => {
        let topic = "Thêm bài viết";
        res.render('writer/writer', {
            actionpost: "/user/admin/post", action: "/user/admin/edit", listCategory: list, topic: topic,
            errors: errors,
            hasError: errors.length > 0,
            success: success,
            hasSuccess: success.length > 0,
            layout: 'admin-layout', title: 'Admin', csrfToken: req.csrfToken()
        });
    })
        .catch(err => {
            console.log(err);
        })
    // })
    // .catch(err => {
    //     console.log(err);
    //     const messagesFailure = err;
    //     res.render('writer/writer', { actionpost:"/user/admin/post", action:"/user/admin/edit",layout: 'admin-layout', title: 'writer', csrfToken: req.csrfToken(), messagesFailure: messagesFailure, failure: true, success: false });
    // });
})

router.post('/post',(req,res,next)=>{
    var entity = req.body;
    var accountID = req.user.id;

    article.add(entity, accountID)
        .then(succ => {
            req.flash('successPost', 'Thêm bài viết thành công');
            // res.status(200).json({message: 'successful'});
            // console.log(req.body);
            // const messagesSuccess = "Đã đăng bài có tiêu đề \" " + succ.title + " \" thành công";
            // res.render('writer/writer', {actionpost:"/user/writer/post", action:"/user/writer/edit",actionpost:"/user/writer/post",topic: "Thêm bài viết" ,layout: 'writer-layout', title: 'writer', csrfToken: req.csrfToken(), messagesSuccess: messagesSuccess, success: true, failure: false });
            res.redirect('/user/admin/post');  
        })
        .catch(err => {
            req.flash('errorPost', 'Thêm bài viết thất bại, thử lại sau.');
            // res.status(500).json({message: 'Something wrong!'});
            console.log(err);
            const messagesFailure = err;
            res.render('writer/writer', {actionpost:"/user/admin/post", layout: 'writer-layout', title: 'writer', csrfToken: req.csrfToken(), messagesFailure: messagesFailure, failure: true, success: false });
        });
})

module.exports = router;