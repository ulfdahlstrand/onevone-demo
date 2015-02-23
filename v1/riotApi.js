var request = require("request");
var _ =  require("underscore");
var moment = require("moment");
var config = require("../config").v1;
var http = require('request');
var when = require('when');
/**
 * The model object
 * @constructor
 */
function RiotApi() {
	var that = this;

	/**
	 * Cache instance
	 * @type {Object}
	 */
	that.cache = require("./cache")(config.cacheEnabled, config.cacheDuration);

	this.retrieveSummoner = function(summonerName) {
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

	this.retrieveSummonerMatches = function(summonerId) {
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

	that.retrieveResentMatchesforSummoners = function(summoners){
		summonersWithMatches = summoners;
		summonersWithMatches.matches = [];

		var deferred = when.defer();
		var deferreds = [];
		summonersWithMatches.summonerIds.forEach(function(summonerId) {
			var matchpromise = that.retrieveSummonerMatches(summonerId).then(function(matches) {
				summonersWithMatches.matches.push(matches);
			});
			deferreds.push(matchpromise);
		});

		when.all(deferreds).then(function(){
			deferred.resolve(summonersWithMatches);
		});	
		return deferred.promise; 
	};

}

module.exports = new RiotApi();