function Statistics(){
	var that = this;
	that.variables = {
		externalCalls : 0,
		lolApiCalls : 0,
		leaguesItterated: 0,
		summonersItterated: 0,
		importedGames : 0,
		validGames : 0,
		updatedGames: 0
	};

	that.incrementLolApiCalls = function(){
		that.variables.lolApiCalls += 1;
		that.variables.externalCalls += 1;
	}

	that.incrementLeaguesItterated = function(){
		that.variables.leaguesItterated += 1;
	}

	that.incrementSummonersItterated = function(){
		that.variables.summonersItterated += 1;
	}

	that.incrementImportedGames = function(){
		that.variables.importedGames += 1;
	}

	that.incrementValidGames = function(){
		that.variables.validGames += 1;
	}

	that.incrementUpdatedGames = function(){
		that.variables.updatedGames += 1;
	}
}; 

module.exports = function() {
	return new Statistics();
};