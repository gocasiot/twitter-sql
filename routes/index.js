'use strict';
var express = require('express');
var router = express.Router();

var models = require('../models');

/*
//var Tweet = require('../models/index').Tweet;
//var User = require('../models/index').User;

router.get('/', function(req, res, next){
  Tweet.findAll({include: [User]})
  .then(function(tweets){
    res.render('index', {
      tweets:tweets,
      showForm: true
  })
})
.catch(next);

router.get('/users/:name', function(req, res, next){
  
  User.findOne({where: {name: req.params.name}})
  .then(function(user){
    return user.getTweets();
  }).
  .then(function(tweets){
    res.render('index', {
      tweets: tweets
    })
  })
  .catch(next);
})

//get a single tweet for a single user
router.get('/users/:name/tweets/:id', function(req, res, next){
  Tweet.findById(Number(req.params.id), {include: [User]})
  .then(function(tweet){
    res.render('index', {
      tweets: [tweet]
    })
  })
})


// findOrCreate
// find the user
// if the user doesn't exit, create it
// and then create a tweet for that user
// redirect
router.post('/', function(req, res, next){
  
  User.findOne({where: {name: req.body.name}})
  .then(function(user){
    if(user) return user;
    else return User.create({name: req.body.name})
  })
  .then(function(user){
    return Tweet.create({tweet: req.body.tweet, UserId: user.id})
  })
  .then(function(){
    res.redirect('/');
  })
  .catch(next);
})

module.exports = router;

*/



module.exports = function makeRouterWithSockets (io) {

  // a reusable function
  function respondWithAllTweets (req, res, next){
    // var allTheTweets = tweetBank.list();
    models.listTweets().then(function(data){
      // console.log(data);
      res.render('index', {
        title: 'Twitter.js',
        tweets: data, //todo: fix rendering
        showForm: true
      });
    });
  }

  // here we basically treet the root view and tweets view as identical
  router.get('/', respondWithAllTweets);
  router.get('/tweets', respondWithAllTweets);

  // single-user page
  router.get('/users/:username', function(req, res, next){
    // var tweetsForName = tweetBank.find({ name: req.params.username });
    models.findUser(req.params.username)
    .then(function(data){
      res.render('index', {
        title: 'Twitter.js',
        tweets: data,
        showForm: true,
        username: req.params.username
      });    
    });

    
  });

  // single-tweet page
  router.get('/tweets/:id', function(req, res, next){
    //var tweetsWithThatId = tweetBank.find({ id: Number(req.params.id) });
    models.findTweetsById(Number(req.params.id)).then(function(data){
      res.render('index', {
        title: 'Twitter.js',
        tweets: data // an array of only one element ;-)
      });
    });
    
  });

  // create a new tweet
  router.post('/tweets', function(req, res, next){
    //var newTweet = tweetBank.add(req.body.name, req.body.text);

    models.add(req.body.name, req.body.text).then(function(data){
      io.sockets.emit('new_tweet', newTweet);
      res.redirect('/');
      
    });
  });

  // // replaced this hard-coded route with general static routing in app.js
  // router.get('/stylesheets/style.css', function(req, res, next){
  //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
  // });

return router;
}
