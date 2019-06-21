const jwt = require('jsonwebtoken');

module.exports = {
    generateJWT: (user, secret_key, expiresIn) => {
        return jwt.sign({
            email: user.email,
            id: user.id,
            role: user.role,
            avatar: user.avatar,
            userName: user.userName,
            dob: user.dob,
            phoneNumber: user.phoneNumber,
            pseudonym: user.pseudonym,
            expire: user.expire,
            categoryEditor: user.categoryEditor
        }, secret_key, {
            expiresIn: expiresIn
        });
    },

    decodeJWT: (token, secret_key) => {
        return jwt.decode(token, secret_key);
    }
};