const GoogleStorage = require('@google-cloud/storage').Storage;

const  storage = new GoogleStorage({
    projectId: 'news-feed-2168b',
    keyFilename: 'keyfile.json',
});

const bucket = storage.bucket('news-feed-2168b.appspot.com');
 
module.exports = {
    storage: storage,
    bucket: bucket
}