const nodemailer = require('nodemailer');

const  transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'newsfeed.notification.k16@gmail.com',
        pass: 'fithcmusk16'
    }
});

module.exports = transporter;