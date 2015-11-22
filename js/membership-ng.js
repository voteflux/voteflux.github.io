var app = angular.module('fluxMembersApp', ['ngStorage']);

app.controller('FluxController', function($scope, $log, $rootScope, $http, $localStorage){
    //
    // Variables needed
    //

    $rootScope._ = _;
    $scope.$storage = $localStorage;

    var flux = this;
    flux.members = 125;
    flux._showThanks = false;
    flux.errorMsg = '';
    flux.debug = false;
    flux.valid_regions = [];
    flux.set_password = false;

    if (document.location.hostname == 'localhost'){
        flux.debug = true;
    }

    //
    // Functions: api
    //

    flux.api = function(path){
        if (flux.debug){
            return "http://localhost:5000/" + path;
        }
        return "https://api.voteflux.org/" + path;
    };

    //
    // functions utils
    //

    flux.handleError = function(error){
        flux._showError(error);
        $log.log(error);
    };
    flux._showError = function(error){
        flux.errorMsg = typeof error === 'object' ? JSON.stringify(error) : error;
        toastr.error(flux.errorMsg);
    };

    //
    // functions: legacy
    //

    flux.incrementMembers = function(){
        flux.members += 1;
    };

    flux.loadMembers = function(){
        $http.get(flux.api('getinfo'))
            .then(function(data){
                flux.members = data['n_members'];
            }, flux.handleError);
    };

    flux.memberSubmit = function() {
        flux.showThanks();
        smoothScroll.animateScroll(null, '#membership');
    };

    flux.showThanks = function(){
        flux._showThanks = true;
    };

    //
    // functions login
    //

    flux.loggingIn = function(){
        flux._loggingIn = true;
    };
    flux.finishedLoggingIn = function(){
        flux._loggingIn = false;
        $scope.$apply();
    };

    flux.loginFromSessionToken = function(token){
        flux.loggingIn();
        Parse.User.become(token).then(flux._setLoggedInAs, flux.handleError);
    };
    flux._setSessionToken = function(token){
        $localStorage.sessionToken = token;
        flux.sessionToken = token;
    };

    flux._setLoggedInAs = function(user){
        $log.log('Debug: _setLoggedInAs: ' + user.id);
        flux.loggedIn = true;
        flux.userId = user.id;
        flux._setVarsFromUser(user);
        flux.user = user;
        flux.finishedLoggingIn();
    };

    flux.logOut = function(){
        flux.loggedIn = false;
        flux.userId = undefined;
        flux.user = undefined;
        flux.username = undefined;
        delete $localStorage.sessionToken;
        flux.finishedLoggingIn();
    }

    if ($localStorage.sessionToken !== undefined){
        flux.loginFromSessionToken($localStorage.sessionToken);
    }

    //
    // functions object management
    //

    flux._setProperty = function(property, value){
        $log.log('Setting flux.' + property + ' as ' + value);
        flux[property] = value;
    };
    flux._setPropertyFromParseObj = function(obj, property){
        flux._setProperty(property, obj.get(property));
    };
    flux._setPropertiesFromParseObj = function(obj, properties){
        _propSet = function(_property){ flux._setPropertyFromParseObj(obj, _property); };
        properties.map(_propSet);
    };

    flux._setParseObjPropFromFlux = function(obj, property){
        $log.log("Setting " + property + " with value " + flux[property] + " on " + obj.id);
        obj.set(property, flux[property]);
    }

    var user_fields = ['username', 'email', 'name', 'address', 'valid_regions', 'set_password', 'dob', 'contact_number', 'member_comment', 'referred_by'];
    flux._setVarsFromUser = function(user){
        flux._setPropertiesFromParseObj(user, user_fields);
        flux.onAECRoll = $.inArray('AUS', flux.valid_regions) !== -1 ? 'Yes' : 'No';
        try {
            flux.dobDay = flux.dob.getDate().toString();
            flux.dobMonth = (flux.dob.getMonth() + 1).toString(); // offset for js values of month
            flux.dobYear = flux.dob.getFullYear().toString();
        } catch(err) {
            flux.dobDay = "1";
            flux.dobMonth = "1";
            flux.dobYear = "1999";
        }
    };


    //
    // functions REGISTRATION
    //

    flux._regButtonDisable = function(){
        $("#reg-email-btn-next").prop('disabled', true);
    };
    flux._regButtonEnable = function(){
        $("#reg-email-btn-next").prop('disabled', false);
    };

    flux.regFromEmailInput = function(){
        flux.email = $("#reg-email").val();
        flux._regButtonDisable();
        flux.registrationStep1(flux.email);
    };

    flux.registrationStep1 = function(email){
        $log.log("Registering : " + email);
        $http.post(flux.api('register/initial_email'), {'email': email})
            .then(flux._successfulEmailRegister, function(error){
                flux.handleError(error);
                flux._regButtonEnable();
            });
    };

    flux._successfulEmailRegister = function(resp){
        var data = resp.data;
        $log.log(data);
        flux._regButtonEnable();
        flux._setSessionToken(data.sessionToken);
        flux.loginFromSessionToken(data.sessionToken);
    };

    //
    // functions user management
    //

    flux.saveUserDetails = function() {
        toastr.info("User " + flux.username + " details saving.", "Saving..");
        flux.dob = new Date(flux.dobYear, flux.dobMonth - 1, flux.dobDay, 0, 0, 0, 0);
        $log.log(flux.dob);
        if (flux.onAECRoll != 'Yes') // if we are marked as not being on the roll don't include AUS as a region
            _.remove(flux.valid_regions, function (t) {
                return t == 'AUS'
            });
        else if (!_.includes(flux.valid_regions, 'AUS')) // if we are on the roll and don't have 'AUS' in our list, add it
            flux.valid_regions.push('AUS');
        $log.log(flux.valid_regions);
        flux.username = flux.email;
        _.map(user_fields, _.partial(flux._setParseObjPropFromFlux, flux.user));
        flux.user.save().then(function(user){ toastr.success("User " + flux.username + " details saved.", "Saved!"); }, flux.handleError);
    };

    //
    // call these functions when script loads
    //

    flux.loadMembers();
});
