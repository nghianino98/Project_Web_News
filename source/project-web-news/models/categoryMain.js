const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var categorySchema = Schema({
    categoryName: {type: String},
    arrayOfArticles: [Schema.Types.ObjectId],
    arrayOfCategorySub: [Schema.Types.ObjectId]
})

module.exports = mongoose.model('Category', categoryChema);