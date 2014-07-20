jQuery(document).ready(function($){

    $(window).stellar();

    var links = $('.navigation').find('li');
    slide = $('.slide');
    button = $('.button');
    mywindow = $(window);
    htmlbody = $('html,body');

//waypoint 1 for offsetting scroll down
slide.waypoint(function (direction) {

    dataslide = $(this).attr('data-slide');
  if (direction === 'down') {
    $('.navigation li[data-slide="' + dataslide + '"]').addClass('active').prev().removeClass('active');

  }
}, {
  offset: function() {

    return $(".menu").outerHeight(true)+1;
  }
});

//waypoint 2 for offsetting scroll up
slide.waypoint(function (direction) {
 dataslide = $(this).attr('data-slide');
 if (direction === 'up') {
     $('.navigation li[data-slide="' + dataslide + '"]').addClass('active').next().removeClass('active');

  }
}, {
  offset: function() {
    return $(".menu").outerHeight(true)-2; // -1px to pass the waypoint, then another pixel as the jquery animate offset needs -1 to compensate for browser rounding differences 
  }

});

    mywindow.scroll(function () {
        if (mywindow.scrollTop() == 0) {
            $('.navigation li[data-slide="1"]').addClass('active');
            $('.navigation li[data-slide="2"]').removeClass('active');
        }
    });

    function goToByScroll(dataslide, menuHeight) {
        htmlbody.animate({
            scrollTop: $('.slide[data-slide="' + dataslide + '"]').offset().top - menuHeight
        }, 2000, 'easeInOutQuint');        
    }

    links.click(function (e) {
        e.preventDefault();
        dataslide = $(this).attr('data-slide');
        menuHeight = $(".menu").outerHeight(true)-1; // Calculate .menu height and then subtract by 1px to compensate for browser rounding (when the slide heights aren't whole numbers).
        goToByScroll(dataslide, menuHeight);
    });

    button.click(function (e) {
        e.preventDefault();
        dataslide = $(this).attr('data-slide');
        menuHeight = $(".menu").outerHeight(true)-1; // Calculate .menu height and then subtract by 1px to compensate for browser rounding (when the slide heights aren't whole numbers Chrome rounds the Opposite way to FF and can leave a 1px gap between the slide and head).
        goToByScroll(dataslide, menuHeight);

    });

});