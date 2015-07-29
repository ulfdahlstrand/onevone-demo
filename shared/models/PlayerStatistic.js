var mongoose = require('mongoose');

var playerStatisticSchema = mongoose.Schema({
	summonerId: Number,
	cs: Number,
	csMin: Number
	gold: Number,
	goldMin: Number,
	damage: Number,
	damageMin: Number
});

var PlayerStatistic = mongoose.model('PlayerStatistic', playerStatisticSchema);

module.exports = PlayerStatistic;