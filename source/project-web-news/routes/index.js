var express = require('express');
var router = express.Router();

const categoryMain = require('../models/categoryMain');
const categorySub = require('../models/categorySub');

/* GET home page. */
router.get('/', function(req, res, next) {
  categoryMain.find().then(succ=>{
    let listCateMain = succ;
    console.log(listCateMain);
  })
  .catch(err=>{
    console.log(err);
  })
  res.render('index', { title: 'Express' });
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
