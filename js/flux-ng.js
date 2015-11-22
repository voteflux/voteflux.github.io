var fluxApp = angular.module('fluxApp', []);


// NOTE: This is just for index.html; and is separate to the FluxController in members.html and membership-ng.js
fluxApp.controller('FluxController', function($scope, $log, $rootScope, $http){
  $rootScope._ = _;

  var flux = this;

  if (document.location.hostname == 'localhost'){
    flux.debug = true;
  }

  flux.api = function(path){
    if (flux.debug){
      return "http://localhost:5000/" + path;
    }
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

    var getEntry = function(name){
      var obj = $("[name='" + name + "']");
      $log.log(obj);
      return obj.val();
    };

    var dob = new Date();
    dob.setUTCDate(getEntry('entry.1115890700_day'));
    dob.setUTCMonth(parseInt(getEntry('entry.1115890700_month')) - 1);
    dob.setUTCFullYear(getEntry('entry.1115890700_year'));
    var to_send = {
      'name': getEntry('entry.1069132858'),
      'valid_regions': getEntry('entry.485675243') === "Yes" ? ['AUS'] : [],
      'email': getEntry('entry.1201109565'),
      'address': getEntry('entry.1799101669'),
      'dob': dob,
      'contact_number': getEntry('entry.134473684'),
      'referred_by': getEntry('entry.279410956'),
      'member_comment': getEntry('entry.1861406557')
    };

    $log.log(to_send);

    $http.post(flux.api('register/all_at_once'), to_send).then(
        function(data){
          $http.post(flux.api('stats/all_at_once'));
        }, function(error){
          $http.post(flux.api('error/all_at_once'), error);
          toastr.error(error.data.error_args);
          $log.log(error.data);
        }
    );
  };

  flux._showThanks = false;
  flux.showThanks = function(){
    flux._showThanks = true;
  };
});
