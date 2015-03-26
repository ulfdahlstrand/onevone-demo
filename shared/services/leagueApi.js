var _ =  require("underscore");
var moment = require("moment");
var config = require("../../config");
var http = require('request');
var when = require('when');
var mongoose = require('mongoose');
var League = require('./../models/League');
var Match = require('./../models/Match');
var Summoner = require('./../models/Summoner');
var RecentGame = require('./../models/RecentGame');


function LeagueApi() {
	var that = this;
	mongoose.connect(config.db_connectionString);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function (callback) {
		
		that.createLeague = function(leagueName){
			var deferred = when.defer();
			var league = new League();
			league.name = leagueName;
			league.save(function(err, createdLeague){
				deferred.resolve(createdLeague);
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

		that.getSummonersInActiveLeagues = function(pipelineContainer) {
			var deferred = when.defer();
			var statistics = pipelineContainer.statistics;
			var updateLimit = new Date(Date.now() - 5 * 60 * 1000);
		    League.aggregate([
		    	{ $match: {lastUpdated: { $lt: updateLimit}}}, //replace this code with checking for none finished leagues
		        { $unwind: "$summonerIds" },
		        { $project : { summonerIds : 1, _id: 0 } },
		        { $group: {_id: "$summonerIds" }}
		    ], function (err, result) {
		        var summoners = [];
		        if (err) {
		            console.log(err);
		        }
		        else{
		        	result.forEach(function(row){
		        		summoners.push(row._id);
		        	});
		        }
		        pipelineContainer.summonersInActiveLeagues = summoners;

		        deferred.resolve(pipelineContainer);
		        
		    });
			return deferred.promise;
		};

		that.getRecentGamesForSummoners = function(summonerIds){
			var deferred = when.defer();

			RecentGame.find({ summonerId: { $in: summonerIds }}, function(err, matches){
				var res = [];
				if(!err){
					res = matches;
				}

				deferred.resolve(res);
			});
			return deferred.promise;
		};


		//TODO: move this to be a static method on ercentgame mongoose object instead
		that.saveRecentGame = function(lolRecentGame){
			var deferred = when.defer();
			RecentGame.update({ summonerId: lolRecentGame.summonerId }, 
				{ $set: 
					{ 
						data: lolRecentGame, 
						lastUpdated: Date.now() 
					} 
				}, 
				{ upsert: true }, 
				function(){});
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

		//TODO: move this to be a static method on summoner mongoose object instead
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