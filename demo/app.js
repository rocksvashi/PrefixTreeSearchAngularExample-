var app = angular.module('rocksvashiModules', [ 'ngAnimate']);
/*
 * Main controller to provide functionality to load and show data for auto complete.
 */
app.controller('MainCtrl', function($scope, $http, PrefixTree) {
	$scope.countries = [];
	$scope.states = [];
	$scope.countryCodes = {}
	$scope.stateText = "";
	$scope.countryText = "";
	$scope.noStatesFound = false;
	var load = function () {
		$http({
			  method: 'GET',
			  url: 'http://services.groupkt.com/country/get/all'
			}).then(function successCallback(response) {
				console.time("tree_insertion")
				angular.forEach(response.data.RestResponse.result, function(item) {
					PrefixTree.insert("countries", item.name.toLowerCase());
					$scope.countryCodes[item.name.toLowerCase()] = item.alpha3_code;
				});
				
				console.timeEnd("tree_insertion")
			  });
	}
	
	load();
	
	$scope.loadStates = function () {
		
		if($scope.countryText === "") {
			return;
		}
		
		var countryCode = $scope.countryCodes[$scope.countryText.toLowerCase()];
		console.log(countryCode)
		$http({
			  method: 'GET',
			  url: 'http://services.groupkt.com/state/get/'+countryCode +'/all'
			}).then(function successCallback(response) {
				if(response.data.RestResponse.result.length === 0) {
					$scope.noStatesFound = true;
					return;
				}
				
				console.time("tree_insertion1")
				angular.forEach(response.data.RestResponse.result, function(item) {
					PrefixTree.insert("states", item.name.toLowerCase());
				});
				
				console.timeEnd("tree_insertion1")
			  });
	}
	
	$scope.autoCompleteCountries = function() {
		$scope.noStatesFound = false;
		console.time("autocomplete")
		$scope.countries = PrefixTree.autoComplete("countries", $scope.countryText.toLowerCase());
		console.timeEnd("autocomplete")
	}
	
	$scope.autoCompleteStates = function() {
		console.time("autocomplete")
		$scope.states = PrefixTree.autoComplete("states", $scope.stateText.toLowerCase());
		console.timeEnd("autocomplete")
	}
});

// Capitalize the word
app.filter('captialize', function() {
    return function(input) {
        var transformed = "";
        var words = input.split(" ");
        	for(var i=0; i< words.length; i++) {
        		transformed +=words[i].charAt(0).toUpperCase() + words[i].substring(1, words[i].length) +" ";
        	}
       return transformed;
      };
    });