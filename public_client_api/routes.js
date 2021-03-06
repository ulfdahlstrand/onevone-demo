var App = require("../core");
var _ =  require("underscore");
var cors = require('cors')
var errorHandling = require("./errorHandling");
var tokens = require("../tokens");
var config = require("../config");
var apiBaseRoute = "/public_client_api"; 
module.exports = function() {
    var clientApi = require("./controllers/clientApi")();
	// Validate token in routine
	function validateToken(req, res, next) {
		try {
			/*if(!req.headers.api_token) {
				throw { code: "NO_TOKEN" };
			}

			if(!req.headers.api_secret) {
				throw { code: "NO_TOKEN" };
			}

			if(!tokens[req.headers.api_token]) {
				throw { code: "INVALID_TOKEN" };
			}

			if(tokens[req.headers.api_token].secret !== req.headers.api_secret) {
				throw { code: "INVALID_TOKEN" };
			}*/			
			next();
		} catch(e) {
			errorHandling.handle(e, res);
		}		
	}

	App.Express.use(cors());

	App.Express.get( apiBaseRoute + "/region/:regionId/summoner/:id", validateToken, function (req, res) {
		clientApi.retrieveSummonerById(req.params.id)
			.then(function(response) {
				res.send(response);
			});
	});

	App.Express.get( apiBaseRoute + "/summoner/:id/tournaments", validateToken, function (req, res) {
		clientApi.retrieveSummonerTournaments(req.params.id)
			.then(function(response) {
				res.send(response);
			});
	});

	App.Express.get( apiBaseRoute + "/region/:regionId/summoner/name/:summoner_name", validateToken, function (req, res) {
		clientApi.retrieveSummonerByName(req.params.summoner_name)
			.then(function(response) {
				res.send(response);
			});
	});

	App.Express.post( apiBaseRoute + "/tournament/create", validateToken, function (req, res) {
		clientApi.createTournament(req.body.tournamentName, req.body.summoners)
			.then(function(response) {
				res.send(response);
			});
	});

	App.Express.get( apiBaseRoute + "/tournament/:id/standings", validateToken, function (req, res) {
		clientApi.getStandingsInTournament(req.params.id)
			.then(function(response) {
				res.send(response);
			});
	});

	App.Express.get( apiBaseRoute + "/tournament/:id/start", validateToken, function (req, res) {
		clientApi.startTournament(req.params.id)
			.then(function(response) {
				res.send(response);
			});
	});

	App.Express.get( apiBaseRoute + "/tournament/:id", validateToken, function (req, res) {
		clientApi.getTournamentById(req.params.id)
			.then(function(response) {
				res.send(response);
			});
	});


};