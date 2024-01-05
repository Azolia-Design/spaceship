import $ from "jquery";
import gsap from "gsap";
import Swiper from "swiper";
import { Navigation } from "swiper";
import ScrollTrigger from "gsap/ScrollTrigger";
import { parseRem } from "./untils";

gsap.registerPlugin(ScrollTrigger);

//Home

const blogdtlScript = {
    namespace: 'blogdtl',
    afterEnter(data) {
        console.log('enter blogdtls')    
        function blogdtlRel(data) {
            if ($(window).width() > 767) {
                const blogdtlRelSwiper = new Swiper($(data.next.container).find('.blogdtl-rel-main').get(0),{
                    modules: [Navigation],
                    slidesPerView: 'auto',
                    spaceBetween: parseRem(20),
                    navigation: {
                        nextEl: $(data.next.container).find('.blogdtl-rel-pagi .swiper-pagi-next').get(0),
                        prevEl: $(data.next.container).find('.blogdtl-rel-pagi .swiper-pagi-prev').get(0)
                    },
                })
            }
        }   
        blogdtlRel(data) 
    },
    beforeLeave() {
        console.log('leave blogdtls')
    }
}
export default blogdtlScript

