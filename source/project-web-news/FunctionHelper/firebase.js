const {bucket} = require('../config/google-storage');

exports.uploadImageToStorage = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('!No image file');
        }
    
        let newFileName = new Date().toUTCString().replace(/:/g, '-') + '-' + file.originalname;
        let fileUpload = bucket.file(newFileName);
        //console.log(bucket);
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        blobStream.on('error', (err) => {
            reject(err);
        });

        blobStream.on('finish', () => {
            const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
            resolve(url);
        });

        blobStream.end(file.buffer);
    });
    
}