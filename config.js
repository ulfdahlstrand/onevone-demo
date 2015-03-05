/**
 * Configuration for app
 */
module.exports = {
	/**
	 * Server port
	 */
	port: 5000,
	/**
	 * Versioned configuration
	 */
	v1: {
		/**
		 * Enable the caching module
		 */
		cacheEnabled: false,
		/**
		 * How long to cache data in the cache module
		 */
		cacheDuration: 3600000,
		db_connectionString: 'mongodb://onevone_user:TBIW3QikL5CMZdSo@ds037601.mongolab.com:37601/heroku_app34246627'

	}
};
