import $ from "jquery";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { getlang } from "./common/lang";


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

