var fluxApp = angular.module('fluxApp', []);

fluxApp.controller('FluxController', function($scope, $log, $rootScope){
  $rootScope._ = _;

  var flux = this;

  flux.members = 126;
  flux.incrementMembers = function(){
    flux.members += 1;
  }

  flux._showThanks = false;
  flux.showThanks = function(){
    flux._showThanks = true;
  }
})
