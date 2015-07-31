var mongoose = require('mongoose');

var playerStatisticSchema = mongoose.Schema({
	summonerId: Number,
	cs: { type: Number, default: 0 },
	csMin: { type: Number, default: 0 },
	gold: { type: Number, default: 0 },
	goldMin: { type: Number, default: 0 },
	damage: { type: Number, default: 0 },
	damageMin: { type: Number, default: 0 }
});

var PlayerStatistic = mongoose.model('PlayerStatistic', playerStatisticSchema);

module.exports = PlayerStatistic;