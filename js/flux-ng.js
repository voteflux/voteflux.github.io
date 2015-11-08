var fluxApp = angular.module('fluxApp', []);

fluxApp.controller('FluxController', function($scope, $log, $rootScope, $http){
  $rootScope._ = _;

  var flux = this;

  flux.members = 125;
  flux.incrementMembers = function(){
    flux.members += 1;
  }
  flux.loadMembers = function(){
    // use cors.io proxy to get around cors
    $http.get('http://cors.io/?u=https://docs.google.com/spreadsheets/d/1oODt6m__XMuTT69nekt98ZY6Cl_cWpaQenMrjmLqDmo/pubchart?oid=53928827&format=interactive')
      .success(function(data){
        var pattern = /\d+/g;
        var numbers = data.match(pattern);
        // choose whatever is 20th from the end, should be the right number...
        flux.members = parseInt(numbers[numbers.length - 20], 10);
        // $log.log(numbers);
      })
  }
  flux.loadMembers();

  flux.memberSubmit = function(){
    flux.showThanks();
    smoothScroll.animateScroll(null, '#membership');
  }

  flux._showThanks = false;
  flux.showThanks = function(){
    flux._showThanks = true;
  }
})
