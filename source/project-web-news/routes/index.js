var express = require('express');
var router = express.Router();

const categoryMain = require('../models/categoryMain');
const categorySub = require('../models/categorySub');

/* GET home page. */
router.get('/',(req, res, next) =>{
      categoryMain.findSub()
        .then(succ=>{
          console.log(succ);
          res.render('index', {
            title: 'Express',
           //  layout: 'news-layouts',
            listCateMain: succ });
        })
        .catch(err=>{
          console.log(err);
        })
  });
router.get('/single-page', (req, res, next) => {
  res.render("single_page");
});

router.get('/list-articles', (req, res, next) => {
  res.render('list_articles');
});

router.get('/list-articles/category/:id', (req, res, next) => {
  categoryMain.findSub()
        .then(succ=>{
          console.log(succ);
          res.render('list_articles', {
            title: 'Express',
           //  layout: 'news-layouts',
            listCateMain: succ });
        })
        .catch(err=>{
          console.log(err);
        })
});

router.get('/contact', (req, res, next) => {
  res.render('contact');
});

module.exports = router;
