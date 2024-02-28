import $ from "jquery";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { getDetail } from "./common/prismic_fn";
import { getLang } from "./common/lang";


gsap.registerPlugin(ScrollTrigger);

//Home

const termScript = {
    namespace: 'term',
    afterEnter() {
        getApiPolicy()

        function getApiPolicy() {
            getDetail('policy_page', 'policy', getLang()).then((res) => {
                return res.data
            }).then((data) => {
                console.log(data);
                getApiPolicyContent(data)
            });
            function getApiPolicyContent(data) {
                $('.term-hero-title').text(data.hero_title)
                let effectiveTxt = $('.term-hero-date').html()
                $('.term-hero-date').html(effectiveTxt.replace('Effective from', data.hero_effective))
            }
        }
    },
    beforeLeave() {
    }
}
export default termScript

