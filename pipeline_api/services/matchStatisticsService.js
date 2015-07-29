var config = require("../../config");
var _ =  require("underscore");
var when = require('when');
var leagueApi = require('./../../shared/services/leagueApi');

function MatchStatisticsService() {
	var that = this;

that.calculateMatchStatisticsForValidMatches = function(pipelineContainer){
		var deferred = when.defer();
		var validMatches = pipelineContainer.validMatches;
		var aggregatedMatches = {};

		validMatches.forEach(function(validMatch){
			var summonerId = validMatch.summonerId;
			validMatch.games.forEach(function(game){
				var gameId = game.gameId;

				if(!aggregatedMatches[gameId]){
					aggregatedMatches[gameId] = [];
				}
				var aggregatedMatch = aggregatedMatches[gameId];

				aggregatedMatch.push({ "summonerId":summonerId, "game": game });
			});


			//if(game[validMatch.gameId])
			//TODO: create mongoose object for matchstatistics
			//populate object
			//save object
			//leagueApi.saveMatchStatistics(validMatch);
		});


		deferred.resolve(pipelineContainer);
		return deferred.promise;
	};

}

module.exports = new MatchStatisticsService();