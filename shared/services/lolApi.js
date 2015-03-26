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
			if (!error && response.statusCode == 200) {
				var res = JSON.parse(body);
		   		deferred.resolve(res);
		   		if(_callback){ _callback()};
		  	}
		  	else{
		  		deferred.resolve();
		  		console.log(error);
		  	}
		});	
	    return deferred.promise; 
	};

	//Fix recive summoner by iD. 

	that.retrieveSummonerWithId = function(summonerId, _callback) {
	    var deferred = when.defer();
	    var url = 'https://eune.api.pvp.net/api/lol/eune/v1.4/summoner/'+summonerId+'?api_key=3fe06ad4-4a6a-4794-9123-d73964ed9a92';
		
		request(url, function (error, response, body) {	
			if (!error && response.statusCode == 200) {
				var res = JSON.parse(body);
		   		deferred.resolve(res);
		   		if(_callback){ _callback()};
		  	}
		  	else{
		  		deferred.resolve();
		  		console.log(error);
		  	}
		});	
	    return deferred.promise; 
	};


	that.retrieveSummonerMatches = function(summonerId, _callback) {
	    var deferred = when.defer();	    
	    var url = 'https://eune.api.pvp.net/api/lol/eune/v1.3/game/by-summoner/'+summonerId+'/recent?api_key=3fe06ad4-4a6a-4794-9123-d73964ed9a92';
		
		request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var res = JSON.parse(body);
		   		deferred.resolve(res);
		   		if(_callback){ _callback()};
		  	}
		  	else{
		  		deferred.resolve();
		  		console.log(error);
		  	}
		});	
	    return deferred.promise; 
	};

}

module.exports = new LoLApi();