/**
 * Establishing the routes / API's for this server
 */

var App = require("../core");
var _ =  require("underscore");
var errorHandling = require("./errorHandling");
var tokens = require("../tokens");
var config = require("../config").v1;

module.exports = function() {
    var matchPipeline = require("./matchPipeline")();
	// Validate token in routine
	function validateToken(req, res, next) {
		// Handle secret admin access
		if(config.adminKeyEnabled && req.query.secret_admin === config.adminKey) {
			next();
		} else {
			try {
				if(!req.headers.api_token) {
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
				}

				next();
			} catch(e) {
				errorHandling.handle(e, res);
			}
		}
	}

	App.Express.get("/summoner/name/:summoner_name", validateToken, function (req, res) {
		matchPipeline.retrieveSummoner(req.params.summoner_name)
			.then(function(response) {
				res.send(response);
			});
	});

		App.Express.get("/summoner/:id/matches", validateToken, function (req, res) {
		matchPipeline.retrieveSummonerMatches(req.params.id)
			.then(function(response) {
				res.send(response);
			});
	});

	App.Express.get("/league/:id/update", validateToken, function (req, res) {
		matchPipeline.updateLeague(req.params.id)
			.then(function(response) {
				res.send(response);
			});
	});

};