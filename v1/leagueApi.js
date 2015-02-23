var request = require("request");
var _ =  require("underscore");
var moment = require("moment");
var config = require("../config").v1;
var http = require('request');
var when = require('when');
var mongoose = require('mongoose');

var username = 'onevone_user';
var password = 'TBIW3QikL5CMZdSo';
var connectionString = 'mongodb://'+username+':'+password+'@ds037601.mongolab.com:37601/heroku_app34246627';


mongoose.connect(connectionString);
/*
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  
		  var kittySchema = mongoose.Schema({
		    name: String
		})

		kittySchema.methods.speak = function () {
		  var greeting = this.name
		    ? "Meow name is " + this.name
		    : "I don't have a name"
		  console.log(greeting);
		}


  	var Kitten = mongoose.model('Kitten', kittySchema)



  	var silence = new Kitten({ name: 'Silence' })

	silence.save(function (err, silence) {
	  if (err) return console.error(err);
	  silence.speak();
	});

});*/

function LeagueApi() {
	var that = this;

		that.retriveLeague = function(leagueId) {
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