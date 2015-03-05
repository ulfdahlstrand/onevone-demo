var mongoose = require('mongoose');
var Match = require('./Match');

var leagueSchema = mongoose.Schema({
    name: String,
    summonerIds: [Number],
    matches: [Match.schema] 
});

var League = mongoose.model('League', leagueSchema);

module.exports = League;