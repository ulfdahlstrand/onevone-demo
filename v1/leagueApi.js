var _ =  require("underscore");
var moment = require("moment");
var config = require("../config").v1;
var http = require('request');
var when = require('when');
var mongoose = require('mongoose');
var League = require('./models/League');
var Match = require('./models/Match');



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

		that.getLeagueById = function(pipelineContainer) {
			var deferred = when.defer();
			
			League.findOne({"_id" : pipelineContainer.leagueId}, function(err,league){
				pipelineContainer.league = league;
				deferred.resolve(pipelineContainer);
			});
			
			return deferred.promise;
		};

		that.updateLeagueWithMatchResults = function(pipelineContainer){
			var deferred = when.defer();
			var league = pipelineContainer.league;
			var validMatches = pipelineContainer.validMatches

			league.matches.forEach(function(match){
	    		if(!match.hasBeenPlayed){
		    		match.updateMatchFromPlayedMatches(validMatches);
	    		}
	    	});

			deferred.resolve(pipelineContainer);
			return deferred.promise;
		};

		that.saveLeague = function(pipelineContainer){
			var deferred = when.defer();
			var league = pipelineContainer.league;

	    	league.save(function (err) {
	    		if(err){ console.log(err); }
	    		else{
	    			deferred.resolve(pipelineContainer);
	    		}
			});

			return deferred.promise;
		};
	});
}


module.exports = new LeagueApi();