var fluxApp = angular.module('fluxApp', []);


// NOTE: This is just for index.html; and is separate to the FluxController in members.html and membership-ng.js
fluxApp.controller('FluxController', function ($scope, $log, $rootScope, $http) {
    $rootScope._ = _;

    var flux = this;
    flux.membershipError = '';

    if (document.location.hostname == 'localhost') {
        flux.debug = true;
    }

    var getEntry = function (name) {
        var obj = $("[name='" + name + "']");
        $log.log(obj);
        return obj.val();
    };

    flux.handleError = function(error){
        $log.log('An error occured:');
        $log.log(error);
    };

    flux.api = function (path) {
        if (flux.debug) {
            return "http://localhost:5000/api/v0/" + path;
        }
        return "https://api.voteflux.org/api/v0/" + path;
    };

    flux.members = 800;
    flux.validMembers = 550;
    flux.signup_ago = 'an hour ago';
    flux.incrementMembers = function () {
        flux.members += 1;
    };
    flux._setNewestMemberAgo = function(){
        flux.signup_ago = moment().to(moment(flux.last_member_signup));
    };
    flux.loadMembers = function () {
        $log.log('Loading members');
        $http.get(flux.api('getinfo'))
            .success(function (data) {
                flux.members = data['n_members'];
                flux.validMembers = data['n_members_validated'];
                flux.last_member_signup = data['last_member_signup'] * 1000;
                flux._setNewestMemberAgo();
            });
        setTimeout(flux.loadMembers, 1000 * 61 * 1);
    };
    flux.loadMembers();

    var postcodeTest = /.*[0-9]{4,}.*/;

    flux.hasPostcode = false;
    flux.checkPostcode = function(){
        $log.log(postcodeTest.exec(flux.address));
        $log.log(flux.address);
        flux.hasPostcode = !postcodeTest.exec(flux.address);
    }

    flux.memberSubmit = function () {
        flux.showThanks();
        smoothScroll.animateScroll(null, '#membership');

        var dob = new Date();
        dob.setUTCDate(getEntry('entry.1115890700_day'));
        dob.setUTCMonth(parseInt(getEntry('entry.1115890700_month')) - 1);
        dob.setUTCFullYear(getEntry('entry.1115890700_year'));
        dob.setUTCHours(0);
        dob.setUTCMinutes(0);
        var to_send = {
            'name': getEntry('entry.1069132858'),
            'valid_regions': getEntry('entry.485675243') === "Yes" ? ['AUS'] : [],
            'onAECRoll': getEntry('entry.485675243') === "Yes",
            'email': getEntry('entry.1201109565'),
            'address': getEntry('entry.1799101669'),
            'dob': dob,
            'contact_number': getEntry('entry.134473684'),
            'referred_by': getEntry('entry.279410956'),
            'member_comment': getEntry('entry.1861406557'),
            'session_uuid': flux._uuid,
            'href': document.location.href
        };

        $log.log(to_send);
        keenClient.addEvent("register_press_index", to_send, _handleKeenError);

        $http.post(flux.api('register/all_at_once'), to_send).then(
            function (data) {
                $http.post(flux.api('stats/all_at_once'));
            }, function (error) {
                $http.post(flux.api('error/all_at_once'), error);
                toastr.error(error.data.error_args);
                $log.log(error.data);
                flux._showThanks = false;
                flux.membershipError = error.data.error_args;
            }
        );
    };

    flux._showThanks = false;
    flux.showThanks = function () {
        flux._showThanks = true;
        flux.membershipError = '';
    };

    flux.btnClickLog = function(btnRef){
        if (!flux.debug) {
            keenClient.addEvent('btn_click', {'btn': btnRef, 'uuid': flux._uuid});
        } else {
            $log.log('Button Click: ' + btnRef);
        }
    };

    flux._uuid = createGuid();

    var referrer = getParam('r');

    if(referrer === undefined){
        utmSource = getParam('utm_source');
        utmCampaign = getParam('utm_campaign');
        if(utmSource != undefined && utmCampaign != undefined){
            referrer = utmSource + "-" + utmCampaign;
        }
    }

    if(referrer){
        var refInput = $("#ref-input");
        refInput.val(referrer);
        refInput.hide();
        $("#ref-label").hide();
    }

    flux.referrer = referrer;

    if(!flux.debug) {
        keenClient.addEvent('page_load', {
            'ref': document.referrer,
            'uuid': flux._uuid,
            'href': document.location.href,
            'referrer': flux.referrer
        });
    }

    flux.articles = [];
    $http.get("/articles.json").then(function(data){ flux.articles = data['data']; $log.log(data); }, flux.handleError);

    $http.get(flux.api('public_stats')).then(function(data){
        $log.log("Got public stats ---V ");
        $log.log(data['data']);

        var tss = _.map(data.data.signup_times, function(ts){return new Date(ts*1000);});
        tss.reverse();
        var ns = _.range(1, tss.length + 1);
        var plotData = [{x: tss, y: ns, type: 'scatter'}];
        Plotly.newPlot('membershipChart', plotData, {title: 'Members v Time'});

        var years = Object.keys(data.data.dob_years);
        years.sort();
        var year_freq = _.map(years, function(y){return data.data.dob_years[y]});
        var plotData2 = [{x: years, y: year_freq, type: 'bar'}];
        Plotly.newPlot('memberDobYearChart', plotData2, {title: 'Member Years of Birth'});

        var states = Object.keys(data.data.states);
        states.sort();
        var state_n = _.map(states, function(y){return data.data.states[y]});
        var plotData3 = [{x: states, y: state_n, type: 'bar'}];
        Plotly.newPlot('memberStateChart', plotData3, {title: 'Member States'});

        var nDays = 30;
        var _now = Date.now();
        var recent_tss = _.filter(data.data.signup_times, function(timestamp){ return timestamp*1000 > (_now - 1000 * 60 * 60 * 24 * (nDays + 1)); });

        // http://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
        function toJSONLocal (date) {
            var local = new Date(date);
            local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            return local.toJSON().slice(0, 10);
        }

        var timestamp_counter = {};
        _.map(recent_tss, function(ts){
            var ts_date = new Date(ts*1000);
            var local_y_m_d = toJSONLocal(ts_date);
            if (timestamp_counter[local_y_m_d] === undefined){  // why can't js have a nice std lib like python? Counter anyone
                timestamp_counter[local_y_m_d] = 1
            } else { timestamp_counter[local_y_m_d] += 1; }
        })
        var results = timestamp_counter;
        $log.log(results);
        var dates4 = Object.keys(results);
        dates4.pop();  // account for the one day added when generating recent_tss;
        var newMembers = _.map(dates4, function(d){ return results[d]; });
        newMembers.pop();  // account for the one day added when generating recent_tss;
        var plotData4 = [{x: dates4, y: newMembers, type: 'bar'}];

        Plotly.newPlot('memberSignupDaysAgo', plotData4, {
            title: 'Member Signup for Last 30 Days',
            xaxis: {title: 'Days Ago'}, yaxis: {title: '# Signups'}
        });


        $log.log('Drew Charts');
    }, flux.handleError)
});
