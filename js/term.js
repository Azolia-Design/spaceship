import $ from "jquery";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

//Home

const termScript = {
    namespace: 'term',
    afterEnter() {
    },
    beforeLeave() {
    }
}
export default termScript

