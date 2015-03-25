var request = require("request");
var _ =  require("underscore");
var moment = require("moment");
var config = require("../../config");
var http = require('request');
var when = require('when');
var pipeline = require('when/pipeline');

var lolApi = require('./../../shared/services/lolApi');

function RecentMatchService() {
	var that = this;

	//add method for getting recent matches from db
	//add method to get recent matches from lol
	//add method to determine which matches that needs to be updated

	that.retrieveResentMatchesforSummoners = function(pipelineContainer){
		var deferred = when.defer();
		var deferreds = [];
		var statistics = pipelineContainer.statistics;
		
		pipelineContainer.recentMatches = [];
		pipelineContainer.league.summonerIds.forEach(function(summonerId) {
			var matchpromise = lolApi.retrieveSummonerMatches(summonerId, statistics.incrementLolApiCalls)
			.then(function(matches) {
				pipelineContainer.recentMatches.push(matches);
			});
			deferreds.push(matchpromise);
			statistics.incrementSummonersItterated();
		});

		when.all(deferreds).then(function(){
			deferred.resolve(pipelineContainer);
		});	
		return deferred.promise; 
	};


}

module.exports = new RecentMatchService();