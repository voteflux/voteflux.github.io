$(document).ready(function() {




if ( $('#js-candidates').length != 0 ) {
  // init slick carousel
  $('#js-candidates').slick({
    autoplay: false,
    speed: 700,
    arrows: false,
    focusOnSelect: false,
    cssEase: 'ease',
    responsive: [
      {
        breakpoint: 2000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          dots: true
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2,
          dots: true
        }
      },
      {
        breakpoint: 480,
        settings: {
           arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  })
};





  var $root = $('html, body');

// animate scroll behaviour on side menu
  $("a[href^='#']").on('click', function(e) {

    // prevent default anchor click behavior
    e.preventDefault();
       // store hash
    var hash = this.hash;

    // animate
    $root.animate({
      scrollTop: $(hash).offset().top
    }, 500, 'swing', function(){

       // when done, add hash to url
       window.location.hash = hash;
     });
  });

  //  offset hash location when arriving from external link
  //
  // grab target from URL hash (i.e. www.mysite.com/page-a.html#target-name)
  var target = window.location.hash;

  // only try to scroll to offset if target has been set in location hash
  if ( target != '' ){
    var $target = $(target);

    $root.stop().animate({
      'scrollTop': $target.length && $target.offset().top
    }, 500,'swing', function () {
      // when done, add hash to url
      window.location.hash = target ;
    });
  };





  // meetup
  // $.ajax({
  //   url: "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=FluxSydney&sig=3ddb1a95711db994ebba2b2dc0d2e7ffb09e40fa&page=200&fields=&sig_id=96374432&order=time&desc=false&status=upcoming",
  //   error: function() {
  //     console.log('error');
  //   },
  //   success: function(response) {
  //     console.log(response);
  //     var d = response.results[0];

  //   },
  //   type: 'GET'
  // })

  // get info ajax request
  $.ajax({
    url: "https://api.voteflux.org/api/v0/getinfo",
    data: {
      format: 'json'
    },
    error: function() {
      console.log('error')
    },
    success: function(response) {
      var data = JSON.parse(response)
      var memberCount = data.n_members
      var el = document.getElementById("js-member-count")
      var elMobile = document.getElementById("js-member-count-mobile")

      if (el) {
        el.innerHTML = memberCount.toString()
      }
      if (elMobile) {
        elMobile.innerHTML = memberCount.toString()
      }
    },
    type: 'GET'
  });



	var dteNow = new Date();
	var intYear = dteNow.getFullYear();
  var elemYear = document.getElementById("js-footer-year");
	elemYear.innerHTML = intYear


  // menu
  var isOpen = true;
  var transitionTime = 150;

  $("#js-menu-button").on('tap', function() {
    toggleMenu();
  });
  $("#js-menu a").on('tap', function() {
    toggleMenu();
  });

  function toggleMenu() {
    isOpen = !isOpen;
    if (!isOpen) {
      $("#js-menu").addClass('opacity-1 will-change-opacity').removeClass('hide').removeClass('opacity-0');
      $("#js-navbar-join-btn").addClass('opacity-0 will-change-opacity').removeClass('opacity-1').addClass('hide');
      $('.flux-logo-text').css({ fill: "#fff" });
      $("#js-flux-logo-home-light").addClass('opacity-1');
      $("#js-flux-logo-text").addClass('fixed').removeClass('absolute');
      $("#js-flux-logo-home-dark").removeClass('opacity-0');
    } else {
      $("#js-flux-logo-text").addClass('absolute').removeClass('fixed');
      $("#js-menu").addClass('opacity-0').removeClass('opacity-1');
      $("#js-navbar-join-btn").addClass('opacity-1').removeClass('opacity-0, hide');
      $('.flux-logo-text').css({ fill: "#222" });
      $("#js-flux-logo-home-light").removeClass('opacity-1');
      $("#js-flux-logo-home-dark").addClass('opacity-0');
      setTimeout(function() {
        $("#js-menu")
          .addClass('hide')
          .removeClass('will-change-opacity');
      }, transitionTime);
    }
    // for hamburger animation
    $("#js-menu-button").toggleClass('is-active');
  };



});
