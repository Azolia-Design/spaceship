import $ from "jquery";
import gsap from "gsap";
import Swiper from "swiper";
import { Navigation } from "swiper";
import ScrollTrigger from "gsap/ScrollTrigger";
import { parseRem } from "./untils";

gsap.registerPlugin(ScrollTrigger);

//Home

const aboutScript = {
    namespace: 'about',
    afterEnter(data) {
        console.log('enter about')  
        function abtMile() {
            if ($(window).width() > 767) {
                let offsetTop = ($(window).height() - $('.abt-mile-sticky').outerHeight()) / 2;
                $('.abt-mile-sticky').css('top', `${offsetTop}px`)
                let distance = $('.abt-mile-item').outerWidth() * ($('.abt-mile-item').length) - $('.abt-mile-main').outerWidth();
                if ($(window).width() > 991) {
                    $('.abt-mile').css('height', `${distance + $(window).height()}`);
                } else {
                    $('.abt-mile').css('height', `${distance}`);
                }
                requestAnimationFrame(() => {
                    let tlScrub = gsap.timeline({
                        scrollTrigger: {
                            trigger: '.abt-mile',
                            start: $(window).width() > 991 ? `top top+=${offsetTop + $('.abt-mile-item').outerWidth() * 2}` : `top top+=${offsetTop}`,
                            end: $(window).width() > 991 ? `bottom bottom-=${offsetTop + $('.abt-mile-item').outerWidth() * 2}` : `bottom bottom-=${offsetTop}`,
                            scrub: true,
                        },
                        defaults: {
                            ease: 'none'
                        }
                    })
                    tlScrub
                    .fromTo('.abt-mile-main-inner', {x: $(window).width() > 991 ? $('.abt-mile-item').outerWidth() * 2 : 0}, {x: $(window).width() > 991 ? -distance - $('.abt-mile-item').outerWidth() * 2 : -distance})
                    .fromTo('.abt-mile-prog-inner', {width: '0%'}, {width: '100%'}, 0)
                })
            } else {
                const abtMileSwiper = new Swiper('.swiper.abt-mile-main', {
                    slidesPerView: 'auto',
                    spaceBetween: parseRem(24),
                    on: {
                        slideChange: (swiper) => {
                            gsap.to('.abt-mile-prog-inner', {width: `${swiper.progress * 100}%`})
                        }
                    }
                })
                abtMileSwiper.slideTo(0)
            }
            
        }  
        abtMile()
    },
    beforeLeave() {
        console.log('leave about')
    }
}
export default aboutScript

