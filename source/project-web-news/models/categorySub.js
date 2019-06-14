const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoryMain = require('../models/categoryMain');

var categorySubSchema = Schema({
    categoryName: {
        type: String
    },
    arrayOfArticles: [Schema.Types.ObjectId],
    categoryMain: {
        type: String
    },
    categoryMainID: Schema.Types.ObjectId
})

const categorySub = mongoose.model('CategorySubs', categorySubSchema);

module.exports = {
    add: (entity, id) => {
        return new Promise((resolve, reject) => {

            var obj = new categorySub({
                categoryName: entity.category_name,
                arrayOfArticles: [],
                categoryMain: entity.category_parent,
                categoryMainID: id
            })

            obj.save((err, succ) => {
                if (err) {
                    reject(err);
                } else {
                    // resolve(succ);
                    let subCateId = succ._id;
                    categoryMain.addCategorySub(id,subCateId).then(succ=>{
                        console.log(succ);
                        resolve(succ);
                    })
                    .catch(err=>{
                        console.log(err);
                        reject(err);
                    })
                }
            })
        });
    },
    find: () => {
        return new Promise((resolve, reject) => {
            categorySub.find().exec((err, succ) => {
                if (err)
                    reject(err);
                else
                    resolve(succ);
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


    findByIdAndDeletePre: (id) => {
        return new Promise((resolve, reject) => {
                categorySub.findById(id).exec((err,succ)=>{
                    if(err)
                        reject(err);
                    else{
                        categoryMain.findByIdAndDeleteSub(succ.categoryMainID,id).then(succ=>{
                            categorySub.findByIdAndDelete(id).exec((err, succ) => {
                                if (err)
                                    reject(err);
                                else
                                    resolve(succ);
                            })
                        })
                        .catch(err=>{
                            console.log(err);
                        })
                    }
                })
        });
    },

    findByIdAndUpdate: (id, category_name, category_parent, categoryparentId) => {
        return new Promise((resolve, reject) => {
            categorySub.findByIdAndUpdate(id, {
                $set: {
                    categoryName: category_name,
                    categoryMain: category_parent,
                    categoryMainID: categoryparentId
                }
            }).exec((err, succ) => {
                if (err)
                    reject(err);
                else
                    resolve(succ);
            })
        });
    }

}