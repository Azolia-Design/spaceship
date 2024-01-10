import $ from "jquery";
import gsap from "gsap";
import Swiper from "swiper";
import { Navigation } from "swiper";
import ScrollTrigger from "gsap/ScrollTrigger";
import { parseRem } from "./untils";

gsap.registerPlugin(ScrollTrigger);

//Home

const insightScript = {
    namespace: 'insight',
    afterEnter(data) {
        console.log('enter insight')  

    },
    beforeLeave() {
        console.log('leave insight')
    }
}
export default insightScript

