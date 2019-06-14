const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var tagSchema = Schema({
    tagName: {type: String},
    arrayOfArticles: [Schema.Types.ObjectId]
})

module.exports = mongoose.model('Tag', tagSchema);