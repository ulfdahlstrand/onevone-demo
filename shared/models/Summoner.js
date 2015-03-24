var mongoose = require('mongoose');

var summonerSchema = mongoose.Schema({
    summonerId: Number,
    name: String,
    data: Object,
    lastUpdated: { type: Date, default: Date.now }
});

var Summoner = mongoose.model('Summoner', summonerSchema);

module.exports = Summoner;