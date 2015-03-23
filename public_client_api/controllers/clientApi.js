var request = require("request");
var _ =  require("underscore");
var moment = require("moment");
var config = require("../../config");
var http = require('request');
var when = require('when');
var pipeline = require('when/pipeline');

var leagueApi = require('./../../shared/services/leagueApi');

function ClientApi() {
	var that = this;

	that.retrieveSummonerByName = function(summonerName){
		var deferred = when.defer();
		//call lol api to get summoner by name 

		//deferred.resolve(pipelineContainer);
		deferred.resolve({"name":"test"});
		return deferred.promise;
	};

	that.retrieveSummonerById = function(summonerName){
		var deferred = when.defer();
		//call lol api to get summoner by id 

		//deferred.resolve(pipelineContainer);
		deferred.resolve({"id":"test"});
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