/**
 * Establishing the routes / API's for this server
 */

var App = require("./core");
var _ =  require("underscore");

module.exports = function() {
	// TODO Standard system routes here like clearing cache

	// pipeline routes
	require("./pipeline_api/routes")();

	// public client routes
	require("./public_client_api/routes")();
};