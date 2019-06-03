const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

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

                const newUser = new User({
                    email: email,
                    password: hash,
                    name: req.body.name,
                    phoneNumber: req.body.phoneNumber
                });

                newUser.save()
                    .then(result => {
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

                return done(null, user);
           });
        })
        .catch(err => {
            done(err);
        });
}));
