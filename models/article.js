const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var articleSchema = Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    abstract: { type: String, required: true },
    writeDate: { type: Date },
    writer: { type: Schema.Types.ObjectId, ref: "User" },
    editor: Schema.Types.ObjectId,
    // status: {type: Boolean },
    status: {
        type: String,
        enum: ['approved', 'published', 'rejected', 'notApproved', 'draft'],
        default: 'notApproved'
    },
    reasonForRefusing: { type: String },
    postDate: { type: Date },
    categoryMain: { type: Schema.Types.ObjectId, ref: 'CategoryMains', require: true },
    categorySub: { type: Schema.Types.ObjectId, ref: 'CategorySubs', require: true },
    views: { type: Number, default: 0 },
    smallAvatar: { type: String, default: '/images/news_thumbnail2.jpg' },
    bigAvatar: { type: String, default: '/images/photograph_img2.jpg' },
    arrayOfTags: [{type: Schema.Types.ObjectId, ref: 'Tags', require: true}],
    isPremiumArticle: { type: Boolean },
    comments: [{
        nameUser: {type: String},
        email: {type: String},
        commentDate: {type: Date},
        content: {type: String}
    }],
})

articleSchema.index({
    title: 'text',
    abstract: 'text',
    content: 'text'
}, {
        weights: {
            title: 5,
            abstract: 4,
            content: 3,
        }
    }

)

// module.exports = mongoose.model('Article', articleSchema);

const baibao = mongoose.model('Articles', articleSchema);
const categorySub = require('./categorySub')

module.exports = {
    getReasonForRefusingById: (id) => {
        return baibao.findOne({_id: id})
            .select('reasonForRefusing')
            .exec();
    },

    update: (conditionObject, options) => {
        return baibao.updateOne(conditionObject, {$set: options}).exec();
    },

    findOneById: (id) => {
        return baibao.findOne({_id: id})
            .populate('categoryMain', 'categoryName')
            .populate('categorySub', 'categoryName')
            .populate('writer', 'pseudonym')
            .populate('arrayOfTags', 'tagName')
            .exec();
    },

    findByStatusAndCategoriesSub: (status, categories) => {
        return baibao.find({ categorySub: { $in: categories } })
            .where({ status: status })
            .populate('categoryMain', 'categoryName')
            .populate('categorySub', 'categoryName')
            .populate('writer', 'pseudonym')
            .exec();
    },

    find: (statusArticles, writerID) => {
        return new Promise((resolve, reject) => {
            baibao.find({ status: statusArticles, writer: writerID })
                .populate('categoryMain', 'categoryName')
                .populate('categorySub', 'categoryName')
                .exec((err, succ) => {
                    if (err)
                        reject(err);
                    else
                        resolve(succ);
                })
        });
    },

    findWaiting: (statusArticles, writerID) => {
        return new Promise((resolve, reject) => {
            var recentDate = new Date();
                
            baibao.find({ status: statusArticles, writer: writerID,
                postDate: {'$gt': recentDate} })
                .populate('categoryMain', 'categoryName')
                .populate('categorySub', 'categoryName')
                .exec((err, succ) => {
                    if (err)
                        reject(err);
                    else
                        resolve(succ);
                })
        });
    },

    findPublished: (statusArticles, writerID) => {
        return new Promise((resolve, reject) => {
            var recentDate = new Date();
                
            baibao.find({ status: statusArticles, writer: writerID,
                postDate: {'$lt': recentDate} })
                .populate('categoryMain', 'categoryName')
                .populate('categorySub', 'categoryName')
                .exec((err, succ) => {
                    if (err)
                        reject(err);
                    else
                        resolve(succ);
                })
        });
    },

    findAll: () => {
        return new Promise((resolve, reject) => {
            baibao.find()
                .populate('categoryMain', 'categoryName')
                .populate('categorySub', 'categoryName')
                .populate('writer', 'pseudonym')
                .exec((err, succ) => {
                    if (err)
                        reject(err);
                    else
                        resolve(succ);
                })
        });
    },

    add: (entity, writer) => {
        return new Promise((resolve, reject) => {

            categorySub.findDad(entity.categorySub).then(succ => {
                entity.categoryMain = succ.categoryMainID.id;
                // console.log("cateMain:"+categoryMain);
                var obj = new baibao({
                    title: entity.title,
                    content: entity.content,
                    abstract: entity.abstract,
                    writeDate: new Date().toLocaleString(),
                    writer: writer,
                    editor: entity.editor,                          // Editor add
                    status: entity.status,
                    reasonForRefusing: entity.reasonForRefusing,    // Editor add
                    postDate: entity.postDate,                      // Editor add
                    categoryMain: entity.categoryMain,              // Update
                    categorySub: entity.categorySub,                // Update
                    views: 0,                                       // Guest add
                    smallAvatar: entity.smallAvatar,                // Update
                    bigAvatar: entity.bigAvatar,                    // Update
                    arrayOfTags: entity.arrayOfTags,                // Update
                    isPremiumArticle: entity.isPremiumArticle,      // Update
                    comment: entity.comment                         // Guest add
                })

                // Tạo kết nối tới database
                // let connection = require('../utils/db.connection');

                obj.save((err, succ) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        console.log(err);
                        resolve(succ);
                    }
                })
            })
                .catch(err => {
                    console.log(err);
                })

        });
    },

    findById: (id) => {
        return new Promise((resolve, reject) => {
            baibao.findById(id)
            .populate('arrayOfTags', 'tagName')
            .populate('categorySub','categoryName')
            .exec((err, succ) => {
                if (err)
                    reject(err);
                else
                    resolve(succ);
            })
        });
    },

    findByIdAndUpdate: (entity, writer) => {
        return new Promise((resolve, reject) => {
            categorySub.findDad(entity.categorySub).then(succ => {
                entity.categoryMain = succ.categoryMainID.id;
                // console.log(entity.arrayOfTags);
                var obj = {
                    title: entity.title,
                    content: entity.content,
                    abstract: entity.abstract,
                    //writeDate: entity.writeDate,
                    writer: writer,
                    editor: entity.editor,                          // Editor add
                    status: "notApproved",
                    reasonForRefusing: entity.reasonForRefusing,    // Editor add
                    postDate: entity.postDate,                      // Editor add
                    categoryMain: entity.categoryMain,              // Update
                    categorySub: entity.categorySub,                // Update
                    //views: entity.views,                            // Guest add
                    smallAvatar: entity.smallAvatar,                // Update
                    bigAvatar: entity.bigAvatar,                    // Update
                    arrayOfTags: entity.arrayOfTags,                // Update
                    isPremiumArticle: entity.isPremiumArticle,      // Update
                    comment: entity.comment                         // Guest add
                };

                baibao.findByIdAndUpdate(entity._articleID, obj).exec((err, succ) => {
                    if (err)
                        reject(err);
                    else {
                        console.log(err);
                        resolve(succ);
                    }
                })
            })
                .catch(err => {
                    console.log(err);
                })

        });
    },

    deleteOne: (conditionObject) => {
        return baibao.deleteOne(conditionObject).exec();
    },

    // Trang chủ
    findTop10: () => {
        return new Promise((resolve, reject) => {
            var recentDate = new Date();
            
            baibao.find({
                status: "approved",
                postDate: {'$lt': recentDate}
                //filter
            },
                ['_id', 'title', 'bigAvatar', 'smallAvatar', 'categorySub', 'writeDate', 'postDate', 'views'],
                {
                    skip: 0,
                    limit: 10,
                    sort: {
                        views: -1
                    }
                })
                .populate('categorySub', '_id categoryName')
                .exec((err, succ) => {
                    if (err)
                        reject(err);
                    else
                        resolve(succ);
                })
        });
    },


    findArticleTopCate: (top) => {
        return new Promise((resolve, reject) => {
            var recentDate = new Date();
            
            categorySub.findTopCategory(top).then(ID => {
                baibao.findOne(
                    { categorySub: ID,
                      status: "approved",
                      postDate: {'$lt': recentDate} },
                    ['_id', 'title', 'bigAvatar', 'smallAvatar', 'categorySub', 'writeDate', 'postDate', 'views'],
                    {
                        skip: 0,
                        limit: 1,
                        sort: {
                            views: -1
                        }
                    }).populate('categorySub', '_id categoryName')
                    .exec((err, succ) => {
                        if (err)
                            reject(err);
                        else {
                            // console.log("get one article" + succ);
                            resolve(succ);
                        }
                    })
            })
        })
    },

    findNewest: () => {
        return new Promise((resolve, reject) => {
            var recentDate = new Date();
            // recentDate.removeMinutes(minutesSinceLast);
            baibao.find({
                //filter   
                status: "approved",
                postDate: {'$lt': recentDate}
            },
                ['_id', 'title', 'smallAvatar', 'bigAvatar', 'categorySub', 'writeDate', 'postDate', 'views'],
                {
                    skip: 0,
                    limit: 10,
                    sort: {
                        postDate: -1
                    }
                })
                .populate('categorySub', '_id categoryName')
                .exec((err, succ) => {
                    if (err)
                        reject(err);
                    else
                        resolve(succ);
                })
        });
    },

    findNewestCate: (idCate) => {
        return new Promise((resolve, reject) => {
            var recentDate = new Date();
            baibao.find({
                //filter 
                status: "approved",
                postDate: {'$lt': recentDate},  
                categorySub : idCate
            },
                ['_id', 'title', 'smallAvatar', 'bigAvatar', 'categorySub', 'writeDate', 'postDate', 'views'],
                {
                    skip: 0,
                    limit: 5,
                    sort: {
                        postDate: -1
                    }
                })
                .populate('categorySub', '_id categoryName')
                .exec((err, succ) => {
                    if (err)
                        reject(err);
                    else
                        resolve(succ);
                })
        });
    },
    
    increaseView: (id) => {
        return new Promise((resolve, reject) => {
            baibao.findByIdAndUpdate(id, {
                $inc: {views: 1}
            })           
            .exec((err, succ) => {
                if (err)
                    reject(err);
                else
                    resolve(succ);
            })
        });
    },

    addComment: (id, entity) => {
        return new Promise((resolve, reject) => {
            
                var obj = {
                    nameUser : entity.name,
                    email: entity.email,
                    content: entity.message,
                    commentDate: new Date().toLocaleString(),
                };
             
                baibao.findById(id).exec((err, succ) => {
                    //console.log(succ);
                    succ.comments.push(obj);
                    succ.save(function(err){
                        if (err)
                            reject(err);
                        else {
                            resolve(succ);
                    }
                    });
                    console.log(err);
                 });

        });
    },

    findByCategorySub: (idCateSub, limit, offset) => {
        return new Promise((resolve, reject) => {
                var recentDate = new Date();
            baibao.find({
                status: "approved",
                postDate: {'$lt': recentDate},
                categorySub: idCateSub
            },
                ['_id', 'title', 'bigAvatar', 'smallAvatar','categoryMain','categorySub', 'writeDate', 'postDate', 'views','abstract','arrayOfTags','isPremiumArticle'],
                {
                    skip: offset,
                    limit: limit,
                    sort: {
                        postDate: -1
                    }
                })
                .populate('categorySub', '_id categoryName')
                .populate('categoryMain','_id categoryName')
                .populate('arrayOfTags','tagName')
                .exec((err, succ) => {
                    if (err)
                        reject(err);
                    else
                        resolve(succ);
                })
        });
    },

    findPreFirstCategorySub: (idCateSub, limit, offset) => {
        return new Promise((resolve, reject) => {
                var recentDate = new Date();
            baibao.find({
                status: "approved",
                postDate: {'$lt': recentDate},
                categorySub: idCateSub
            },
                ['_id', 'title', 'bigAvatar', 'smallAvatar','categoryMain','categorySub', 'writeDate', 'postDate', 'views','abstract','arrayOfTags','isPremiumArticle'],
                {
                    skip: offset,
                    limit: limit,
                    sort: {
                        isPremiumArticle: -1,
                        postDate: -1
                    }
                })
                .populate('categorySub', '_id categoryName')
                .populate('categoryMain','_id categoryName')
                .populate('arrayOfTags','tagName')
                .exec((err, succ) => {
                    if (err)
                        reject(err);
                    else
                        resolve(succ);
                })
        });
    },

    countByCategorySub: (idCateSub) => {
        return new Promise((resolve, reject) => {
            var recentDate = new Date();
            baibao.countDocuments({
                status: "approved",
                postDate: {'$lt': recentDate},
                categorySub: idCateSub
            })
                .exec((err, succ) => {
                    if (err)
                        reject(err);
                    else
                        resolve(succ);
                })
        })
    },

    findByCategoryMain: (idCateMain, limit, offset) => {
        return new Promise((resolve, reject) => {
            var recentDate = new Date();
            baibao.find({
                status: "approved",
                postDate: {'$lt': recentDate},
                categoryMain: idCateMain
            },
                ['_id', 'title', 'bigAvatar', 'smallAvatar','categoryMain','categorySub', 'writeDate', 'postDate', 'views','abstract','arrayOfTags','isPremiumArticle'],
                {
                    skip: offset,
                    limit: limit,
                    sort: {
                        postDate: -1
                    }
                })
                .populate('categorySub', '_id categoryName')
                .populate('categoryMain','_id categoryName')
                .populate('arrayOfTags','tagName')
                .exec((err, succ) => {
                    if (err)
                        reject(err);
                    else
                        resolve(succ);
                })
        });
    },

    findPreFirstCategoryMain: (idCateMain, limit, offset) => {
        return new Promise((resolve, reject) => {
            var recentDate = new Date();
            baibao.find({
                status: "approved",
                postDate: {'$lt': recentDate},
                categoryMain: idCateMain
            },
                ['_id', 'title', 'bigAvatar', 'smallAvatar','categoryMain','categorySub', 'writeDate', 'postDate', 'views','abstract','arrayOfTags'],
                {
                    skip: offset,
                    limit: limit,
                    sort: {
                        isPremiumArticle: -1,
                        postDate: -1
                    }
                })
                .populate('categorySub', '_id categoryName')
                .populate('categoryMain','_id categoryName')
                .populate('arrayOfTags','tagName')
                .exec((err, succ) => {
                    if (err)
                        reject(err);
                    else
                        resolve(succ);
                })
        });
    },

    countByCategoryMain: (idCateMain) => {
        return new Promise((resolve, reject) => {
                var recentDate = new Date();
            baibao.countDocuments({
                status: "approved",
                postDate: {'$lt': recentDate},
                categoryMain: idCateMain
            })
                .exec((err, succ) => {
                    if (err)
                        reject(err);
                    else
                        resolve(succ);
                })
        })
    },

    search: (text, limit, offset) => {
        return new Promise((resolve, reject) => {
            var recentDate = new Date();
            
            baibao.find({
                $text: { $search: text },
                status: "approved",
                postDate: {'$lt': recentDate}
            },
            ['_id', 'title', 'bigAvatar', 'smallAvatar', 'categoryMain', 'categorySub', 'writeDate', 'postDate', 'views', 'abstract','arrayOfTags','isPremiumArticle'],
            {
                skip: offset,
                limit: limit,
                sort: {
                    postDate: -1
                }
            })
            .populate('categoryMain', 'categoryName')
            .populate('categorySub', 'categoryName')
            .populate('arrayOfTags','tagName')
            .exec((err, succ) => {
                if (err)
                    reject(err);
                else
                    resolve(succ);
            })
        })
    },

    searchPreFirst: (text, limit, offset) => {
        return new Promise((resolve, reject) => {
            var recentDate = new Date();
            
            baibao.find({
                $text: { $search: text },
                status: "approved",
                postDate: {'$lt': recentDate}
            },
            ['_id', 'title', 'bigAvatar', 'smallAvatar', 'categoryMain', 'categorySub', 'writeDate', 'postDate', 'views', 'abstract','arrayOfTags','isPremiumArticle'],
            {
                skip: offset,
                limit: limit,
                sort: {
                    isPremiumArticle: -1,
                    postDate: -1
                }
            })
            .populate('categoryMain', 'categoryName')
            .populate('categorySub', 'categoryName')
            .populate('arrayOfTags','tagName')
            .exec((err, succ) => {
                if (err)
                    reject(err);
                else
                    resolve(succ);
            })
        })
    },

    countsearch: (text) => {
        return new Promise((resolve, reject) => {
            var recentDate = new Date();
            baibao.countDocuments({
                $text: { $search: text },
                status: "approved",
                postDate: {'$lt': recentDate}
            })
            .exec((err, succ) => {
                if (err)
                    reject(err);
                else
                    resolve(succ);
            })
        })
    },

    findByTag: (idTag, limit, offset) => { 
        return new Promise((resolve, reject) => {
            var recentDate = new Date();
            baibao.find({            
                status: "approved",
                postDate: {'$lt': recentDate},
                arrayOfTags : mongoose.Types.ObjectId(idTag)
            },
                ['_id', 'title', 'bigAvatar', 'smallAvatar','categoryMain','categorySub', 'writeDate', 'postDate', 'views','abstract','arrayOfTags','isPremiumArticle'],
                {
                    skip: offset,
                    limit: limit,
                    sort: {
                        postDate: -1
                    }
                })
                .populate('categorySub', '_id categoryName')
                .populate('categoryMain','_id categoryName')
                .populate('arrayOfTags','tagName')
                .exec((err, succ) => {
                    if (err)
                        reject(err);
                    else
                        resolve(succ);
                })
        });
    },

    findPreFirstByTag: (idTag, limit, offset) => { 
        return new Promise((resolve, reject) => {
            var recentDate = new Date();
            baibao.find({            
                status: "approved",
                postDate: {'$lt': recentDate},
                arrayOfTags : mongoose.Types.ObjectId(idTag)
            },
                ['_id', 'title', 'bigAvatar', 'smallAvatar','categoryMain','categorySub', 'writeDate', 'postDate', 'views','abstract','arrayOfTags','isPremiumArticle'],
                {
                    skip: offset,
                    limit: limit,
                    sort: {
                        isPremiumArticle: -1,
                        postDate: -1
                    }
                })
                .populate('categorySub', '_id categoryName')
                .populate('categoryMain','_id categoryName')
                .populate('arrayOfTags','tagName')
                .exec((err, succ) => {
                    if (err)
                        reject(err);
                    else
                        resolve(succ);
                })
        });
    },

    countByTag: (idTag) => {
        return new Promise((resolve, reject) => {
            var recentDate = new Date();
                 
               
            baibao.countDocuments({
                status: "approved",
                postDate: {'$lt': recentDate},
                arrayOfTags: mongoose.Types.ObjectId(idTag)
            })
                .exec((err, succ) => {
                    if (err)
                        reject(err);
                    else
                        resolve(succ);
                })
        })
    },

}