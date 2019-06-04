const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mailer = require('../config/mail');
const jwt = require('jsonwebtoken');

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
    User.findOne({email: email})
        .exec()
        .then(user => {
            if (user) {
                return done (null, false, {message: 'Địa chỉ email đã tồn tại'});
            }
            
            bcrypt.hash(password, 5, (err, hash) => {
                if (err) {
                    return done(err);
                }

                // Tạo tài khoảng
                const newUser = new User({
                    email: email,
                    password: hash,
                    userName: req.body.name,
                    phoneNumber: req.body.phoneNumber,
                    dob: new Date(+req.body.year, +req.body.month - 1, +req.body.day),
                    gender: req.body.gender,
                });

                // Lưu tài khoảng vào db
                newUser.save()
                    .then(result => {
                        setTimeout(() => {
                            User.deleteOne({_id: result._id, isConfirm: false})
                                .exec();
                        }, 15 * 60 * 1000);

                        // Tạo mã xác nhận
                        const token = jwt.sign({
                            email: email,
                            id: result.id,
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

                        return done(null, newUser);
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
    User.findOne({email: email})
        .exec()
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

                if (!user.status) {
                    return done(null, false, {message: 'Tài khoảng chưa được kích hoạt'});
                }

                return done(null, user);
           });
        })
        .catch(err => {
            done(err);
        });
}));
