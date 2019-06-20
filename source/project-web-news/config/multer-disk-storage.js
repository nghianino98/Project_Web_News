const multer = require('multer');
const mongoose = require('mongoose');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function(req, file, cb) {
        if (req.body.oldBigAvatar) {
            const filename = req.body.oldBigAvatar.split('\\')[2];
            console.log(filename);
            return cb(null, filename);
        }

        cb(null, mongoose.Types.ObjectId().toHexString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('File không hợp lệ'), false);
    }
}

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB
    },
    fileFilter: fileFilter
});

module.exports = upload;