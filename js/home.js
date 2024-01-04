import $ from "jquery";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import MotionPathPlugin from "gsap/MotionPathPlugin";
import lenis from './vendors/lenis';
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper";
import { parseRem, xSetter, ySetter, xGetter, yGetter, pointerCurr, lerp } from "./untils";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

//Home

const homeScript = {
    namespace: 'home',
    afterEnter() {
        console.log('enter home')
        function homeHeroMouse() {
            function mousMove() {
                let iconX = xGetter('.home-hero-img-sat')
                let iconY = yGetter('.home-hero-img-sat')

                let targetX = (pointerCurr().x / $(window).width() - .5) * 2;
                let targetY = (pointerCurr().y / $(window).height() - .5) * 2;
                xSetter('.home-hero-img-sat')(lerp(iconX, targetX * $('.home-hero-img-sat').width() * .15, 0.01))
                ySetter('.home-hero-img-sat')(lerp(iconY, targetY * $('.home-hero-img-sat').height() * .15, 0.01))
                requestAnimationFrame(mousMove)
            }
            requestAnimationFrame(mousMove)
        }
        homeHeroMouse()
        function homeHeroPath() {
            let duration = 24
            function arrowAnim(pathID, arrEl, rotate = true, delay = false, rev = false) {
                $(arrEl).each((idx, el) => {
                    let tl = gsap.timeline({
                        repeat: -1,
                        delay: delay ? (- duration / 3 * idx) - duration / 6 : - duration / 3 * idx
                    })
                    tl
                    .from(el, {autoAlpha: 0, duration: 1, ease: 'none'})
                    .to(el, {
                        duration: duration, 
                        ease: "none",
                        motionPath:{
                            path: pathID,
                            align: pathID,
                            start: rev ? 1 : 0,
                            end: rev ? 0 : 1,
                            autoRotate: rotate,
                            alignOrigin: [0.5, 0.5]
                        }
                    }, 0)
                    .to(el, {autoAlpha: 0, duration: 1, ease: 'none'}, '>=-1')
                })
            }
            arrowAnim('#outPathR', '.outArrR', true, false, false)
            arrowAnim('#outPathL', '.outArrL', true, true, false)
            arrowAnim('#inPathR', '.inArrR', true, false, false)
            arrowAnim('#inPathL', '.inArrL', true, false, false)
            if ($(window).width() > 991) {
                arrowAnim('.show-dk #upPath', '.show-dk .upArr', 90, false, true)
                arrowAnim('.show-dk #downPathL', '.show-dk .downArrL', -90, true, false)
                arrowAnim('.show-dk #downPathR', '.show-dk .downArrR', -90, false, false)
            } else if ($(window).width() > 767) {
                arrowAnim('.show-tb #upPath', '.show-tb .upArr', 90, false, true)
                arrowAnim('.show-tb #downPathL', '.show-tb .downArrL', -90, true, false)
                arrowAnim('.show-tb #downPathR', '.show-tb .downArrR', -90, false, false)
            } else {
                arrowAnim('.show-mb #upPath', '.show-mb .upArr', 90, false, true)
                arrowAnim('.show-mb #downPathL', '.show-mb .downArrL', -90, true, false)
                arrowAnim('.show-mb #downPathR', '.show-mb .downArrR', -90, false, false)
            }
        }
        homeHeroPath()
        function homeProb() {
            const homeProbSwiper = new Swiper('.home-prob-main', {
                modules: [Navigation, Pagination],
                slidesPerView: 1,
                spaceBetween: parseRem(20),
                navigation: {
                    nextEl: '.home-prob-pagi .swiper-pagi-next',
                    prevEl: '.home-prob-pagi .swiper-pagi-prev'
                },
                pagination: {
                    el: '.home-prob-counter',
                    type: 'fraction'
                },
                breakpoints: {
                    767: {
                        slidesPerView: 2,
                    },
                    991: {
                        slidesPerView: 3
                    }
                }
            })
        }
        homeProb()
        function homeFaq() {
            $('.home-faq-item').eq(0).addClass('active');
            $('.home-faq-item').eq(0).find('.home-faq-item-body').slideDown();
            $('.home-faq-item-head').on('click', function(e) {
                e.preventDefault();
                if ($(this).closest('.home-faq-item').hasClass('active')) {
                    $(this).closest('.home-faq-item').removeClass('active')
                    $(this).closest('.home-faq-item').find('.home-faq-item-body').slideUp();
                } else {
                    $('.home-faq-item.active').find('.home-faq-item-body').slideUp();
                    $('.home-faq-item').removeClass('active');
                    $(this).closest('.home-faq-item').addClass('active')
                    $(this).closest('.home-faq-item').find('.home-faq-item-body').slideDown();
                }
            })
        }
        homeFaq()
    },
    beforeLeave() {
        console.log('leave home')
    }
}
export default homeScript

