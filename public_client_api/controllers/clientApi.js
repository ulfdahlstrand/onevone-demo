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
		summonerName = summonerName.toLowerCase();
		leagueApi.getSummonerByName(summonerName).then(function(summoner){
            if (summoner) {
                console.log('Summoner found in DB')
				deferred.resolve(summoner)
			}else{
				lolApi.retrieveSummoner(summonerName).then(function(lolSummoner){
					var strippedSummoner = lolSummoner[summonerName];
					strippedSummoner.name = strippedSummoner.name.toLowerCase();
					deferred.resolve(strippedSummoner);
					leagueApi.saveSummoner(strippedSummoner);
				});
			}
		});

		return deferred.promise;
	};

	that.retrieveSummonerById = function(summonerId){
		var deferred = when.defer();
		leagueApi.getSummonerById(summonerId).then(function(summoner){
            if (summoner) {
                console.log('Summoner found in DB')
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

	that.getTournamentById = function(tournamentId){
		var deferred = when.defer();
		//call league api to get leagues for summoner id

		leagueApi.getTournamentById(tournamentId).then(function(tournament){
            if (tournament) {
                console.log('Tournament found in DB')
				deferred.resolve(tournament)
			}
		});

		return deferred.promise;
	};



}

module.exports = function() {
	return new ClientApi();
};