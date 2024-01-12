import $ from "jquery";
import gsap from "gsap";
import Swiper from "swiper";
import { Navigation } from "swiper";
import ScrollTrigger from "gsap/ScrollTrigger";
import { parseRem } from "./untils";

gsap.registerPlugin(ScrollTrigger);

//Home

const solutionScript = {
    namespace: 'solution',
    afterEnter(data) {
        console.log('enter solution')  
        function solProd() {
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger:'.sol-prod-img-wrap',
                    start: 'top bottom',
                    end: 'bottom top+=50%',
                    scrub: .4,
                }
            })
            tl
            .to('.sol-prod-img-wrap img', {scale: 1.2, yPercent: -10, ease: 'none'})
        }
        solProd()

    },
    beforeLeave() {
        console.log('leave solution')
    }
}
export default solutionScript

