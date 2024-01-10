import 'swiper/swiper-bundle.min.css'
import $ from "jquery";
import lenis from './vendors/lenis';
import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { parseRem, xSetter, ySetter, xGetter, yGetter, pointerCurr, lerp } from "./untils";
import homeScript from './home';
import termScript from './term';
import blogdtlScript from './blogdtl';
import aboutScript from './about';
import solutionScript from './solution';
import insightScript from './insight';

const scripts = () => {
    if (history.scrollRestoration) {
        history.scrollRestoration = "manual";
    }

    barba.use(barbaPrefetch);
    gsap.registerPlugin(ScrollTrigger);

    function debounce(func, delay = 100){
        let timer;
        return function(event) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(func, delay, event);
        };
    }
    function refreshOnBreakpoint() {
        let initialViewportWidth = window.innerWidth || document.documentElement.clientWidth;
        let newViewportWidth;
        // portrait mobile viewport initial, any change refresh
        if (initialViewportWidth < 480) {
            $(window).on('resize', debounce(function() {
                newViewportWidth = window.innerWidth || document.documentElement.clientWidth;
                if (newViewportWidth > 479) {
                    location.reload();
                }
            }))
        }
        // landscape mobile viewport initial, any change refresh
        else if (initialViewportWidth < 768) {
            $(window).on('resize', debounce(function() {
                newViewportWidth = window.innerWidth || document.documentElement.clientWidth;
                if (newViewportWidth > 767) {
                    location.reload();
                }
            }))
        }
        // tablet viewport initial, any change refresh
        else if (initialViewportWidth > 767 && initialViewportWidth < 992)  {
            $(window).on('resize', debounce(function() {
                newViewportWidth = window.innerWidth || document.documentElement.clientWidth;
                if (newViewportWidth < 768 || newViewportWidth > 991) {
                    location.reload();
                }
            }))
        }
        // web viewport initial, any change refresh
        else if (initialViewportWidth > 991) {
            $(window).on('resize', debounce(function() {
                newViewportWidth = window.innerWidth || document.documentElement.clientWidth;
                if (newViewportWidth < 992) {
                    location.reload();
                }
            }))
        }
    }
    refreshOnBreakpoint();
    function addNavActiveLink(data) {
        $('[data-link]').removeClass('active')
        $(`[data-link="${$(data.next.container).attr('data-namespace')}"]`).addClass('active')
    }
    function handleHeaderMode(data) {
        $('.header').removeClass('on-hide dark-mode')
        if ($(data.next.container).attr('data-header') == 'dark') {
            $('.header').addClass('dark-mode')
        }
    }
    function resetScroll() {
        let locationHash = window.location.hash;
        lenis.stop()
        if ($(locationHash).length) {
            setTimeout(() => {
                lenis.scrollTo(locationHash, {
                    force: true,
                    immediate: true,
                });
                if ($(window).width() < 767) {
                    setTimeout(() => {
                        document.querySelector('.wrapper').scrollTo(0,document.getElementById(locationHash.replace('#','')).offsetTop)
                    }, 300);
                }
            }, 300);
            
        } else {
            lenis.scrollTo(0, {
                force: true,
                immediate: true,
            });
        }
        lenis.start()
    }
    function resetBeforeLeave(data) {
        console.log('reset')
        $('.header-nav').removeClass('active')
        handleHeaderMode(data)
        addNavActiveLink(data);
    }
    const handleCursor = {
        init: () => {
            function mouseMove() {
                let iconX = xGetter('.cursor-wrap')
                let iconY = yGetter('.cursor-wrap')
                xSetter('.cursor-wrap')(lerp(iconX, pointerCurr().x, .15))
                ySetter('.cursor-wrap')(lerp(iconY, pointerCurr().y, .15))
                requestAnimationFrame(mouseMove)
                if ($('.swiper-wrapper.home-prob-inner:hover').length) {
                    $('.cursor-inner').addClass('on-hover-drag')
                } else {
                    $('.cursor-inner').removeClass('on-hover-drag')
                }
            }
            requestAnimationFrame(mouseMove)
        },
        reset: () => {
            $('.cursor-inner').removeClass('on-hover-drag')
        }
    }
    handleCursor.init()
    const header = $('.header')
    lenis.on('scroll', function(inst) {
        if (inst.scroll < header.outerHeight()) {
            header.removeClass('on-hide')
            header.removeClass('on-scroll')
        } else {
            header.addClass('on-scroll')
            if (!$('.header-nav').hasClass('active')) {
                if (inst.direction >= 1) {
                    header.addClass('on-hide')
                } else {
                    header.removeClass('on-hide')
                }
            } else {
                header.removeClass('on-hide')
            }
        }
    })
    $('.header-toggle-link').on('click', function(e) {
        e.preventDefault();
        $('.header-nav').addClass('active')
    })
    $('.header-nav-close-ic').on('click', function(e) {
        e.preventDefault();
        $('.header-nav').removeClass('active')
    })
    const VIEWS = [
        homeScript,
        aboutScript,
        termScript,
        blogdtlScript,
        solutionScript,
        insightScript
    ]

    barba.init({
        preventRunning: true,
        transitions: [{
            name: 'opacity-transition',
            sync: true,
            once(data) {
                resetScroll()
                resetBeforeLeave(data)
            },
            async enter(data) {
                
            },
            async afterLeave(data) {

            },
            async afterEnter(data) {
                resetScroll()
            },
            async beforeLeave(data) {
                resetBeforeLeave(data)
            },
            async leave(data) {
            },
            async afterLeave(data) {
            }
        }],
        views: VIEWS
    })
}

window.onload = scripts
