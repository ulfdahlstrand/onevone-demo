var mongoose = require('mongoose');

var settingsSchema = mongoose.Schema({
    name: String,
    summonerIds: [Number],
    matches: [Match.schema],
    numberOfUnplayedMatches: Number,
    lastUpdated: { type: Date, default: Date.now }
});

//TODO: add method to add match to league

var Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;