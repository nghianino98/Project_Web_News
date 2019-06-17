var express = require('express');
var router = express.Router();

const categoryMain = require('../models/categoryMain');
const categorySub = require('../models/categorySub');
const articles = require('../models/article');

/* GET home page. */
router.get('/', (req, res, next) => {

  // categoryMain.findSub()
  //   .then(succ=>{
  //     console.log(succ);
  //     res.render('index', {
  //       title: 'Express',
  //       listCateMain: succ });
  //   })
  //   .catch(err=>{
  //     console.log(err);
  //   })

  let intlData = {
    "locales": "en-US"
  };


  Promise.all([categoryMain.findSub(),articles.findTop10(),articles.findNewest(),articles.findTop10Category()]).then(values =>{
    // console.log(values);
    let listCateMain = values[0];
    let top10Articles = values[1];
    let newestArticles = values[2];
    let top4Articles = top10Articles.slice(0,4);
    let temp = values[3];
    let Top10CategoryLeft = temp.slice(0,5);
    let Top10CategoryRight = temp.slice(5,10);
    //
    //
      res.render('index', {
        title: 'Express',
        Top10CategoryLeft: Top10CategoryLeft,
        Top10CategoryRight: Top10CategoryRight,
        listCateMain: listCateMain,
        top4Articles: top4Articles,
        newestArticles: newestArticles,
        top10Articles: top10Articles,
        data: {intl: intlData},
       });


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
    .then(succ => {
      console.log(succ);
      res.render('list_articles', {
        title: 'Express',
        //  layout: 'news-layouts',
        listCateMain: succ
      });
    })
    .catch(err => {
      console.log(err);
    })
});

router.get('/contact', (req, res, next) => {
  res.render('contact');
});

module.exports = router;
