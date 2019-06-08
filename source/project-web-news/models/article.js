const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var articleSchema = Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    abstract: { type: String, required: true },
    writeDate: { type: Date},
    writer: Schema.Types.ObjectId,
    editor: Schema.Types.ObjectId,
    // status: {type: Boolean },
    status: {
        type: String,
        enum: ['approved', 'published', 'rejected', 'notApproved', 'draft'],
        default: 'notApproved'
    },
    reasonForRefusing: { type: String },
    postDate: { type: Date },
    categoryMain: Schema.Types.ObjectId,
    categorySub: Schema.Types.ObjectId,
    views: { type: Number, default: 0 },
    smallAvatar: { type: String, default: '/images/news_thumbnail2.jpg' },
    bigAvatar: { type: String, default: '/images/photograph_img2.jpg' },
    arrayOfTags: Schema.Types.ObjectId,
    isPremiumArticle: { type: String },
    comment: [JSON],
})



// module.exports = mongoose.model('Article', articleSchema);

module.exports = {
    add: (entity, writer) => {
        return new Promise((resolve, reject) => {

            var baibao = mongoose.model('Articles', articleSchema);

            var obj = new baibao({
                title: entity.title,
                content: entity.content,
                abstract: entity.abstract,
                writeDate: Date.now(),
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
                if (err){
                    reject(err);
                }
                else {
                    resolve(succ);
                }
            })
        });
    }
}