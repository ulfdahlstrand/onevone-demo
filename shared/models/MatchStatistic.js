var mongoose = require('mongoose');
var PlayerStatistic = require('./PlayerStatistic');

var matchStatisticSchema = mongoose.Schema({
	gameId: String,
	playerStatistics: [PlayerStatistic.schema]
	matches: [Object]
	csTot: Number,
	DamageTot: Number,
	goldTot: Number
});

var MatchStatistic = mongoose.model('MatchStatistic', matchStatisticSchema);

module.exports = MatchStatistic;