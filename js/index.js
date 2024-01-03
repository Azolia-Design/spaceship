import 'swiper/swiper-bundle.min.css'
import $ from "jquery";
import lenis from './vendors/lenis';
import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import homeScript from './home';

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
    //refreshOnBreakpoint();
    const header = $('.header')
    lenis.on('scroll', function(inst) {
        if (inst.scroll < header.outerHeight()) {
            header.removeClass('on-hide')
            header.removeClass('on-scroll')
        } else {
            header.addClass('on-scroll')
            if (inst.direction >= 1) {
                header.addClass('on-hide')
            } else {
                header.removeClass('on-hide')
            }
        }
    })
    const VIEWS = [
        homeScript,
    ]

    barba.init({
        preventRunning: true,
        transitions: [{
            name: 'opacity-transition',
            sync: true,
            once(data) {
            },
            async enter(data) {
                
            },
            async afterLeave(data) {

            },
            async afterEnter(data) {
            },
            async beforeLeave(data) {
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
