var request = require("request");
var _ =  require("underscore");
var moment = require("moment");
var config = require("../../config");
var http = require('request');
var when = require('when');
var pipeline = require('when/pipeline');

var Statistics = require('./../models/Statistics');
var leagueApi = require('./../../shared/services/leagueApi');
var lolApi = require('./../../shared/services/lolApi');
var matchProcessor = require('./../services/matchProcessor');
var recentMatchService = require('./../services/recentMatchService');
var tournamentService = require('./../services/tournamentService');

function MatchPipeline() {
	var that = this;

	//that.cache = require("./cache")(config.cacheEnabled, config.cacheDuration);

	that.updateLeague = function(leagueId){
	    
	    var pipelineContainer = {};
	    pipelineContainer.leagueId = leagueId;
	    pipelineContainer.statistics = Statistics();
	    var executionOrder = [
	    	tournamentService.getTournamentById,
	    	recentMatchService.retrieveResentMatchesforSummoners,
	    	matchProcessor.processMatches,
	    	tournamentService.updateTournamentWithMatchResults,
	    	tournamentService.saveTournaments,
	    	that.processStatistics
	    ];

		return pipeline(executionOrder, pipelineContainer);
	};

	that.updateLeagues = function(){
	    
	    var pipelineContainer = {};
	    pipelineContainer.statistics = Statistics();

	    var executionOrder = [
			tournamentService.getActiveTournaments,
			tournamentService.getSummonersInActiveTournament,
			recentMatchService.getRecentGamesForSummonersInDb,
			recentMatchService.getRecentGamesForSummonersNotInDb,
			matchProcessor.processMatches,
	    	tournamentService.updateTournamentWithMatchResults,
	    	tournamentService.saveTournaments,
	    	that.processStatistics
	    ];

		return pipeline(executionOrder, pipelineContainer);
	};

	

	that.processStatistics = function(pipelineContainer){
		var deferred = when.defer();
		var statistics = pipelineContainer.statistics;
		//deferred.resolve(pipelineContainer);
		deferred.resolve(statistics.variables);
		return deferred.promise;
	};
}

module.exports = function() {
	return new MatchPipeline();
};