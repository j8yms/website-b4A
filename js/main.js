(function($) {

	"use strict";


    // preloader
    $(window).on('load', function(){
      $('#preloader').fadeOut('slow',function(){$(this).remove();});
    });
    

    // Navbar
     jQuery('#main-nav').stellarNav({
        theme: 'light',
        breakpoint: 991,
        openingSpeed: 350,
        closingDelay: 50,
        position: 'right',
        sticky: false,
        menuLabel: '',
        closeLabel: ''
    });



     // Fixd nav script
    $(window).scroll(function(){
        if( $(window).scrollTop()>100 ){
            $('.sticky').addClass('fixed-header');
            } else {
            $('.sticky').removeClass('fixed-header');
        }
    });


    // Pogo Slider
    if($('#pogo-slider').length > 0){
            $('#pogo-slider').pogoSlider({
            autoplay: true,
            autoplayTimeout: 5000,
            displayProgess: true,
            targetWidth: 1920,
            // targetHeight: 500,
            responsive: true,
            pauseOnHover: false,
        }).data('plugin_pogoSlider');
    }



    // AOS animation
    AOS.init();
    

    // CounterUp
    $('.counter').counterUp({
          delay: 30,
          time: 2000
      });


    // isotope Active for portfolio
    $(window).on('load', function() {
    
        function sortingGallery() {
            if ($(".sortable-gallery .gallery-filters").length) {
                var $container = $('.gallery-container');
                $container.isotope({
                    filter:'*',
                    animationOptions: {
                        duration: 750,
                        easing: 'linear',
                        queue: false,
                    }
                });
    
                $(".gallery-filters li a").on("click", function() {
                    $('.gallery-filters li .active').removeClass('active');
                    $(this).addClass('active');
                    var selector = $(this).attr('data-filter');
                    $container.isotope({
                        filter:selector,
                        animationOptions: {
                            duration: 750,
                            easing: 'linear',
                            queue: false,
                        }
                    });
                    return false;
                });
            }
        }
        sortingGallery();
    
    });


    // flashy for lightbox
    $('.lightbox').flashy({
        title:true,
        prevShowClass: 'fx-holeIn',
        nextShowClass: 'fx-holeIn',
        prevHideClass: 'fx-spaceOutDown',
        nextHideClass: 'fx-spaceOutDown'
    });
    

    //flashy for popup video
    $('.mixed').flashy({
        videoAutoPlay:false,
    });


    // Testimonial carousel
    if($('.testimonial-slider').length){
        $('.testimonial-slider').owlCarousel({
            loop: true,
            margin: 30,
            dots: true,
            nav: false,
            autoplayHoverPause: false,
            autoplay: true,
            autoplayTimeout: 3000,
            smartSpeed: 700,
            // navText: [
            //   '<i class="fa fa-long-arrow-down"></i>',
            //   '<i class="fa fa-long-arrow-up"></i>'
            // ],
            responsive: {
                0: {
                    items: 1,
                    center: false
                },
                480:{
                    items:1,
                    center: false
                },
                600: {
                    items: 1,
                    center: false
                },
                768: {
                    items: 1
                },
                992: {
                    items: 1
                },
                1200: {
                    items: 1
                }
            }
        })
    }


    // Tab
    $('.tab ul.tabs').addClass('active').find('> li:eq(0)').addClass('current');
    
    $('.tab ul.tabs li a').click(function (g) { 
        var tab = $(this).closest('.tab'), 
            index = $(this).closest('li').index();
        
        tab.find('ul.tabs > li').removeClass('current');
        $(this).closest('li').addClass('current');
        
        tab.find('.tab_content').find('div.tabs_item').not('div.tabs_item:eq(' + index + ')').slideUp();
        tab.find('.tab_content').find('div.tabs_item:eq(' + index + ')').slideDown();
        
        g.preventDefault();
    } );


    // Background Image Call Script
    if ($('.background-image').length > 0) {
        $('.background-image').each(function () {
            var src = $(this).attr('data-src');
            $(this).css({
                'background-image': 'url(' + src + ')'
            });
        });
    }




    // Parallax background
    $('.jarallax').jarallax({
        speed: 0.5
    });


     // Back To Top
    if ($('#back-to-top').length) {
        var scrollTrigger = 100, // px
            backToTop = function () {
                var scrollTop = $(window).scrollTop();
                if (scrollTop > scrollTrigger) {
                    $('#back-to-top').addClass('show');
                } else {
                    $('#back-to-top').removeClass('show');
                }
            };
        backToTop();
        $(window).on('scroll', function () {
            backToTop();
        });
        $('#back-to-top').on('click', function (e) {
            e.preventDefault();
            $('html,body').animate({
                scrollTop: 0
            }, 1000);
        });
    }


})(window.jQuery);