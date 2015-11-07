var fluxApp = angular.module('fluxApp', []);

fluxApp.controller('FluxController', function($scope, $log, $rootScope){
  $rootScope._ = _;

  var flux = this;

  flux.members = 126;
})
