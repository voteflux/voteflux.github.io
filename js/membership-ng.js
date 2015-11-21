var app = angular.module('fluxMembersApp', []);

app.controller('FluxController', function($scope, $log, $rootScope, $http){
    $rootScope._ = _;

    var flux = this;
    flux.members = 125;
    flux._showThanks = false;
    flux.errorMsg = '';
    flux.setMemberDetails = false;

    if (document.location.hostname == 'localhost'){
        flux.debug = true;
    }

    flux.api = function(path){
        if (flux.debug){
            return "http://localhost:5000/" + path;
        }
        return "https://api.voteflux.org/" + path;
    };

    flux.incrementMembers = function(){
        flux.members += 1;
    };

    flux.loadMembers = function(){
        $http.get(flux.api('getinfo'))
            .success(function(data){
                flux.members = data['n_members'];
            })
    };

    flux.memberSubmit = function() {
        flux.showThanks();
        smoothScroll.animateScroll(null, '#membership');
    };

    flux.showThanks = function(){
        flux._showThanks = true;
    };

    flux.regFromEmail = function(){
        var email = $("#reg-email").val();
        $("#reg-email-btn-next").prop('disabled', true);
        flux.registrationStep1(email);
    }
    flux.registrationStep1 = function(email){
        $log.log( {'email': email});
        $http.post(flux.api('register/initial_email'), {'email': email})
            .success(function(data){
                $log.log(data);
                Parse.User.become(data['sessionToken'])
                    .then(function(user){
                        flux.loggedIn = true;
                        flux.userId = user.id;
                        flux.user = user;
                        flux.setMemberDetails = true;
                        $scope.$apply();
                    }, function(error){
                        $log.log(error);
                    });
            }).error(function(error){
                $log.log(error);
                flux.errorMsg = error;
                $("#reg-email-btn-next").prop('disabled', false);
            });
    };

    flux.loadMembers();
});
