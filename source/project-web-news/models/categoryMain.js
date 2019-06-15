const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var categorySchema = Schema({
    categoryName: {
        type: String
    },
    arrayOfArticles: [Schema.Types.ObjectId],
    arrayOfCategorySub: [{type:Schema.Types.ObjectId,ref:'CategorySubs',require: true}]
})

const categoryMain = mongoose.model('CategoryMains', categorySchema);

module.exports = {
    add: (entity) => {
        return new Promise((resolve, reject) => {
            var obj = new categoryMain({
                categoryName: entity.category_name,
                arrayOfArticles: [],
                arrayOfCategorySub: []
            })

            obj.save((err, succ) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(succ);
                }
            })
        });
    },
    find: () => {
        return new Promise((resolve, reject) => {
            categoryMain.find().exec((err, succ) => {
                if (err)
                    reject(err);
                else
                    resolve(succ);
            })
        });
    },

    findByCategoryName: (category) => {
        return new Promise((resolve, reject) => {
            categoryMain.findOne({
                "categoryName": category
            }).exec((err, succ) => {
                if (err)
                    reject(err);
                else
                    resolve(succ);
            })
        });
    },

    findById: (id) => {
        return new Promise((resolve, reject) => {
            categoryMain.findById(id).exec((err, succ) => {
                if (err)
                    reject(err);
                else
                    resolve(succ);
            })
        });
    },

    findByIdAndDelete: (id) => {
        return new Promise((resolve, reject) => {
            categoryMain.findByIdAndDelete(id).exec((err, succ) => {
                if (err)
                    reject(err);
                else
                    resolve(succ);
            })
        });
    },

    findByIdAndDeletePre: (id) => {
        return new Promise((resolve, reject) => {
            categoryMain.findById(id).exec((err, succ) => {
                if (err)
                    reject(err);
                else {
                    console.log(succ.arrayOfCategorySub);

                    succ.arrayOfCategorySub.forEach(element => {
                        categorySub = require('../models/categorySub');
                        categorySub.deleteCategoryMain(element);
                    });

                    categoryMain.findByIdAndDelete(id).exec((err, succ) => {
                        if (err)
                            reject(err);
                        else
                            resolve(succ);
                    });
                };
            })
        });
    },

    findByIdAndDeleteSub: (mainID, subID) => {
        return new Promise((resolve, reject) => {
            categoryMain.findById(mainID).exec((err, succ) => {
                if (err)
                    reject(err);
                else {
                    if (succ !== null) {
                        succ.arrayOfCategorySub.splice(succ.arrayOfCategorySub.indexOf(subID), 1);

                        succ.save((err, succ) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(succ);
                            }
                        })
                    }

                    resolve(succ);
                }
            })
        })
    },


    findByIdAndUpdate: (id, category_name) => {
        return new Promise((resolve, reject) => {
            categoryMain.findByIdAndUpdate(id, {
                $set: {
                    categoryName: category_name
                }
            }).exec((err, succ) => {
                if (err)
                    reject(err);
                else
                    resolve(succ);
            })
        });
    },

    //Thêm chuyên mục con
    addCategorySub: (mainID, subID) => {
        return new Promise((resolve, reject) => {
            categoryMain.findById(mainID).exec((err, succ) => {
                if (err)
                    reject(err);
                else {
                    let objectCateMain = succ;
                    //console.log("object Main" + objectCateMain);
                    objectCateMain.arrayOfCategorySub.push(subID);
                    objectCateMain.save((err, succ) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(succ);
                        }
                    })
                }
            })
        })
    }

}