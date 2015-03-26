var request = require("request");
var _ =  require("underscore");
var moment = require("moment");
var config = require("../../config");
var http = require('request');
var when = require('when');
var pipeline = require('when/pipeline');

var lolApi = require('./../../shared/services/lolApi');
var leagueApi = require('./../../shared/services/leagueApi');

var League = require('./../../shared/models/League');
function TournamentService() {
	var that = this;

	that.getSummonersInActiveTournament = function(pipelineContainer) {
		var deferred = when.defer();
		var statistics = pipelineContainer.statistics;

		leagueApi.getSummonersInActiveTournament().then(function(summoners){
			pipelineContainer.summonersInActiveLeagues = summoners;
	        deferred.resolve(pipelineContainer);
		});

		return deferred.promise;
	};

	that.saveTournament = function(pipelineContainer){
		var deferred = when.defer();
		var league = pipelineContainer.league;
		var statistics = pipelineContainer.statistics;
		
		league.lastUpdated = Date.now();
    	league.save(function (err) {
    		if(err){ console.log(err); }
    		else{
    			deferred.resolve(pipelineContainer);
    		}
		});

		return deferred.promise;
	};

}

module.exports = new TournamentService();