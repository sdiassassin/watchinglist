import 'bootstrap';
import './scss/app.scss';
import './scss/main.scss';
import './scss/main-responsive.scss';

let $ = require('jquery');
import Swiper from 'swiper';

$.fn.isInViewport = function () {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};

let debounce = function (func, wait) {
    // we need to save these in the closure
    let timeout, args, context, timestamp;

    return function () {

        // save details of latest call
        context = this;
        args = [].slice.call(arguments, 0);
        timestamp = new Date();

        // this is where the magic happens
        let later = function () {

            // how long ago was the last call
            let last = (new Date()) - timestamp;

            // if the latest call was less that the wait period ago
            // then we reset the timeout to wait for the difference
            if (last < wait) {
                timeout = setTimeout(later, wait - last);

                // or if not we can null out the timer and run the latest
            } else {
                timeout = null;
                func.apply(context, args);
            }
        };

        // we only need to set the timer now if one isn't already running
        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
    }
};

//Transform <img> to "background-image"
$(function () {
    let $item = $('[data-bg="true"]');

    $item.each(function () {
        let $this = $(this);

        $this.parent().css({
            'background-image': 'url("' + $this.attr('src') + '")'
        });
    });
});

//Swiper - Gallery
$(function () {
    const swiperWrapper = $('.swiper-home');

    if (swiperWrapper.length) {
        const swiper = new Swiper('.swiper-home', {
            loop: true,
            speed: 1000,
            noSwipingClass: '.swiper-home',
            slidesPerView: 1,
            autoplay: {
                delay: 3000
            },
            pagination: {
                el: '.swiper-home-wrapper .swiper-pagination',
                clickable: true,
                type: 'bullets',
            },
            // navigation: {
            //     nextEl: '.swiper-home-wrapper .swiper-btn-right',
            //     prevEl: '.swiper-home-wrapper .swiper-btn-left',
            // }
        });
    }
});

//Swiper - More
$(function () {
    const swiperWrapper = $('.swiper-more');

    if (swiperWrapper.length) {
        const swiper = new Swiper('.swiper-more', {
            loop: true,
            spaceBetween: 15,
            speed: 500,
            noSwipingClass: '.swiper-more',
            slidesPerView: 1,
            pagination: {
                el: '.swiper-more-wrapper .swiper-pagination',
                clickable: true,
                type: 'bullets',
            },
        });
    }
});

//Swiper - Product Gallery
$(function () {
    let galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 5,
        slidesPerView: 8,
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        breakpoints: {
            480: {
                slidesPerView: 4
            },
            768: {
                slidesPerView: 6
            },
            1024: {
                slidesPerView: 8
            },
            1280: {
                slidesPerView: 6
            }
        }
    });

    let galleryTop = new Swiper('.gallery-top', {
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        thumbs: {
            swiper: galleryThumbs
        }
    });

    function resizeThumbs() {
        if ($('.gallery-thumbs').length) {
            galleryThumbs.$el.find('.swiper-slide').each(function () {
                $(this).find('img').css({
                    height: $(this).width()
                });
            });
        }
    }

    $(window).on('resize', debounce(resizeThumbs, 100)).trigger('resize');
});

//Swiper - Categories
$(function () {
    const swiperWrapper = $('.swiper-categories');

    let swiper,
        swiperClone,
        swiperCategoriesMobile,
        swiperCategories = document.querySelectorAll('.swiper-categories .category'),
        more = document.querySelectorAll('.more');

    let treshold = 3;

    $(window).on('resize', function(){
        if ($(window).width() < 768) {
            if (!$('.swiper-categories-mobile').length) {
                swiperCategoriesMobile = $('<div class="swiper-categories-mobile" />').insertBefore('.swiper-categories-wrapper');

                for (let i = 0; i < swiperCategories.length; i++) {
                    swiperClone = swiperCategories[i].cloneNode(true);
                    swiperCategoriesMobile.append($(swiperClone));
                }

                for (let j = 8; j < (swiperCategoriesMobile[0].childNodes.length - 1); j++) {
                    swiperCategoriesMobile[0].childNodes[j].style.display = 'none';
                }
            }

            if (swiperWrapper.hasClass('swiper-container-horizontal')) {
                swiper.destroy();
            }

            $('.more').on('click', function(e){
                e.preventDefault();

                if ((8 + treshold) <= (swiperCategoriesMobile[0].childNodes.length - 1)) {
                    for (let k = 8; k < 8 + treshold; k++) {
                        swiperCategoriesMobile[0].childNodes[k].style.display = 'block';
                    }

                    treshold += 3;
                }
            });
        } else {
            if ($('.swiper-categories-mobile').length) {
                swiperCategoriesMobile.remove();
            }

            if (swiperWrapper.length) {
                swiper = new Swiper('.swiper-categories', {
                    speed: 700,
                    noSwipingClass: '.swiper-categories',
                    slidesPerView: 8,
                    spaceBetween: 15,
                    autoplay: {
                        delay: 4000
                    },
                    navigation: {
                        nextEl: '.swiper-categories-wrapper .swiper-btn-right',
                        prevEl: '.swiper-categories-wrapper .swiper-btn-left',
                    },
                    breakpoints: {
                        480: {
                            slidesPerView: 2
                        },
                        768: {
                            slidesPerView: 4
                        },
                        1000: {
                            slidesPerView: 6
                        }
                    }
                });
            }
        }
    }).trigger('resize');
});

//Navbar item dropdown
$(function () {
    let $item = $('[data-toggle="dropdown-custom"]'),
        $dropdown = $('.dropdown-custom');

    let a, b;

    function openDropdown() {
        clearTimeout(a);
        clearTimeout(b);

        let $this = $(this);

        if (!$this.closest('li').find('.dropdown-custom').hasClass('dropdown-custom-open')) {
            $this.closest('li').find('.dropdown-custom').show();
            setTimeout(function () {
                $this.closest('li').find('.dropdown-custom').addClass('dropdown-custom-open');
            }, 50);
        }
    }

    function closeDropdown() {
        a = setTimeout(function () {
            $dropdown.removeClass('dropdown-custom-open');
            b = setTimeout(function () {
                $dropdown.hide();
            }, 400);
        }, 200);
    }

    if ($(window).width() > 767) {
        $item.on('mouseenter', openDropdown);
        $dropdown.on('mouseenter', openDropdown);
        $item.on('mouseleave', closeDropdown);
        $dropdown.on('mouseleave', closeDropdown);
    } else {
        $item.on('click', function () {
            let $this = $(this);

            if (!$dropdown.hasClass('dropdown-custom-open')) {
                $this.closest('li').find('.dropdown-custom').show();
                setTimeout(function () {
                    $this.closest('li').find('.dropdown-custom').addClass('dropdown-custom-open');
                }, 50);

            } else {
                $dropdown.removeClass('dropdown-custom-open');
                $dropdown.hide();
            }
        });
    }
});

//Custom tooltip
$(function () {
    let $item = $('[data-trigger="tooltip"]'),
        $dropdown = $('.custom-tooltip');

    let a, b;

    function openDropdown() {
        clearTimeout(a);
        clearTimeout(b);

        let $this = $(this);

        $this.next().css({
            left: $this.offset().left - ($this.next().innerWidth() / 2) + ($this.width() / 2)
        });

        if (!$this.next().hasClass('custom-tooltip-open')) {
            $this.next().show();
            setTimeout(function () {
                $this.next().addClass('custom-tooltip-open');
            }, 50);
        }
    }

    function closeDropdown() {
        a = setTimeout(function () {
            $dropdown.removeClass('custom-tooltip-open');
            b = setTimeout(function () {
                $dropdown.hide();
            }, 400);
        }, 200);
    }

    if ($(window).width() > 767) {
        $item.on('mouseenter', openDropdown);
        $dropdown.on('mouseenter', openDropdown);
        $item.on('mouseleave', closeDropdown);
        $dropdown.on('mouseleave', closeDropdown);
    } else {
        $item.on('click', function () {
            let $this = $(this);

            if (!$dropdown.hasClass('custom-tooltip-open')) {
                $this.next().show();
                setTimeout(function () {
                    $this.next().addClass('custom-tooltip-open');
                }, 50);

            } else {
                $dropdown.removeClass('custom-tooltip-open');
                $dropdown.hide();
            }
        });
    }
});

//Navigation
$(function () {
    const $navigation = $('.navbar-menu');
    const $body = $('body');
    const $trigger = $('[data-toggle="navbar-menu"]');

    let a, b;

    function toggleMenu(e) {
        e.preventDefault();

        if (!$body.hasClass('menu-is-open')) {
            clearTimeout(b);

            $body.addClass('menu-is-open');
            $navigation.css('display', 'block');

            a = setTimeout(function () {
                $navigation.addClass('menu-open');
            }, 50);
        } else {
            $body.removeClass('menu-is-open');
            $navigation.removeClass('menu-open');

            b = setTimeout(function () {
                $navigation.css('display', '');
            }, 400);
        }
    }

    $trigger.bind('click', toggleMenu);
});

//Toggle filter for mobile
$(function(){
    let element = $('.filter-wrapper'),
        trigger = $('a[data-trigger="filter"]'),
        close = $('.filter-close');

    function toggle(e) {
        e.preventDefault();
        let $this = $(this);

        if (!element.hasClass('active')) {
            element.addClass('active');
        } else {
            element.removeClass('active');
        }
    }

    trigger.on('click', toggle);
    close.on('click', toggle);
});

//Custom dropdown
$(function () {
    let $trigger = $('[data-toggle="select-box"]'),
        $option = $('.select-box-custom-option');

    function toggleSelect() {
        let $this = $(this);

        $('.select-box-custom').siblings('.select-box-custom').removeClass('active');

        if (!$this.closest('.select-box-custom').hasClass('active')) {
            $this.closest('.select-box-custom').addClass('active');
        } else {
            $this.closest('.select-box-custom').removeClass('active');
        }
    }

    function selectOption(e) {
        e.preventDefault();
        let $this = $(this);

        if ($this.closest('.select-box-custom').find('.select-box-custom-selected').length) {
            $this.closest('.select-box-custom').find('.select-box-custom-selected').text($this.text());
        }

        $this.closest('.select-box-custom').find('input').val($this.text().toLowerCase());

        $('.select-box-custom').removeClass('active');
    }

    $(document).click(function (e) {
        let container = $('.select-box-custom');

        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.removeClass('active');
        }
    });

    $(document).on('keydown', function (e) {
        let keyCode = e.keyCode || e.which;

        if (keyCode == 9) {
            if ($('.select-box-custom').hasClass('active')) {
                $('.select-box-custom').removeClass('active');
            }
        }
    });

    $(document).on('click', '[data-toggle="select-box"]', toggleSelect);
    $(document).on('click', '.select-box-custom-option', selectOption);
    $trigger.click(toggleSelect);
    $option.click(selectOption);
});

//Replace old select with custom dropdown
$(function () {
    let $field = $('select');

    $field.each(function () {
        let $this = $(this);

        let $template = $('<div class="select-box-custom">' +
            '    <input type="text" />' +
            '    <div class="select-box-custom-selected" data-toggle="select-box">' + $this.data('placeholder') + '</div>' +
            '    <ul class="select-box-custom-dropdown">' +
            '    </ul>' +
            '</div>');

        $template.addClass($this[0].className);
        $template.insertBefore($this);
        $this.find('option').each(function () {
            let $thisOption = '<li class="select-box-custom-option">' + $(this).text() + '</li>';

            $this.prev().find('.select-box-custom-dropdown').append($thisOption);
        });
    });
});

//Price
$(function(){
    $('.input-number, .input-price').bind('keypress', function () {
        return isNumberKey(event);
    });
});

function isNumberKey(evt) {
    let charCode = (evt.which) ? evt.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

//Dismiss navbar-band
$(function() {
    let navbarBand = $('.navbar-band'),
        closeBand = $('.navbar-band-close'),
        header = $('header'),
        body = $('body');

    function close(e) {
        e.preventDefault();

        navbarBand.css({
            display: 'none'
        });

        body.css({
            paddingTop: header.innerHeight()
        });
    }

    closeBand.on('click', close);
});

//Table selectable
$(function(){
    let item = $('.table-messages .table-messages-tbody-tr, .table-listings .table-listings-tbody-tr');

    item.find('.table-checkbox').on('click', function(){
        let $this = $(this);

        if (!$this.closest(item).hasClass('selected')) {
            $this.closest(item).addClass('selected');
        } else {
            $this.closest(item).removeClass('selected');
        }

        if ($('.table-listings-tbody-tr.selected').length || $('.table-messages-tbody-tr.selected').length) {
            $('.listing-actions').addClass('show');
        } else {
            $('.listing-actions').removeClass('show');
        }
    });
});