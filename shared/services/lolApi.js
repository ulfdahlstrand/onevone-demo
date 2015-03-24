var request = require("request");
var _ =  require("underscore");
var moment = require("moment");
var http = require('request');
var when = require('when');
/**
 * The model object
 * @constructor
 */
function LoLApi() {
	var that = this;

	/**
	 * Cache instance
	 * @type {Object}
	 */
	//that.cache = require("./cache")(config.cacheEnabled, config.cacheDuration);

	that.retrieveSummoner = function(summonerName, _callback) {
	    var deferred = when.defer();
	    var url = 'https://eune.api.pvp.net/api/lol/eune/v1.4/summoner/by-name/'+summonerName+'?api_key=3fe06ad4-4a6a-4794-9123-d73964ed9a92';
		
		request(url, function (error, response, body) {
			var res = JSON.parse(body);
			if (!error && response.statusCode == 200) {
		   		deferred.resolve(res);
		   		if(_callback){ _callback()};
		  	}
		});	
	    return deferred.promise; 
	};

	//Fix recive summoner by iD. 

	that.retrieveSummonerWithId = function(summonerId, _callback) {
	    var deferred = when.defer();
	    var url = 'https://eune.api.pvp.net/api/lol/eune/v1.4/summoner/'+summonerId+'?api_key=3fe06ad4-4a6a-4794-9123-d73964ed9a92';
		
		request(url, function (error, response, body) {
			var res = JSON.parse(body);
			if (!error && response.statusCode == 200) {
		   		deferred.resolve(res);
		   		if(_callback){ _callback()};
		  	}
		});	
	    return deferred.promise; 
	};


	that.retrieveSummonerMatches = function(summonerId, _callback) {
	    var deferred = when.defer();	    
	    var url = 'https://eune.api.pvp.net/api/lol/eune/v1.3/game/by-summoner/'+summonerId+'/recent?api_key=3fe06ad4-4a6a-4794-9123-d73964ed9a92';
		
		
		request(url, function (error, response, body) {
			var res = JSON.parse(body);
			if (!error && response.statusCode == 200) {
		   		deferred.resolve(res);
		   		if(_callback){ _callback()};
		  	}
		});	
	    return deferred.promise; 
	};

	//add a wrapper for a list of

	that.retrieveResentMatchesforSummoners = function(pipelineContainer){
		var deferred = when.defer();
		var deferreds = [];
		var statistics = pipelineContainer.statistics;
		
		pipelineContainer.recentMatches = [];
		pipelineContainer.league.summonerIds.forEach(function(summonerId) {
			var matchpromise = that.retrieveSummonerMatches(summonerId, statistics.incrementLolApiCalls)
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

module.exports = new LoLApi();