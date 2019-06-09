const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = Schema({
    userName: {type: String},
    role: {type: String, default: 'guest'},
    email: {type: String, requied: true},
    password: {type: String, required: true},
    dob: {type: Date, requied: true},
    TimeRemaining: {type: Date},
    CategoryEditor: [{type: String}],
    pseudonym: {type: String},
    gender: {type: Boolean},
    isConfirm: {type: Boolean, default: false},
    avatar: {type: String, default:'/images/user.png'}
});

const UserClass = mongoose.model('User', userSchema);

function User(entity){
    this.save = (entity, passwordHash) => {
        user = new UserClass({
            email: entity.email,
            password: passwordHash,
            userName: entity.name,
            phoneNumber: entity.phoneNumber,
            dob: new Date(+entity.year, +entity.month - 1, +entity.day),
            gender: entity.gender,
        });

        return user.save();
    };

    this.findById = (id) => {
        return UserClass.find({_id: id}).exec();
    };

    this.findOneByEmail = (email) => {
        return UserClass.findOne({email: email}).exec();
    };

    this.deleteOne = (conditionObject) => {
        return UserClass.deleteOne(conditionObject).exec();
    };

    this.update = (conditionObject, properies) => {
        return UserClass.update(conditionObject, {$set: properies}).exec();
    }
}

module.exports = new User();