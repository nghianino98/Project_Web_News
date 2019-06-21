const jwt = require('../FunctionHelper/jwt');

module.exports = (req, res, next) => {
    try {
        const token = req.cookies['Authorization'];
        
        if (!token) {
            return next();
        }

        const decode = jwt.decodeJWT(token.split(' ')[1], 'fit-hcmus');
        req.user = decode;
    } catch(err) {

    } 

    next();
}