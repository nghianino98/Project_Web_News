const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var categorySubSchema = Schema({
    categoryName: {type: String},
    arrayOfArticles: [Schema.Types.ObjectId],
    categoryMain: Schema.Types.ObjectId
})

module.exports = mongoose.model('CategorySub', categorySubSchema);