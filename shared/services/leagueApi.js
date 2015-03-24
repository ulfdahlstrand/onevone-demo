var _ =  require("underscore");
var moment = require("moment");
var config = require("../../config");
var http = require('request');
var when = require('when');
var mongoose = require('mongoose');
var League = require('./../models/League');
var Match = require('./../models/Match');
var Summoner = require('./../models/Summoner');



function LeagueApi() {
	var that = this;
	mongoose.connect(config.db_connectionString);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function (callback) {
		that.createLeague = function(){
			var deferred = when.defer();
			
			var l = new League();
			var g = new Match();

			g.summonerIds = [ 50208267, 49982720];

			l.name = "test";
			l.summonerIds = [ 50208267, 49982720];
			l.matches.push(g);

			l.save(function(err, league){
				console.log(err);
			}); 

			return deferred.promise;
		}

		//League realated methods
		that.getLeagueById = function(pipelineContainer) {
			var deferred = when.defer();
			var statistics = pipelineContainer.statistics;

			League.findOne({"_id" : pipelineContainer.leagueId}, function(err,league){
				pipelineContainer.league = league;
				deferred.resolve(pipelineContainer);
				statistics.incrementLeaguesItterated();
			});
			
			return deferred.promise;
		};

		that.updateLeagueWithMatchResults = function(pipelineContainer){
			var deferred = when.defer();
			var league = pipelineContainer.league;
			var validMatches = pipelineContainer.validMatches;
			var statistics = pipelineContainer.statistics;

			league.matches.forEach(function(match){
	    		if(!match.hasBeenPlayed){
		    		match.updateMatchFromPlayedMatches(validMatches, statistics.incrementUpdatedGames);
	    		}
	    	});

			deferred.resolve(pipelineContainer);
			return deferred.promise;
		};

		that.saveLeague = function(pipelineContainer){
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

		//Summoner related methods
		that.getSummonerById = function(summonerId) {
			var deferred = when.defer();

			Summoner.findOne({"summonerId" : summonerId}, function(err,summoner){
				if(summoner){
					deferred.resolve(summoner.data);
				}else{
					deferred.resolve(null);
				}
				
			});
			
			return deferred.promise;
		};

		that.saveSummoner = function(lolSummoner){
			console.log(lolSummoner);
			var deferred = when.defer();
			var summoner = new Summoner();

			summoner.summonerId = lolSummoner.id;
			summoner.name = lolSummoner.name;
			summoner.data = lolSummoner;
			summoner.lastUpdated = Date.now();

	    	summoner.save(function (err) {
	    		if(err){ console.log(err); }
	    		else{
	    			deferred.resolve('Success');
	    		}
			});

			return deferred.promise;
		};
	});
}


module.exports = new LeagueApi();