const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = Schema({
    userName: {type: String},
    role: {
        type: String,
        enum: ['admin', 'writer', 'editor', 'subcriber' , 'guest'],
        default: 'guest'
    },
    email: {type: String, requied: true},
    account: {type: String},
    password: {type: String, required: true},
    dob: {type: Date, requied: true},
    TimeRemaining: {type: Date},
    CategoryEditor: [{type: String}],
    pseudonym: {type: String, default: 'anonymous'},
    gender: {type: Boolean},
    isConfirm: {type: Boolean, default: false},
    phoneNumber: {type: String},
    avatar: {type: String, default:'/images/user.png'},
    status: {
        type: String,
        enum: ['Protected', 'Enabled', 'Banned'],
        default: 'Enabled'
    },
    //For UI   
});

const User = mongoose.model('User', userSchema);

module.exports = {

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

    save: (entity, passwordHash) => {
        user = new User({
            account: entity.account,
            email: entity.email,
            password: passwordHash,
            userName: entity.name,
            phoneNumber: entity.phoneNumber,
            dob: new Date(+entity.year, +entity.month - 1, +entity.day),
            gender: entity.gender,
        });

        return user.save();
    },

    findById: (id) => {
        return User.find({_id: id}).exec();
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
    }
};