var Sequelize = require('sequelize');

//exporting a function that takes a db object
module.exports = function(db) {
    var Tweet = db.define('Tweet', {  //table name will be called 'Tweets'. Adds 's' by default.
        tweet: Sequelize.STRING //type of data stored in tweet column is of type 'string'
    }, {
        timestamps: false // this will deactivate the time columns
    });

    // this is our model;
    // returned by the .define method
    // .defining a table on the sequelize database object
    // In other words, we are definining table schema
    return Tweet;
}