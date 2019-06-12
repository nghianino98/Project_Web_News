const speakeasy = require('speakeasy');
const mailer = require('../config/mail');

module.exports = {
    getVerifyObject: () => {
        const secret = speakeasy.generateSecret({length: 20}).base32;
        return {
            secret: secret,
            token: speakeasy.totp({
                secret: secret,
                encoding: 'base32'
            })
        }
    },

    verify: (token, secret, expiresIn, ) => {
        return speakeasy.totp.verify({
            secret: secret,
            token: token,
            encoding: 'base32',
            window: expiresIn * 2
        });
    },

    sendOTPViaMail: (email, expiresIn, OTP) => {
        // Cấu hình thư gửi
        const mailOptions = {
            from: '"NewsFeed" <newsfeed.notification.k16@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Quên mật khẩu",
            html: `Mã OTP của bạn là <strong>${OTP}</strong> (chỉ tồn tại trong ${expiresIn} phút)`
        };

        // Gửi mail xác nhận
        return mailer.sendMail(mailOptions);
    }
}