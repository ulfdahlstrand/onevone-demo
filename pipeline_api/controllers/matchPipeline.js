var request = require("request");
var _ =  require("underscore");
var moment = require("moment");
var config = require("../../config");
var http = require('request');
var when = require('when');
var pipeline = require('when/pipeline');

var Statistics = require('./../models/Statistics');
var leagueApi = require('./../../shared/services/leagueApi');
var lolApi = require('./../services/lolApi');
var matchProcessor = require('./../services/matchProcessor');

function MatchPipeline() {
	var that = this;

	//that.cache = require("./cache")(config.cacheEnabled, config.cacheDuration);

	that.updateLeague = function(leagueId){
	    
	    var pipelineContainer = {};
	    pipelineContainer.leagueId = leagueId;
	    pipelineContainer.statistics = Statistics();

	    var executionOrder = [
	    	leagueApi.getLeagueById,
	    	lolApi.retrieveResentMatchesforSummoners,
	    	matchProcessor.processMatches,
	    	leagueApi.updateLeagueWithMatchResults,
	    	leagueApi.saveLeague,
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