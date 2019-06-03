const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.cookies['Authorization'];

        if (!token) {
            req.flash('error', 'Mời bạn đăng nhập trước khi truy cập');
            return res.redirect('/user/login');
        }

        const decode = jwt.decode(token.split(' ')[1], 'fit-hcmus');
        req.userData = decode;
    } catch(err) {
        req.flash('error', err.message);
        return res.redirect('/user/login');
    }

    next();
}