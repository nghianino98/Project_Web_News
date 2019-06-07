exports.isAdmin = (req, res, next) =>{
    if (req.user.role === 'admin') {
        return next();
    }

    res.redirect('/');
}

exports.isEditor = (req, res, next) =>{
    if (req.user.role === 'editor') {
        return next();
    }

    res.redirect('/');
}

exports.isWriter = (req, res, next) =>{
    if (req.user.role === 'writer') {
        return next();
    }

    res.redirect('/');
}

exports.isGuest = (req, res, next) =>{
    if (req.user.role === 'guest') {
        return next();
    }

    res.redirect('/');
}