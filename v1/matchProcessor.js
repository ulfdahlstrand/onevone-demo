var request = require("request");
var _ =  require("underscore");
var moment = require("moment");
var config = require("../config").v1;
var http = require('request');
var when = require('when');

function MatchProcessor() {
	var that = this;

	that.cache = require("./cache")(config.cacheEnabled, config.cacheDuration);

	that.processMatches = function(league){
		leagueWithValidMatches = league;
		leagueWithValidMatches.validMatches = [];

		var deferred = when.defer();

		leagueWithValidMatches.matches.forEach(function(summonerMatch){
			var validMatches = {
				"summonerId":summonerMatch.summonerId,
				"games":[]
			};

			summonerMatch.games.forEach(function(game){
				if(that.validateGame(game)){
					validMatches.games.push(game);
				}				
			});

			leagueWithValidMatches.validMatches.push(validMatches);
		});
		
		deferred.resolve(leagueWithValidMatches);

		return deferred.promise;
	};

	that.validateGame = function(game){
		if(game.gameType !== 'CUSTOM_GAME') { return false; }
		if(game.fellowPlayers.length !== 1) { return false; }
		if(game.teamId === game.fellowPlayers[0].teamId) { return false; }

		return true;

	};
}

module.exports = new MatchProcessor();