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
		});
		
		for(var gameId in aggregatedMatches) {
			var games = aggregatedMatches[gameId];
			var matchstatistics = leagueApi.createMatchStatistics(gameId);
			games.forEach(function(game){
		   		var playerStatistics = leagueApi.createPlayerStatistics(game);
		   		matchstatistics.addPlayerStatistic(playerStatistics);
		   		matchstatistics.matches.push(game);
		    });

			leagueApi.saveMatchStatistics(matchstatistics);
		}
		
		deferred.resolve(pipelineContainer);
		return deferred.promise;
	};

}

module.exports = new MatchStatisticsService();