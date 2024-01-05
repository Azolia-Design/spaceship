import $ from "jquery";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

//Home

const termScript = {
    namespace: 'term',
    afterEnter() {
        console.log('enter terms')        
    },
    beforeLeave() {
        console.log('leave terms')
    }
}
export default termScript

