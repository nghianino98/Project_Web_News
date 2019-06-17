const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoryMain = require('../models/categoryMain');

var categorySubSchema = Schema({
    categoryName: {
        type: String
    },
    arrayOfArticles: [Schema.Types.ObjectId],
    categoryMainID: {
        type: Schema.Types.ObjectId,
        ref: 'CategoryMains',
        require: true
    }
})

const categorySub = mongoose.model('CategorySubs', categorySubSchema);


module.exports = {

    findAllExcept: (ids) => {
        return categorySub.find({_id: {$nin: id}}).exec();
    },

    findAll: () => {
        return categorySub.find().exec();
    },
    
    add: (entity, id) => {
        return new Promise((resolve, reject) => {

            var obj = new categorySub({
                categoryName: entity.category_name,
                arrayOfArticles: [],
                categoryMainID: id
            })

            obj.save((err, succ) => {
                if (err) {
                    reject(err);
                } else {
                    // resolve(succ);
                    let subCateId = succ._id;
                    categoryMain.addCategorySub(id, subCateId).then(succ => {
                            console.log(succ);
                            resolve(succ);
                        })
                        .catch(err => {
                            console.log(err);
                            reject(err);
                        })
                }
            })
        });
    },
    find: () => {
        return new Promise((resolve, reject) => {
            categorySub.find()
                //.select('categoryName')
                .populate('categoryMainID', 'categoryName')
                .exec((err, succ) => {
                    if (err)
                        reject(err);
                    else
                        resolve(succ);
                    //console.log(succ);
                })
        });
    },
    //Return ID catesub
    findTopCategory:()=>{
        return new Promise((resolve, reject) => {
            categorySub.find({},
                ['_id'],
                {
                    skip : 0,
                    limit : 10,
                }
            )
                .exec((err, arrayOfCate) => {
                    if (err)
                        reject(err);
                    else
                        resolve(arrayOfCate);
                })
        
        });
    },

    findDad: (id) => {
        return new Promise((resolve, reject) => {
            categorySub.findById({_id:id})
                //.select('categoryName')
                .populate('categoryMainID', 'categoryName')
                .exec((err, succ) => {
                    if (err)
                        reject(err);
                    else
                        resolve(succ);
                    //console.log(succ);
                })
        });
    },


    findAll: () => {
        return new Promise((resolve, reject) => {
            categorySub.find()
                .exec((err, succ) => {
                    if (err)
                        reject(err);
                    else
                        resolve(succ);
                    //console.log(succ);
                })
        });
    },


    


    findByIdAndDelete: (id) => {
        return new Promise((resolve, reject) => {
            categorySub.findByIdAndDelete(id).exec((err, succ) => {
                if (err)
                    reject(err);
                else
                    resolve(succ);
            })
        });
    },

    deleteCategoryMain: (id) => {
        return new Promise((resolve, reject) => {
            categorySub.findByIdAndUpdate(id, {
                $set: {
                    categoryMainID: null
                }
            }).exec((err, succ) => {
                if (err)
                    reject(err);
                else
                    resolve(succ);
            })
        });
    },

    findByIdAndDeletePre: (id) => {
        return new Promise((resolve, reject) => {
            categorySub.findById(id).exec((err, succ) => {
                if (err)
                    reject(err);
                else {
                    categoryMain.findByIdAndDeleteSub(succ.categoryMainID, id).then(succ => {
                            categorySub.findByIdAndDelete(id).exec((err, succ) => {
                                if (err)
                                    reject(err);
                                else
                                    resolve(succ);
                            })
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }
            })
        });
    },

    findByIdAndUpdate: (id, category_name, categoryparentId) => {
        return new Promise((resolve, reject) => {

            categorySub.findById(id).exec((err, succ) => {
                if (err)
                    reject(err);
                else {
                    
                    let oldCategoryMain = succ.categoryMainID;
                    if (oldCategoryMain === null) {

                        if (categoryparentId !== null) {
                            //Thêm chuyên mục con vào chuyên mục mới
                            categoryMain.addCategorySub(categoryparentId, id).then(succ => {
                                    resolve(succ);
                                })
                                .catch(err => {
                                    reject(err);
                                })

                            categorySub.findByIdAndUpdate(id, {
                                $set: {
                                    categoryName: category_name,
                                    categoryMainID: categoryparentId
                                }
                            }).exec((err, succ) => {
                                if (err)
                                    reject(err);
                                else
                                    resolve(succ);
                            });
                        } else {
                            categorySub.findByIdAndUpdate(id, {
                                $set: {
                                    categoryName: category_name,
                                }
                            }).exec((err, succ) => {
                                if (err)
                                    reject(err);
                                else
                                    resolve(succ);
                            });
                        }
                    } else if (oldCategoryMain.toString() === categoryparentId.toString()) {
                        categorySub.findByIdAndUpdate(id, {
                            $set: {
                                categoryName: category_name,
                            }
                        }).exec((err, succ) => {
                            if (err)
                                reject(err);
                            else
                                resolve(succ);
                        });

                    } else {
                        //Thêm chuyên mục con vào chuyên mục mới
                        categoryMain.addCategorySub(categoryparentId, id).then(succ => {
                                resolve(succ);
                            })
                            .catch(err => {
                                reject(err);
                            })

                        //Xóa chuyên mục con trong chuyên mục cha cũ
                        categoryMain.findByIdAndDeleteSub(oldCategoryMain, id).then(succ => {
                                resolve(succ);
                            })
                            .catch(err => {
                                reject(err);
                            })

                        categorySub.findByIdAndUpdate(id, {
                            $set: {
                                categoryName: category_name,
                                categoryMainID: categoryparentId
                            }
                        }).exec((err, succ) => {
                            if (err)
                                reject(err);
                            else
                                resolve(succ);
                        });
                    }

                    resolve(succ);
                }
            })
        });
    }

}