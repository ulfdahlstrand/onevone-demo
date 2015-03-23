/**
 * Establishing the routes / API's for this server
 */

var App = require("../core");
var _ =  require("underscore");
var errorHandling = require("./errorHandling");
var tokens = require("../tokens");
var config = require("../config");
var apiBaseRoute = "/pipeline_api"; 

module.exports = function() {
    var matchPipeline = require("./controllers/matchPipeline")();
	// Validate token in routine
	function validateToken(req, res, next) {
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

	App.Express.get( apiBaseRoute + "/league/:id/update", validateToken, function (req, res) {
		matchPipeline.updateLeague(req.params.id)
			.then(function(response) {
				res.send(response);
			});
	});

};