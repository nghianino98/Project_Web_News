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
    arrayOfTags: [Schema.Types.ObjectId],
    isPremiumArticle: { type: String },
    comments: [JSON],
})




// module.exports = mongoose.model('Article', articleSchema);

const baibao = mongoose.model('Articles', articleSchema);
const categorySub = require('./categorySub')

module.exports = {

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
                    views: entity.views,                            // Guest add
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
            baibao.findById(id).exec((err, succ) => {
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
                var obj = {
                    title: entity.title,
                    content: entity.content,
                    abstract: entity.abstract,
                    writeDate: entity.writeDate,
                    writer: writer,
                    editor: entity.editor,                          // Editor add
                    status: "notApproved",
                    reasonForRefusing: entity.reasonForRefusing,    // Editor add
                    postDate: entity.postDate,                      // Editor add
                    categoryMain: entity.categoryMain,              // Update
                    categorySub: entity.categorySub,                // Update
                    views: entity.views,                            // Guest add
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
            baibao.find({
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

    findBestInCate: (idCate) => {
        return new Promise((resolve, reject) => {
            baibao.find({
                //filter
                categorySub: idCate
            },
                ['_id', 'title', 'bigAvatar', 'smallAvatar', 'categorySub', 'writeDate', 'postDate', 'views'],
                {
                    skip: 0,
                    limit: 1,
                    sort: {
                        views: -1
                    }
                })
                .populate('categorySub', '_id categoryName')
                .exec((err, succ) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    else {
                        console.log("article " + succ);
                        resolve(succ);
                    }
                })
        })
    },

    findTop10Category: () => {
        return new Promise((resolve, reject) => {
            let result = [];
            categorySub.findTopCategory().then(listID => {
                console.log("list ID" + listID);
                
                let i = 0;
                for (i = 0; i < listID.length; i++) {
                    baibao.findOne(
                        { categorySub: listID[i] },
                        ['_id', 'title', 'bigAvatar', 'smallAvatar', 'categorySub', 'writeDate', 'postDate', 'views'],
                        {
                            skip: 0,
                            limit: 10,
                            sort: {
                                views: -1
                            }
                        }).populate('categorySub', '_id categoryName')
                        .exec((err, succ) => {
                            if (err)
                                reject(err);
                            else{
                                console.log("one article"+succ);
                                result.push(succ);
                            } 
                        })
                }
                
            })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
                resolve(result);
        })
    },

    findNewest: () => {
        return new Promise((resolve, reject) => {
            baibao.find({
                //filter   
            },
                ['_id', 'title', 'smallAvatar', 'categorySub', 'writeDate', 'postDate', 'views'],
                {
                    skip: 0,
                    limit: 10,
                    sort: {
                        writeDate: -1
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
}