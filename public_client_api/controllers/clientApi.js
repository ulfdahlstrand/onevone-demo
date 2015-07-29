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
					if(lolSummoner){
						var strippedSummoner = lolSummoner[summonerName];
						strippedSummoner.name = strippedSummoner.name.toLowerCase();
						deferred.resolve(strippedSummoner);
						leagueApi.saveSummoner(strippedSummoner);
					}
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

	that.retrieveSummonerTournaments = function(summonerId){
		var deferred = when.defer();
		//call league api to get leagues for summoner id


		leagueApi.getTournamentsForSummoner(summonerId).then(function(tournaments){
            if (tournaments) {
				deferred.resolve(tournaments)
			}
		});
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

	that.getStandingsInTournament = function(tournamentId){
		var deferred = when.defer();
		//call league api to get leagues for summoner id

		var standingsForSummoner = {};


		leagueApi.getStandingsInTournament(tournamentId).then(function(standings){
            if (standings) {
            	standings.forEach(function(standing){
            		var summonerId = standing.summonerIds;
            		var standingForSummoner = standingsForSummoner[summonerId];
            		console.log(standingForSummoner);
            		if(!standingForSummoner){
            			var newStanding = {
            				summonerId: summonerId,
            				wins: 0,
            				loses: 0
            			};
            			standingForSummoner = newStanding;
            			standingsForSummoner[summonerId] = newStanding; 
            		}

            		if(standing.matches.winners === summonerId){
            			standingForSummoner.wins += 1;
            		}

            		if(standing.matches.losers === summonerId){
            			standingForSummoner.loses += 1;
            		}
            	});

            	var sortedStandings = _.sortBy(standingsForSummoner, function(standing){ return -standing.wins; });
				deferred.resolve(sortedStandings);
			}
		});

		return deferred.promise;
	};

	that.createTournament = function(tournamentName, summoners){
		var deferred = when.defer();
		leagueApi.createTournament(tournamentName, summoners)
		.then(function(tournament){
            if (tournament) {
				deferred.resolve(tournament);
			}
		});
		return deferred.promise;
	};

	that.startTournament = function(tournamentId){
		var deferred = when.defer();
		//call league api to get leagues for summoner id
		leagueApi.startTournament(tournamentId)
		.then(function(result){
			deferred.resolve(result);
		});

		return deferred.promise;
	};

}

module.exports = function() {
	return new ClientApi();
};