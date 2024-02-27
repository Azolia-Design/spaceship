import $ from "jquery";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { getlang, updateSearch } from "./common/lang";


gsap.registerPlugin(ScrollTrigger);

//Home

const termScript = {
    namespace: 'term',
    afterEnter() {
        console.log(getlang());
        updateSearch()
    },
    beforeLeave() {
    }
}
export default termScript

