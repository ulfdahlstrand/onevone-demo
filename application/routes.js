/**
 * Establishing the routes / API's for this server
 */

var App = require("../core");
var _ =  require("underscore");
var errorHandling = require("./errorHandling");
var config = require("../config");

module.exports = function() {
    var matchPipeline = require("./controllers/matchPipeline")();
	// Validate token in routine
	function validateToken(req, res, next) {
		try {
			next();
		} catch(e) {
			errorHandling.handle(e, res);
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