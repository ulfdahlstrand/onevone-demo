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


	that.getTournamentById = function(pipelineContainer) {
		var deferred = when.defer();
		var statistics = pipelineContainer.statistics;

		leagueApi.getTournamentById(pipelineContainer.leagueId)
		.then(function(tournamnet){
			var tournamnets = [];
			tournamnets.push(tournamnet);
			pipelineContainer.activeTournaments = tournamnets;
			deferred.resolve(pipelineContainer);
			statistics.incrementLeaguesItterated();
		});

		return deferred.promise;
	};

	that.getSummonersInActiveTournament = function(pipelineContainer) {
		var deferred = when.defer();
		var statistics = pipelineContainer.statistics;

		leagueApi.getSummonersInActiveTournament()
		.then(function(summoners){
			pipelineContainer.summonersInActiveLeagues = summoners;
	        deferred.resolve(pipelineContainer);
		});

		return deferred.promise;
	};

	that.getActiveTournaments = function(pipelineContainer) {
		var deferred = when.defer();
		var statistics = pipelineContainer.statistics;

		leagueApi.getActiveTournaments()
		.then(function(tournamnets){
			pipelineContainer.activeTournaments = tournamnets;
	        deferred.resolve(pipelineContainer);
		});

		return deferred.promise;
	};

	that.updateTournamentWithMatchResults = function(pipelineContainer){
		var deferred = when.defer();
		var activeTournaments = pipelineContainer.activeTournaments;
		var validMatches = pipelineContainer.validMatches;
		var statistics = pipelineContainer.statistics;
		var numberOfUnplayedMatches = 0;
		activeTournaments.forEach(function(league){
			league.matches.forEach(function(match){
	    		if(!match.hasBeenPlayed){
	    		
		    		match.updateMatchFromPlayedMatches(validMatches, statistics.incrementUpdatedGames);
	    		}

	    		if(!match.hasBeenPlayed){
		    		numberOfUnplayedMatches += 1;
	    		}
	    	});
			league.numberOfUnplayedMatches = numberOfUnplayedMatches;
		});

		deferred.resolve(pipelineContainer);
		return deferred.promise;
	};

	that.saveTournaments = function(pipelineContainer){
		var deferred = when.defer();
		var activeTournaments = pipelineContainer.activeTournaments;
		var statistics = pipelineContainer.statistics;
		
		activeTournaments.forEach(function(league){
			league.lastUpdated = Date.now();
	    	league.save(function (err) {
	    		if(err){ console.log(err); }
			});
		});
		
		deferred.resolve(pipelineContainer);

		return deferred.promise;
	};

}

module.exports = new TournamentService();