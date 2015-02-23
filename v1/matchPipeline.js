var request = require("request");
var _ =  require("underscore");
var moment = require("moment");
var config = require("../config").v1;
var http = require('request');
var when = require('when');
var pipeline = require('when/pipeline');

var leagueApi = require('./leagueApi');
var riotApi = require('./riotApi');
var matchProcessor = require('./matchProcessor');

function MatchPipeline() {
	var that = this;

	that.cache = require("./cache")(config.cacheEnabled, config.cacheDuration);

	that.updateLeague = function(leagueId){
	    
	    var tasks = [
	    	leagueApi.retriveSummonersInLeague,
	    	riotApi.retrieveResentMatchesforSummoners,
	    	matchProcessor.processMatches
	    ];

		return pipeline(tasks, leagueId);
	};
}

module.exports = function() {
	return new MatchPipeline();
};