var App = require("../core");
var _ =  require("underscore");
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

	App.Express.get( apiBaseRoute + "/summoner/:id", validateToken, function (req, res) {
		clientApi.retrieveSummonerById(req.params.id)
			.then(function(response) {
				res.send(response);
			});
	});

	App.Express.get( apiBaseRoute + "/summoner/:id/matches", validateToken, function (req, res) {
		clientApi.retrieveSummonerLeagues(req.params.id)
			.then(function(response) {
				res.send(response);
			});
	});

	App.Express.get( apiBaseRoute + "/summoner/name/:summoner_name", validateToken, function (req, res) {
		clientApi.retrieveSummonerByName(req.params.summoner_name)
			.then(function(response) {
				res.send(response);
			});
	});

};