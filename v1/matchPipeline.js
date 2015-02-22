var request = require("request");
var _ =  require("underscore");
var moment = require("moment");
var config = require("../config").v1;
var http = require('request');
var when = require('when');
var pipeline = require('when/pipeline');
/**
 * The model object
 * @constructor
 */
function MatchPipeline() {
	var that = this;

	/**
	 * Cache instance
	 * @type {Object}
	 */
	that.cache = require("./cache")(config.cacheEnabled, config.cacheDuration);

	that.updateLeague = function(leagueId){
	    
	    var tasks = [
	    	that.retriveSummonersInLeague,
	    	that.retrieveResentMatchesforSummonesInLeague,
	    	that.processMatches
	    ];

		return pipeline(tasks, leagueId);
	};

	that.retrieveSummoner = function(summonerName) {
	    var deferred = when.defer();
	    var url = 'https://eune.api.pvp.net/api/lol/eune/v1.4/summoner/by-name/'+summonerName+'?api_key=3fe06ad4-4a6a-4794-9123-d73964ed9a92';
		request(url, function (error, response, body) {
			var res = JSON.parse(body);
			if (!error && response.statusCode == 200) {
		   		deferred.resolve(res);
		  	}
		});	
	    return deferred.promise; 
	};

	that.retriveSummonersInLeague = function(leagueId) {
	    var league = {
	    	"leagueId": leagueId,
	    	"summonerIds":[]
	    };

	    var deferred = when.defer();

		if(leagueId == 1){
			league.summonerIds = [50208267, 49982720];
			
		}else{
			league.summonerIds = [50208267];
		}

		deferred.resolve(league);

	    return deferred.promise; 
	};

	that.retrieveSummonerMatches = function(summonerId) {
	    var deferred = when.defer();
	    var url = 'https://eune.api.pvp.net/api/lol/eune/v1.3/game/by-summoner/'+summonerId+'/recent?api_key=3fe06ad4-4a6a-4794-9123-d73964ed9a92';
		request(url, function (error, response, body) {
			var res = JSON.parse(body);
			if (!error && response.statusCode == 200) {
		   		deferred.resolve(res);
		  	}
		});	
	    return deferred.promise; 
	};

	that.retrieveResentMatchesforSummonesInLeague = function(league){
		var leagueWithMatches = {
	    	"leagueId": league.leagueId,
	    	"summonerIds": league.summonerIds,
	    	"matches": []
	    };

		var deferred = when.defer();
		var deferreds = [];

		league.summonerIds.forEach(function(summonerId) {
			var matchpromise = that.retrieveSummonerMatches(summonerId).then(function(matches) {
				leagueWithMatches.matches.push(matches);
			});
			deferreds.push(matchpromise);
		});

		when.all(deferreds).then(function(){
			deferred.resolve(leagueWithMatches);
		});	
		return deferred.promise; 
	};

	that.processMatches = function(leagueWithMatches){
		var leagueWithValidMatches = {
	    	"leagueId" : leagueWithMatches.leagueId,
	    	"summonerIds": leagueWithMatches.summonerIds,
	    	"validMatches": []
	    };

		var deferred = when.defer();

		leagueWithMatches.matches.forEach(function(summonerMatch){
			var validMatches = {
				"summonerId":summonerMatch.summonerId,
				"games":[]
			};

			summonerMatch.games.forEach(function(game){
				if(that.validateGame(game)){
					validMatches.games.push(game);
				}				
			});

			leagueWithValidMatches.validMatches.push(validMatches);
		});
		
		deferred.resolve(leagueWithValidMatches);

		return deferred.promise;
	};

	that.validateGame = function(game){
		if(game.gameType !== 'CUSTOM_GAME') { return false; }
		if(game.fellowPlayers.length !== 1) { return false; }
		if(game.teamId === game.fellowPlayers[0].teamId) { return false; }

		return true;

	};
}

module.exports = function() {
	return new MatchPipeline();
};