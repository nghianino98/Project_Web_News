const jwt = require('../FunctionHelper/jwt');

module.exports = (req, res, next) => {
    if (!req.user) {
        req.flash('error', 'Mời bạn đăng nhập trước khi truy cập');
        return res.redirect('/user/login');
    }

    next();
}