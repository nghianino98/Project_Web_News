const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var articleSchema = Schema({
    title: {type: String},
    content: {type: String},
    abstract: {type: String},
    writeDate: {type: Date},
    writer: Schema.Types.ObjectId,
    editor: Schema.Types.ObjectId,
    status: {type: Boolean },
    reasonForRefusing: {type: String},
    postDate: {type: Date},
    categoryMain: Schema.Types.ObjectId,
    categorySub: Schema.Types.ObjectId,
    views:{type: Number},
    smallAvatar: {type: String, default: '/images/news_thumbnail2.jpg'},
    bigAvatar: {type: String, default: '/images/photograph_img2.jpg'},
    arrayOfTags: Schema.Types.ObjectId,
    isPremiumArticle: {type: String},
    comment:[JSON],
})

module.exports = mongoose.model('Article', articleSchema);