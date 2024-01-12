import $ from "jquery";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { getDetail } from "./common/prismic_fn";

gsap.registerPlugin(ScrollTrigger);

//Home

const notfoundScript = {
    namespace: 'notfound',
    afterEnter() {
        console.log('enter notfound')
        function checkRedirect() {
            let path = window.location.pathname;
            let uid = path.replace('/','')

            if (path) {
            } else {
                $('.notfound-main-inner').addClass('active')
                notFound()
            }
            getDetail('article', uid).then((res) => {
                if (!res) {
                    $('.notfound-main-inner').addClass('active')
                    notFound()
                } else {
                    window.location.href = `${window.location.origin}/blog-dtl?id=` + uid
                }
            })
            function notFound() {
                history.replaceState({},'',`/404`)
                return;
            }
        }
        checkRedirect();  
    },
    beforeLeave() {
        console.log('leave notfound')
    }
}
export default notfoundScript

