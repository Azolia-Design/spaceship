import $ from "jquery";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { getDetail } from "./common/prismic_fn";
import { getLang } from "./common/lang";


gsap.registerPlugin(ScrollTrigger);

const notfoundScript = {
    namespace: 'notfound',
    afterEnter() {
        function checkRedirect() {
            let path = window.location.pathname;
            let uid = path.replace('/', '').replace('?lang', '')

            if (path) {
            } else {
                $('.notfound-main-inner').addClass('active')
                notFound(getLang())
            }
            getDetail('article', uid, getLang()).then((res) => {
                if (!res) {
                    $('.notfound-main-inner').addClass('active')
                    notFound(getLang())
                } else {
                    window.location.href = `${window.location.origin}/blog-dtl?id=` + uid + `${getLang() !== 'en-us' ? `&lang=es` : ''}`
                }
            })
            function notFound(lang) {
                history.replaceState({}, '', `/404${lang !== 'en-us' ? `?lang=es` : ''}`)
                return;
            }
        }
        checkRedirect();
    },
    beforeLeave() {
    }
}
export default notfoundScript

