var mongoose = require('mongoose');

var recentGameSchema = mongoose.Schema({
    summonerId: Number,
    data: Object,
    lastUpdated: { type: Date, default: Date.now }
});

var RecentGame = mongoose.model('RecentGame', recentGameSchema);

module.exports = RecentGame;