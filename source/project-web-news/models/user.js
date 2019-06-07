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


module.exports = mongoose.model('User', userSchema);