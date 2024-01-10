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

    },
    beforeLeave() {
        console.log('leave solution')
    }
}
export default solutionScript

