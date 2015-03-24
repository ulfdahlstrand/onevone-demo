var request = require("request");
var _ =  require("underscore");
var moment = require("moment");
var config = require("../../config");
var http = require('request');
var when = require('when');
var pipeline = require('when/pipeline');

var leagueApi = require('./../../shared/services/leagueApi');
var lolApi = require('./../../shared/services/lolApi');

function ClientApi() {
	var that = this;

	that.retrieveSummonerByName = function(summonerName){
		var deferred = when.defer();
		//call lol api to get summoner by name 

		//Look for name in cash

		//If found respond with user

		//If name not found get from LoL-api respond with user
		lolApi.retrieveSummoner(summonerName).then(function(body){
			deferred.resolve(body);
		});

		return deferred.promise;
	};

	that.retrieveSummonerById = function(summonerId){
		var deferred = when.defer();
		leagueApi.getSummonerById(summonerId).then(function(summoner){
			if(summoner){
				deferred.resolve(summoner)
			}else{
				lolApi.retrieveSummonerWithId(summonerId).then(function(lolSummoner){
					
					var strippedSummoner = lolSummoner[summonerId];
					deferred.resolve(strippedSummoner);
					leagueApi.saveSummoner(strippedSummoner);

				});
			}
		});
		
		return deferred.promise;
	};

	that.retrieveSummonerLeagues = function(summonerId){
		var deferred = when.defer();
		//call league api to get leagues for summoner id



		//deferred.resolve(pipelineContainer);
		deferred.resolve({"league":"test"});
		return deferred.promise;
	};

	



}

module.exports = function() {
	return new ClientApi();
};