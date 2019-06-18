const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var tagSchema = Schema({
    tagName: {type: String},
    arrayOfArticles: [Schema.Types.ObjectId]
})

const tag = mongoose.model('Tags', tagSchema);

module.exports = {

    add: (name) => {
        return new Promise((resolve, reject) => {
            var obj = new tag({
                tagName: name,
                arrayOfArticles: []
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
            tag.find().exec((err, succ) => {
                if (err)
                    reject(err);
                else
                    resolve(succ);
            })
        });
    },

    findByIdAndDelete: (id) => {
        return new Promise((resolve, reject) => {
            tag.findByIdAndDelete(id).exec((err, succ) => {
                if (err)
                    reject(err);
                else
                    resolve(succ);
            })
        });
    },

    findByIdAndUpdate: (id, name) => {
        return new Promise((resolve, reject) => {
            tag.findByIdAndUpdate(id, {
                $set: {
                    tagName: name
                }
            }).exec((err, succ) => {
                if (err)
                    reject(err);
                else
                    resolve(succ);
            })
        });
    },
}