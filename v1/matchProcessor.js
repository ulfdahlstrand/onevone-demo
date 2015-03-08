var request = require("request");
var _ =  require("underscore");
var moment = require("moment");
var config = require("../config").v1;
var http = require('request');
var when = require('when');

function MatchProcessor() {
	var that = this;

	that.cache = require("./cache")(config.cacheEnabled, config.cacheDuration);

	that.processMatches = function(pipelineContainer){
		var deferred = when.defer();
		var statistics = pipelineContainer.statistics;
		
		pipelineContainer.validMatches = [];
		
		var recentMatches = pipelineContainer.recentMatches;

		recentMatches.forEach(function(summonerMatch){
			var validMatches = {
				"summonerId":summonerMatch.summonerId,
				"games":[]
			};

			summonerMatch.games.forEach(function(game){
				statistics.incrementImportedGames();
				if(validateGame(game)){
					validMatches.games.push(game);
					statistics.incrementValidGames();
				}				
			});

			if(validMatches.games.length > 0){
				pipelineContainer.validMatches.push(validMatches);	
			}
		});	

		deferred.resolve(pipelineContainer);
		return deferred.promise;
	};

	function validateGame(game){

		if(game.gameType !== 'CUSTOM_GAME') { return false; }
		if(!game.hasOwnProperty("fellowPlayers")) { return false; }
		//if(game.fellowPlayers.length !== 1) { return false; }
		//if(game.teamId === game.fellowPlayers[0].teamId) { return false; }

		return true;

	};
}

module.exports = new MatchProcessor();