var request = require("request");
var _ =  require("underscore");
var moment = require("moment");
var config = require("../config").v1;
var http = require('request');
var when = require('when');

function LeagueApi() {
	var that = this;

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

}

module.exports = new LeagueApi();