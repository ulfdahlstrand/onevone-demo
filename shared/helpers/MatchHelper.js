function MatchHelper() {
	var that = this;

	that.allPossibleCases = function(arr) {
	  if (arr.length == 1) {
	    return arr[0];
	  } else {
	    var results = [];
	    
	    for(var i = 0; i < arr.length; i++){
	    	for(var j = 0; j < arr.length; j++){
	    		if(i > j){
	    			var result = [arr[i], arr[j]]; 
	    			results.push(result);
	    		}
	    	}
	    }
	    return results;
	  }
	};
}
module.exports = new MatchHelper();