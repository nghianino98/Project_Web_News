var express = require('express');
var router = express.Router();

const categoryMain = require('../models/categoryMain');
const categorySub = require('../models/categorySub');
const articles = require('../models/article');
const tag = require('../models/tag');
const intlData = {
  "locales": "en-US",
    "formats": {
        "date": {
            "short": {
                "day": "numeric",
                "month": "long",
                "year": "numeric"
            }
        },
        "time": {
            "hhmm": {
                "hour": "numeric",
                "minute": "numeric"
            }
        },
        "relative": {
            "hours": {
                "units": "hour",
                "style": "numeric"
            }
        }
    }
};

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

 

  // let temp = articles.findTop10CategoryNew();

  // console.log( articles.findTop10CategoryNew());


  Promise.all([categoryMain.findSub()
              ,articles.findTop10()
              ,articles.findNewest()
              ,articles.findArticleTopCate(1)
              ,articles.findArticleTopCate(2)
              ,articles.findArticleTopCate(3)
              ,articles.findArticleTopCate(4)
              ,articles.findArticleTopCate(5)
              ,articles.findArticleTopCate(6)
              ,articles.findArticleTopCate(7)
              ,articles.findArticleTopCate(8)
              ,articles.findArticleTopCate(9)
              ,articles.findArticleTopCate(10)]).then(values =>{
    // console.log(values);
    let listCateMain = values[0];
    let top10Articles = values[1];
    let newestArticles = values[2];
    let top4Articles = top10Articles.slice(0,4);
    
    let articleTopCate1 = values[3];
    let articleTopCate2 = values[4];
    let articleTopCate3 = values[5];
    let articleTopCate4 = values[6];
    let articleTopCate5 = values[7];
    let articleTopCate6 = values[8];
    let articleTopCate7 = values[9];
    let articleTopCate8 = values[10];
    let articleTopCate9 = values[11];
    let articleTopCate10 = values[12];
    
    // let Top10CategoryLeft = temp.slice(0,5);
    // let Top10CategoryRight = temp.slice(5,10);

    //console.log(listCateMain);
 
      res.render('index', {
        title: 'Express',
        // Top10CategoryLeft: Top10CategoryLeft,
        // Top10CategoryRight: Top10CategoryRight,
         articleTopCate1 : articleTopCate1,
         articleTopCate2 : articleTopCate2,
         articleTopCate3 : articleTopCate3,
         articleTopCate4 : articleTopCate4,
         articleTopCate5 : articleTopCate5,
         articleTopCate6 : articleTopCate6,
         articleTopCate7 : articleTopCate7,
         articleTopCate8 : articleTopCate8,
         articleTopCate9 : articleTopCate9,
         articleTopCate10 : articleTopCate10,
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

  let idCate = req.params.id;

  let page = req.query.page || 1;

  if (page < 1) page = 1;

  let limit = 6;

  let offset = (page-1)*limit;

  Promise.all([
    categoryMain.findSub(),
    articles.findNewest(),
    articles.findTop10(),
    articles.findByCategorySub(idCate,limit,offset),
    articles.countByCategorySub(idCate)
  ]).then(([listCateMain,newestArticles,top10Articles,rows,count_rows])=>{
    

    let total = count_rows;
    let nPages = Math.floor(total/limit);
    if(total % limit > 0) nPages++;

    let pages = [];
    for(i=1;i<=nPages;i++){
      if(i > 1 && i < nPages)
        obj = {value:i, valuepre:i-1, valuenext: i+1  , active: i === +page};
      else if( i==1 ){
        if(nPages == 1){
          obj = {value:i, active: i === +page};
        }
        else {
          obj = {value:i, valuenext: i+1  , active: i === +page};
        }
      }   
      else if (i == nPages)
        obj = {value:i,  valuepre:i-1 , active: i === +page};
      pages.push(obj);
      
    }

    //console.log(pages);

    res.render('list_articles', {
      listCateMain,
      newestArticles,
      top10Articles,
      pages,
      listArticles: rows,
      title: 'Express',
      categorySub: true,
      data: {intl: intlData}
    });
  })
 
});

router.get('/list-articles/categorymain/:id', (req, res, next) => {

  let idCate = req.params.id;

  let page = req.query.page || 1;

  if (page < 1) page = 1;

  let limit = 6;

  let offset = (page-1)*limit;

  Promise.all([
    categoryMain.findSub(),
    articles.findNewest(),
    articles.findTop10(),
    articles.findByCategoryMain(idCate,limit,offset),
    articles.countByCategoryMain(idCate)
  ]).then(([listCateMain,newestArticles,top10Articles,rows,count_rows])=>{
    

    let total = count_rows;
    let nPages = Math.floor(total/limit);
    if(total % limit > 0) nPages++;

    let pages = [];
    for(i=1;i<=nPages;i++){
      if(i > 1 && i < nPages)
        obj = {value:i, valuepre:i-1, valuenext: i+1  , active: i === +page};
      else if( i==1 ){
        if(nPages == 1){
          obj = {value:i, active: i === +page};
        }
        else {
          obj = {value:i, valuenext: i+1  , active: i === +page};
        }
      }
      else if (i == nPages)
        obj = {value:i,  valuepre:i-1 , active: i === +page};
      pages.push(obj);
      
    }

    //console.log(rows);

    res.render('list_articles', {
      listCateMain,
      newestArticles,
      top10Articles,
      pages,
      categoryMain:true,
      listArticles: rows,
      title: 'Express',
      data: {intl: intlData}
    });
  })

});

router.get('/contact', (req, res, next) => {
  res.render('contact');
});

//Search

router.get('/search',(req,res,next)=>{
  
  let text = req.query.text;

  // let limit = 3;

  // let offset = 0;

  // articles.search(text,limit,offset).then(succ=>{
  //   // res.status(200).json(succ);
  //   let listArticles = succ;
  //   res.render('list_articles', {
  //     listArticles,
  //     title: 'Express',
  //     data: {intl: intlData}
  //   });
    
  // })
  // .catch(err=>{
  //   console.log(err);
  // })
  let page = req.query.page || 1;

  if (page < 1) page = 1;

  let limit = 6;

  let offset = (page-1)*limit;

  Promise.all([
    categoryMain.findSub(),
    articles.findNewest(),
    articles.findTop10(),
    articles.search(text,limit,offset),
    articles.countsearch(text)
  ]).then(([listCateMain,newestArticles,top10Articles,rows,count_rows])=>{
    
    let total = count_rows;
    let nPages = Math.floor(total/limit);
    if(total % limit > 0) nPages++;

    let pages = [];
    for(i=1;i<=nPages;i++){
      if(i > 1 && i < nPages)
        obj = {value:i, valuepre:i-1, valuenext: i+1  , active: i === +page};
      else if( i==1 )
      if(nPages == 1){
        obj = {value:i, active: i === +page};
      }
      else {
        obj = {value:i, valuenext: i+1  , active: i === +page};
      }       
      else if (i == nPages)
        obj = {value:i,  valuepre:i-1 , active: i === +page};
      pages.push(obj);
      
    }

    //console.log(pages);

    res.render('list_articles', {
      listCateMain,
      newestArticles,
      top10Articles,
      text,
      search: true,
      pages,
      listArticles: rows,
      title: 'Express',
      data: {intl: intlData}
    });
  })

})

router.get('/list-articles/tag/:id', (req, res, next) => {

  let idTag = req.params.id;

  let page = req.query.page || 1;

  if (page < 1) page = 1;

  let limit = 6;

  let offset = (page-1)*limit;

  Promise.all([
    categoryMain.findSub(),
    articles.findNewest(),
    articles.findTop10(),
    tag.findById(idTag),
    articles.findByTag(idTag,limit,offset),
    articles.countByTag(idTag)
  ]).then(([listCateMain,newestArticles,top10Articles,tag,rows,count_rows])=>{
    
    let total = count_rows;
    let nPages = Math.floor(total/limit);
    if(total % limit > 0) nPages++;

    let pages = [];
    for(i=1;i<=nPages;i++){
      if(i > 1 && i < nPages)
        obj = {value:i, valuepre:i-1, valuenext: i+1  , active: i === +page};
      else if( i==1 ){
        if(nPages == 1){
          obj = {value:i, active: i === +page};
        }
        else {
          obj = {value:i, valuenext: i+1  , active: i === +page};
        }
      }   
      else if (i == nPages)
        obj = {value:i,  valuepre:i-1 , active: i === +page};
      pages.push(obj);
      
    }

    //console.log(pages);

    res.render('list_articles', {
      listCateMain,
      newestArticles,
      top10Articles,
      tag,
      pages,
      listArticles: rows,
      title: 'Danh sách bài viết theo tag',
      istag: true,
      data: {intl: intlData}
    });
  })
 
});

router.get('/single-page/:id', (req, res, next) => {
  var idArticle = req.params.id;
  Promise.all([
    categoryMain.findSub(),
    articles.findNewest(),
    articles.findTop10(),
    tag.find(),
    articles.findOneById(idArticle),
    articles.increaseView(idArticle)
  ]).then(([listCateMain,newestArticles,top10Articles,listTag,article])=>{
    

    let top5Articles = top10Articles.slice(0,5);
    let top3Newest = newestArticles.slice(0,3);
    let idCate = article.categorySub;
    let hasCustomCSS; 
    let partial;
    let isReaded ;

    if(article.isPremiumArticle){
      if(req.user == undefined){
        isReaded = false;
        hasCustomCSS = true;
        partial = function () { return 'popup-disable' };
      }
      else{
        isReaded = true;
      }
    }

    articles.findNewestCate(idCate).then(listArtCate =>{
  
    res.render('single_page', {
      listCateMain,
      newestArticles,
      top5Articles,
      listArtCate,
      top3Newest,
      listTag,
      article,    
      title: article.title,
      data: {intl: intlData},
      hasCustomCSS,
      partial,
      isReaded
    });
  })
      .catch(err => {
          console.log(err);
      });
  })
});

router.post('/single-page/:id', (req, res, next) => {

  var id = req.params.id;
  var entity = req.body;
  //console.log(entity);
      articles.addComment(id,entity)
          .then(succ => {
            res.redirect('/single-page/'+id);
          })
          .catch(err => {
              console.log(err); 
              reject(err);                      
          });
});


module.exports = router;
