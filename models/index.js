// pull in the Sequelize library
var Sequelize = require('sequelize');
// create an instance of a database connection
// which abstractly represents our app's mysql database
var twitterjsDB = new Sequelize('twitterjs', 'root', null, {  // new Sequelize('database','username','password')
    dialect: "mysql",    //dialect determines the protocol to be used. "mysql" dialect uses tcp/ip
    port: 3306
});

// open the connection to our database
twitterjsDB
.authenticate()
.catch(function(err) {
  console.log('Unable to connect to the database:', err);
})
.then(function() {
  console.log('Connection has been established successfully.');
});


var Tweet = require('./tweet')(twitterjsDB); //invoke function exported by tweet.js with twitterjsDB object
var User = require('./user')(twitterjsDB); //invoke function exported by user.js with twitterjsDB object

// adds a 'UserId' foreign key to the `Tweet` table
User.hasMany(Tweet);  //hasMany creates getTweets() method
Tweet.belongsTo(User); //belongsTo creates getUser() method


// User.findOne().then(function (user) {
//     return user.getTweets();
// })
// .then(function (tweets) {
//     JSON.stringify(tweets); // another way of just logging the plain old values
// });

// Tweet.findOne().then(function (t) {
//     return t.getUser();
// }).then(function (users) {
//     console.log(JSON.stringify(users)); // another way of just logging the plain old values
// });

function listTweets(){
  //Eager Loading. This is equivalent to: SELECT * FROM Tweets JOIN Users ON Tweets.UserId = Users.id; 
  return Tweet.findAll({   // Can we return data from a promise using this syntax??
    include: [{model: User}]
  }).then(function(tweets) {
    return tweets;
  });

}

// function findUser(username){
//   //Eager Loading. This is equivalent to: SELECT * FROM Tweets JOIN Users ON Tweets.UserId = Users.id; 
//   return User.findAll({   // Can we return data from a promise using this syntax??
//     // include: [{model: Tweets}],
//     where: {name: username}
//   });

// }

function findUser(username){
  return Tweet.findAll({
    include: [{model: User, where: {name: username}, required: true}] // required true Makes it inner join
  });
}

function findTweetsById(id){
  return Tweet.findAll({
    include: [{model: User, required: false}],
    where: {id: id}
  });
}
/* Still in the works
function add(name, tweetText){
  
  return Tweet.create({
    User: {name: name},
    tweet: tweetText
    id: //tweet id should be based on the amount of tweets already
  });
}
*/





module.exports = {
    User: User,
    Tweet: Tweet,
    listTweets: listTweets,
    findUser: findUser,
    findTweetsById: findTweetsById,
    add: add
};