var mongoose = require('mongoose');
var _ =  require("underscore");

var matchSchema = mongoose.Schema({
    gameId: String,
    summonerIds: [Number],
    winner: [Number],
    hasBeenPlayed: { type: Boolean, default: false } 
});

matchSchema.statics.mapFromLolMatch = function (summonerId, game) {
	var match = new Match();
	match.summonerIds.push(summonerId);
	game.fellowPlayers.forEach(function(summoner){
		match.summonerIds.push(summoner.summonerId);
	});

	match.gameId = game.gameId;
	
	return match;
}

matchSchema.methods.copyValuesFromMatch = function (match) {
	this.hasBeenPlayed = match.hasBeenPlayed;
	this.gameId = match.gameId;
	console.log(this);
	return this;
}

matchSchema.methods.updateMatchFromPlayedMatches = function(playedMatches){
		var that = this;
    	playedMatches.forEach(function(playedMatch){	
			playedMatch.games.forEach(function(game){
				var mappedlolmatch = matchSchema.statics.mapFromLolMatch(playedMatch.summonerId, game);
				if(_.isEqual(_.sortBy(that.summonerIds), _.sortBy(mappedlolmatch.summonerIds))){
					that.copyValuesFromMatch(mappedlolmatch);
					that.hasBeenPlayed = true;
				}	
			});
		});
	}

var Match = mongoose.model('Match', matchSchema);

module.exports = Match;