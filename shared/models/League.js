var mongoose = require('mongoose');
var Match = require('./Match');

var leagueSchema = mongoose.Schema({
    name: String,
    summonerIds: [Number],
    matches: [Match.schema],
    lastUpdated: { type: Date, default: Date.now }
});

var League = mongoose.model('League', leagueSchema);

module.exports = League;