const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = Schema({
    userName: {type: String},
    role: {
        type: String,
        enum: ['admin', 'writer', 'editor', 'subscriber' , 'guest'],
        default: 'subscriber'
    },
    fbId: {type: String},
    email: {type: String, requied: true},
    account: {type: String, requied: true},
    password: {type: String, required: true},
    dob: {type: Date, requied: true},
    expire: {type: Date},
    categoryEditor: [{type: Schema.Types.ObjectId, ref: 'CategorySubs'}],
    pseudonym: {type: String, default: 'anonymous'},
    gender: {type: Boolean},
    isConfirm: {type: Boolean, default: false},
    phoneNumber: {type: String},
    avatar: {type: String, default:'/images/user.jpg'},
    status: {
        type: String,
        enum: ['Protected', 'Enabled', 'Banned'],
        default: 'Enabled'
    },
    //For UI   
});

const User = mongoose.model('User', userSchema);

module.exports = {
    saveFacebookAccount: (entity, hash) => {
        let user = new User({
            account: mongoose.Types.ObjectId().toHexString(),
            email: 'Facebook không cho lấy email từ app develop',
            password: hash,
            userName: entity.userName,
            fbId: entity.fbId,
            dob: new Date(2000, 0, 1),
            isConfirm: true,
            expire: new Date().setDate(new Date().getDate() + 7)
        });

        return user.save();
    },

    findByFbId: (fbId) => {
        return User.findOne({fbId: fbId}).exec();
    },

    getUserAndCategoryEditorById: (id) => {
        return User.findOne({_id: id}).populate('categoryEditor', 'categoryName').exec();
    },

    findAll:() =>{
        return new Promise((resolve, reject) => {
            User.find().exec((err, succ) => {
                if (err)
                    reject(err);
                else
                    resolve(succ);
            })
        });
    },

    saveAccountIsConfirmed: (entity, passwordHash) => {
        var user = new User({
            account: entity.account,
            email: entity.email,
            password: passwordHash,
            userName: entity.name,
            phoneNumber: entity.phoneNumber,
            dob: new Date(+entity.year, +entity.month - 1, +entity.day),
            gender: entity.gender,
            isConfirm: true,
            role: entity.role,
            expire: new Date().setDate(new Date().getDate() + 7)
        });

        return user.save();
    },

    save: (entity, passwordHash) => {
        var user = new User({
            account: entity.account,
            email: entity.email,
            password: passwordHash,
            userName: entity.name,
            phoneNumber: entity.phoneNumber,
            dob: new Date(+entity.year, +entity.month - 1, +entity.day),
            gender: entity.gender,
            expire: new Date().setDate(new Date().getDate() + 7)
        });

        return user.save();
    },

    findById: (id) => {
        return User.findOne({_id: id}).exec();
    },

    findOneByAccount: (account) => {
        return User.findOne({account: account}).exec();
    },

    findOneByEmail: (email) => {
        return User.findOne({email: email}).exec();
    },

    deleteOne: (conditionObject) => {
        return User.deleteOne(conditionObject).exec();
    },

    update: (conditionObject, properies) => {
        return User.update(conditionObject, {$set: properies}).exec();
    },

    findAllExceptId: (id) => {
        return User.find({_id: {$nin: id}}).populate('categoryEditor', 'categoryName').exec();
    }
}