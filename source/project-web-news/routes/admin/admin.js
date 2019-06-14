const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/check-role');
const csrf = require('csurf');
const csurfProtection = csrf();


const admin = require('../models/user');
const categoryMain = require('../models/categoryMain');
const categorySub = require('../models/categorySub');
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
    res.render('admin/admin', {
        layout: 'admin-layout',
        title: 'Admin | Quản lí bài viết'
    });
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

                // listCategorySub.forEach(element => {
                //     categoryMain.findById(element.categoryMain)
                //         .then(succ => {
                //             console.log(succ.categoryName);
                //             element.categoryMain = succ.categoryName;                                                      
                //         });
                // });

                // console.log(listCategorySub);

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

router.get('/manager-tag', (req, res, next) => {
    res.render('admin/admin-manager-tag', {
        layout: 'admin-layout',
        title: 'Admin | Quản lí thẻ'
    });
});

router.use('/manager-user', managerUserRouter);


router.post('/manager-category', (req, res, next) => {

    var entity = req.body;


    if (entity.category_parent === "Chọn làm chuyên mục cha") {
        categoryMain.add(entity)
            .then(succ => {
                console.log(entity);
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

        categoryMain.findByCategoryName(entity.category_parent)
            .then(succ => {
                const category_parentID = succ._id;
                categorySub.add(entity, category_parentID)
                    .then(succ => {
                        //console.log(entity);
                        const messagesSuccess = "Đã thêm chuyên mục con \" " + succ.categoryName + " \" vào chuyên mục \" " + entity.category_parent + " \" thành công !";
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
    categoryMain.findByIdAndDelete(req.params.id)
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
    //console.log(entity);

    categoryMain.findByCategoryName(entity.categorysub_parent)
        .then(succ => {

            const category_parentID = succ._id;
            categorySub.findByIdAndUpdate(entity.categorySubID, entity.categorysub_name, entity.categorysub_parent, category_parentID)
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
});

module.exports = router;