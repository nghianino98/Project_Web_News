const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
                    resolve(succ);
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