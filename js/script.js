function fadedEls(el, shift) {
  el.css('opacity', 0);

  switch (shift) {
  case undefined:
    shift = 0
    break;
  case 'h':
    shift = el.eq(0).outerHeight();
    break;
  case 'h/2':
    shift = el.eq(0).outerHeight() / 2;
    break;
  }

  $(window).resize(function() {
    if (!el.hasClass('ani-processed')) {
      el.eq(0).data('scrollPos', el.eq(0).offset().top - $(window).height() + shift);
    }
  }).scroll(function() {
    if (!el.hasClass('ani-processed')) {
      if ($(window).scrollTop() >= el.eq(0).data('scrollPos')) {
        el.addClass('ani-processed');
        el.each(function(idx) {
          $(this).delay(idx * 200).animate({opacity:1}, 600);
        });
      }
    }
  });
}


(function($) {
$(function() {


  if (/msie/i.test(navigator.userAgent)) {
    $('img').each(function() {
      $(this).css({
        width: $(this).attr('width') + 'px',
        height: 'auto'
      });
    });
  }


  // Set sidebar height
  $(window).resize(function() {
    var h = 0;

    $('body > .page-wrapper > section:not(.header-9-sub)').each(function() {
      h += $(this).outerHeight();
    });

    $('.sidebar-content').css('height', h+'px');
  });


  // Faded elements
  fadedEls($('.content-features .col-sm-7.col-sm-offset-3 img'), $('.content-features .col-sm-7.col-sm-offset-3 img').outerHeight()/3*2);
  fadedEls($('.content-features .box [class*="fui-"]'), 'h');
  fadedEls($('.content-9 .col-sm-3 img'), 'h');




  $(window).resize().scroll();

});


$(window).load(function() {

  $('html').addClass('loaded');

  $(window).resize().scroll();

});
})(jQuery);
