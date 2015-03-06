var request = require("request");
var _ =  require("underscore");
var moment = require("moment");
var config = require("../config").v1;
var http = require('request');
var when = require('when');
var pipeline = require('when/pipeline');

var Statistics = require('./models/Statistics');
var leagueApi = require('./leagueApi');
var lolApi = require('./lolApi');
var matchProcessor = require('./matchProcessor');

function MatchPipeline() {
	var that = this;

	that.cache = require("./cache")(config.cacheEnabled, config.cacheDuration);

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