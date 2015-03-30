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

		//Tournament realated methods		
		that.createTournament = function(tournamentName){
			var deferred = when.defer();
			var tournament = new League();
			tournament.name = tournamentName;
			tournament.save(function(err, createdTournament){
				deferred.resolve(createdTournament);
			}); 

			return deferred.promise;
		}

		that.getTournamentById = function(tournamentId) {
			var deferred = when.defer();

			League.findOne({"_id" : tournamentId}, function(err,tournament){
				deferred.resolve(tournament);
			});
			
			return deferred.promise;
		};

		//TODO: add filter for active matches
		that.getSummonersInActiveTournament = function() {
			var deferred = when.defer();
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
		        deferred.resolve(summoners);
		        
		    });
			return deferred.promise;
		};

		that.getActiveTournaments = function(){
			var deferred = when.defer();
			var updateLimit = new Date(Date.now() - 5 * 60 * 1000);
			League.find({lastUpdated: { $lt: updateLimit},}, function(err, tournament){
				var res = [];
				if(!err){
					res = tournament;
				}

				deferred.resolve(res);
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

		that.getSummonerByName = function(summonerName) {
			var deferred = when.defer();

			Summoner.findOne({"name" : summonerName}, function(err,summoner){
				if(summoner){
					deferred.resolve(summoner.data);
				}else{
					deferred.resolve(null);
				}
				
			});
			
			return deferred.promise;
		};

		that.saveSummoner = function(summoner){
			var deferred = when.defer();
			Summoner.update({ summonerId: summoner.id }, 
				{ $set: 
					{ 
						name: summoner.name,
						data: summoner, 
						lastUpdated: Date.now() 
					} 
				}, 
				{ upsert: true }, 
				function(){});

			return deferred.promise;
		};
	});
}


module.exports = new LeagueApi();