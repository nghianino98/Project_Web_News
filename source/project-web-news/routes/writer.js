const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('writer/writer', {layout: 'writer-layout', title: 'writer'});
});

router.get('/waiting', (req, res, next) => {
    res.render('writer/writer-waiting', {layout: 'writer-layout', title: 'writer'});
});

router.get('/published', (req, res, next) => {
    res.render('writer/writer-published', {layout: 'writer-layout', title: 'writer'});
});

router.get('/deny', (req, res, next) => {
    res.render('writer/writer-deny', {layout: 'writer-layout', title: 'writer'});
});

router.get('/not-confirm', (req, res, next) => {
    res.render('writer/writer-not-confirm', {layout: 'writer-layout', title: 'writer'});
});

module.exports = router;