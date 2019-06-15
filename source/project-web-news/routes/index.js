var express = require('express');
var router = express.Router();

const categoryMain = require('../models/categoryMain');
const categorySub = require('../models/categorySub');

/* GET home page. */
router.get('/', function(req, res, next) {
  categoryMain.find().then(succ=>{
    let listCateMain = succ;

    listCateMain.forEach(function(value){
        console.log(value.populate("arrayOfCategorySub",""));
    })
    // console.log(listCateMain);
    res.render('index', {
       title: 'Express',
      //  layout: 'news-layouts',
       listCateMain: listCateMain });
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

router.get('/contact', (req, res, next) => {
  res.render('contact');
});

module.exports = router;
