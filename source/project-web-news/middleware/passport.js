const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mailer = require('../config/mail');
const jwt = require('../FunctionHelper/jwt');
const FacebookStrategy = require('passport-facebook').Strategy;

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
        usernameField: 'account',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, account, password, done) => {
        User.findOneByAccount(account)
            .then(user => {
                if (user) {
                    return done (null, false, {message: 'Tài khoản đã tồn tại.'});
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

                            const token = jwt.generateJWT(result, 'fit-hcmus', 15 * 60);
                            const url = `localhost:3000/user/confirm/${token}`;

                            // Cấu hình thư gửi
                            const mailOptions = {
                                from: '"NewsFeed" <newsfeed.notification.k16@gmail.com>', // sender address
                                to: req.body.email, // list of receivers
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
        usernameField: 'account',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, account, password, done) => {
        User.findOneByAccount(account)
            .then(user => {
                if (!user) {
                    return done(null, false, {message: 'Tài khoản không tồn tại.'});
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

    passport.use('facebook.login', new FacebookStrategy({
        clientID: '2311353459079848',
        clientSecret: 'a94e98e36c2d31b25b9d0107e8d6eb78',
        callbackURL: "/user/auth/facebook/callback",
      },
      function(accessToken, refreshToken, profile, done) {
        console.log('token: ' + accessToken);
        console.log(profile);
        done(null, profile);
        
      }
    ));

    app.use(passport.initialize());
    app.use(passport.session());
}