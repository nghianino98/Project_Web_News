const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userChema = Schema({
    name: {type: String, required: true},
    //role: {type: String, required: true},
    email: {type: String, requied: true},
    password: {type: String, required: true},
    phoneNumber: {type: String, requied: true},
    //birthday: {type: Date, requied: true},
    //status: {type: Number, default: 1}
});

module.exports = mongoose.model('User', userChema);