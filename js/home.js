import $ from "jquery";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import lenis from './vendors/lenis';
import swiper from './components/swiper';

gsap.registerPlugin(ScrollTrigger);

//Home

const homeScript = {
    namespace: 'home',
    afterEnter() {
        console.log('enter home')
    },
    beforeLeave() {
        console.log('leave home')
    }
}
export default homeScript

