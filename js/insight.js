import $ from "jquery";
import gsap from "gsap";
import Swiper from "swiper";
import { Navigation, Grid } from "swiper";
import ScrollTrigger from "gsap/ScrollTrigger";
import { parseRem } from "./untils";

gsap.registerPlugin(ScrollTrigger);

//Home

const insightScript = {
    namespace: 'insight',
    afterEnter(data) {
        console.log('enter insight')
        function insNews() {
            const insNewsSwiper = new Swiper('.ins-news-main-inner', {
                modules: [Navigation, Grid],
                slidesPerView: 1,
                navigation: {
                    nextEl: '.ins-news-main-pagi .swiper-pagi-next',
                    prevEl: '.ins-news-main-pagi .swiper-pagi-prev'
                },
                grid: {
                    fill: 'column',
                    rows: 4,
                },
                breakpoints: {
                    767: {
                        slidesPerView: 2,
                        grid: {
                            rows: 2,
                        },
                    },
                    991: {
                        slidesPerView: 1,
                        grid: {
                            rows: 4,
                        },
                    }
                }
            });
        }
        insNews()
        function insNewsLogo() {
            $('.ins-news-logo-item.item-default').addClass('active');
            $('.ins-news-main-item').on('pointermove', function(e) {
                let idx = $(this).index()
                console.log(idx)
                $('.ins-news-logo-item').removeClass('active')
                $('.ins-news-logo-item').eq(idx + 1).addClass('active')
            })
            $('.ins-news-main-item').on('pointerleave', function(e) {
                $('.ins-news-logo-item').removeClass('active')
                $('.ins-news-logo-item.item-default').addClass('active');
            })
        }
        insNewsLogo()
    },
    beforeLeave() {
        console.log('leave insight')
    }
}
export default insightScript

