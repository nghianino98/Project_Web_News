const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mailer = require('../config/mail');
const jwt = require('jsonwebtoken');

module.exports = (app) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    });

    // Kịch bản đăng ký thông thường
    passport.use('local.signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, done) => {
        User.findOneByEmail(email)
            .then(user => {
                if (user) {
                    return done (null, false, {message: 'Địa chỉ email đã tồn tại'});
                }
                
                bcrypt.hash(password, 5, (err, hash) => {
                    if (err) {
                        return done(err);
                    }

                    // Lưu tài khoảng vào db
                    User.save(req.body, hash)
                        .then(result => {
                            setTimeout(() => {
                                User.deleteOne({_id: result._id, isConfirm: false})
                            }, 15 * 60 * 1000);

                            // Tạo mã xác nhận
                            const token = jwt.sign({
                                email: email,
                                id: result.id,
                                role: result.role,
                                avatar: result.avatar,
                                userName: result.userName
                            }, 'fit-hcmus', {
                                expiresIn: 15 * 60
                            });

                            const url = `localhost:3000/user/confirm/${token}`;

                            // Cấu hình thư gửi
                            const mailOptions = {
                                from: '"NewsFeed" <test@test.com>', // sender address
                                to: email, // list of receivers
                                subject: "Xác thực email",
                                text: 'Click vào link sau để xác thực tài khoản tại trang web NewsFeed',
                                html: `<a href="${url}">${url}</a>`
                            };

                            // Gửi mail xác nhận
                            mailer.sendMail(mailOptions)
                                .catch(err => {
                                    done(err);
                                });

                            return done(null, result);
                        })
                        .catch(err => {
                            return done(err);
                        });
                });

            })
            .catch(err => {
                return done(err);
            });
    }));

    // Kịch bản đăng nhập thông thường
    passport.use('local.login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, done) => {
        User.findOneByEmail(email)
            .then(user => {
                if (!user) {
                    return done(null, false, {message: 'Địa chỉ email không tồn tại'});
                }

            bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        return done(err);
                    }

                    if (!result) {
                        return done(null, false, {message: 'Mật khẩu không đúng'});
                    }

                    if (!user.isConfirm) {
                        return done(null, false, {message: 'Tài khoảng chưa được kích hoạt'});
                    }

                    return done(null, user);
            });
            })
            .catch(err => {
                done(err);
            });
    }));

    app.use(passport.initialize());
    app.use(passport.session());
}