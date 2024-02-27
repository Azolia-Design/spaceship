import $ from "jquery";
import gsap from "gsap";
import Swiper from "swiper";
import { Navigation } from "swiper";
import ScrollTrigger from "gsap/ScrollTrigger";
import { parseRem, sortAsc } from "./untils";
import { getAllDataByType } from "./common/prismic_fn";
import { getlang } from "./common/lang";



gsap.registerPlugin(ScrollTrigger);

//Home

const solutionScript = {
    namespace: 'solution',
    afterEnter(data) {


        function solProd() {
            if ($(window).width() > 991) {
                let tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: '.sol-prod-img-wrap',
                        start: 'top bottom',
                        end: 'bottom top+=50%',
                        scrub: .4,
                    }
                })
                tl
                    .to('.sol-prod-img-wrap img', { scale: 1.2, yPercent: -10, ease: 'none' })
            }
        }
        solProd()
        function toHTML(richTextArray) {
            let html = '';
            for (const block of richTextArray) {
                switch (block.type) {
                    case 'paragraph':
                        let string = block.text;
                        html += `<p>${string}</p>`;
                        break;
                    case 'list-item':
                        let listString = block.text;
                        html += `<li>${listString}</li>`;
                        break;
                    default:
                        console.error(`Unsupported block type: ${block.type}`);
                }
            }
            return html;
        }
        function getAPiSolFea() {
            getAllDataByType('sol_feature').then((res) => {
                let allFea = sortAsc(res);
                let templateFeaItem = $('.sol-fea-main-item').eq(0).clone();
                let parent = '.sol-fea-main-inner'
                $(parent).find('.sol-fea-main-item').remove()
                allFea.forEach((i) => {
                    let html = templateFeaItem.clone();
                    html.find('.sol-fea-main-item-ic img').attr('src', i.data.icon.url).attr('alt', i.data.icon.alt ? i.data.icon.alt : i.data.name)
                    html.find('.sol-fea-main-item-title').text(i.data.title)
                    html.find('.sol-fea-main-item-sub').html(toHTML(i.data.content))
                    html.appendTo(parent);
                })
            })
        }
        getAPiSolFea()
    },
    beforeLeave() {
    }
}
export default solutionScript

