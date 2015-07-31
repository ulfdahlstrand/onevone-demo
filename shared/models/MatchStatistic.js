var mongoose = require('mongoose');
var PlayerStatistic = require('./PlayerStatistic');

var matchStatisticSchema = mongoose.Schema({
	gameId: String,
	playerStatistics: [PlayerStatistic.schema],
	matches: [{}],
	csTot: { type: Number, default: 0 },
	damageTot: { type: Number, default: 0 },
	goldTot: { type: Number, default: 0 }
});

matchStatisticSchema.methods.addPlayerStatistic = function(playerStatistic){
	this.csTot += playerStatistic.cs;
	this.goldTot += playerStatistic.gold;
	this.damageTot += playerStatistic.damage;
	this.playerStatistics.push(playerStatistic);
};

var MatchStatistic = mongoose.model('MatchStatistic', matchStatisticSchema);

module.exports = MatchStatistic;