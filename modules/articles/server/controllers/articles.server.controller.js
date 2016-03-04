'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
  
var fs = require('fs');

/**
 * Create an article
 */
exports.create = function (req, res) {
  var article = new Article(req.body);
  article.user = req.user;

  article.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var article = req.article ? req.article.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  article.isCurrentUserOwner = req.user && article.user && article.user._id.toString() === req.user._id.toString() ? true : false;

  res.json(article);
};

/**
 * Update an article
 */
exports.update = function (req, res) {
  var article = req.article;

  article.title = req.body.title;
  article.content = req.body.content;

  article.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
  var article = req.article;

  article.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

exports.jar = function(req, res){
  var articles = Article.find({}).select('content title');
  //console.log(articles);
 // articles.select("content", "title");
  var foundArticles;
  articles.exec(function (err, docs) {
  // called when the `query.complete` or `query.error` are called
  // internally
    console.log(docs);

    
    var file = "TrainTest.csv";
    foundArticles = "Id,Hills,Scenic,Traffic,Overall\nRoute 1,5,3,4,0\nRoute 2,2,2,2,0\nRoute 3,5,1,1,0\nRoute 4,2,2,2,0\nRoute 5,4,4,4,0\n";

  
    fs.writeFileSync(file, foundArticles, 'utf8', (err) => {
      if (err) throw err;
      console.log('It\'s saved!');
    });
    
  });
  
  
  var article = Article.where('title', 'Steve Pre back from the Dead?').select('content title');
  var foundArticle;
  article.exec(function (err, doc) {
  // called when the `query.complete` or `query.error` are called
  // internally
    console.log(doc);
    foundArticle = JSON.stringify(doc);
    
    var file2 = "TestTest.csv";
    foundArticle = "Id,Hills,Scenic,Traffic,Overall\nRoute 2,5,3,4,0\n";
    
    fs.writeFileSync(file2, foundArticle, 'utf8', (err) => {
      if (err) throw err;
      console.log('It\'s saved!');
    });
    
  });
  
  
  
  
  var exec = require('child_process').exec;
  var child = exec('java -jar RunClubRecommender.jar TrainTest.csv TestTest.csv',
    function (error, stdout, stderr){
      console.log('Output -> ' + stdout);
      if(error !== null){
        console.log("Error -> "+error);
      }
      res.json(stdout);
      //res.data("cat", stdout);
  });
  
}

/**
 * List of Articles
 */
exports.list = function (req, res) {
  Article.find().sort('-created').populate('user', 'displayName').exec(function (err, articles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articles);
    }
  });
};

/**
 * Article middleware
 */
exports.articleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Article is invalid'
    });
  }

  Article.findById(id).populate('user', 'displayName').exec(function (err, article) {
    if (err) {
      return next(err);
    } else if (!article) {
      return res.status(404).send({
        message: 'No article with that identifier has been found'
      });
    }
    req.article = article;
    next();
  });
};
