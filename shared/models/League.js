var mongoose = require('mongoose');
var Match = require('./Match');

var leagueSchema = mongoose.Schema({
    name: String,
    summonerIds: [Number],
    matches: [Match.schema],
    numberOfUnplayedMatches: Number,
    lastUpdated: { type: Date, default: Date.now }
});

//TODO: add method to add match to league

var League = mongoose.model('League', leagueSchema);

module.exports = League;