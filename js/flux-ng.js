var fluxApp = angular.module('fluxApp', []);


// NOTE: This is just for index.html; and is separate to the FluxController in members.html and membership-ng.js
fluxApp.controller('FluxController', function($scope, $log, $rootScope, $http){
  $rootScope._ = _;

  var flux = this;
  
  flux.api = function(path){
	  return "https://api.voteflux.org/" + path;
  };

  flux.members = 125;
  flux.incrementMembers = function(){
    flux.members += 1;
  };
  flux.loadMembers = function(){
    // use cors.io proxy to get around cors
    $http.get(flux.api('getinfo'))
      .success(function(data){
		  flux.members = data['n_members'];
      })
  };
  flux.loadMembers();

  flux.memberSubmit = function() {
    flux.showThanks();
    smoothScroll.animateScroll(null, '#membership');
  };

  flux._showThanks = false;
  flux.showThanks = function(){
    flux._showThanks = true;
  };
});
