var mongoose = require('mongoose');
var _ =  require("underscore");

var matchSchema = mongoose.Schema({
    gameId: String,
    summonerIds: [Number],
    winners: [Number],
    losers: [Number],
    hasBeenPlayed: { type: Boolean, default: false } 
});

matchSchema.statics.mapFromLolMatch = function (summonerId, game) {
	var match = new Match();
	match.summonerIds.push(summonerId);
	game.fellowPlayers.forEach(function(summoner){
		match.summonerIds.push(summoner.summonerId);
	});

	if(game.stats.win){
		match.addWin(summonerId);
	}
	else{
		match.addLoss(summonerId);
	}

	match.gameId = game.gameId;
	
	return match;
}

matchSchema.statics.mapFromListOfSummoners = function (summonerIds) {
	var match = new Match();
	match.summonerIds = summonerIds;
	
	return match;
}

matchSchema.methods.addWin = function(summonerId){
	if(this.winners.indexOf(summonerId) < 0){
		this.winners.push(summonerId);
	}
};

matchSchema.methods.addWins = function(summonerIds){
	var that = this;
	summonerIds.forEach(function(summonerId){
		console.log(summonerId);
		that.addWin(summonerId);
	});
};

matchSchema.methods.addLoss = function(summonerId){
	if(this.losers.indexOf(summonerId) < 0){
		this.losers.push(summonerId);
	}
};

matchSchema.methods.addLosses = function(summonerIds){
	var that = this;
	summonerIds.forEach(function(summonerId){
		console.log(summonerId);
		that.addLoss(summonerId);
	});
};

matchSchema.methods.copyValuesFromMatch = function (match) {
	this.hasBeenPlayed = match.hasBeenPlayed;
	this.gameId = match.gameId;
	this.addWins(match.winners);
	this.addLosses(match.losers);
	return this;
}

matchSchema.methods.updateMatchFromPlayedMatches = function(playedMatches, _callback){
		var that = this;
    	playedMatches.forEach(function(playedMatch){	
			playedMatch.games.forEach(function(game){
				var mappedlolmatch = matchSchema.statics.mapFromLolMatch(playedMatch.summonerId, game);
				if(_.isEqual(_.sortBy(that.summonerIds), _.sortBy(mappedlolmatch.summonerIds))){
					that.copyValuesFromMatch(mappedlolmatch);
					that.hasBeenPlayed = true;
					if(_callback){ _callback() };
				}	
			});
		});
	}

var Match = mongoose.model('Match', matchSchema);

module.exports = Match;