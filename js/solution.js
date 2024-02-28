import $ from "jquery";
import gsap from "gsap";
import Swiper from "swiper";
import { Navigation } from "swiper";
import ScrollTrigger from "gsap/ScrollTrigger";
import { parseRem, sortAsc } from "./untils";
import { getAllDataByType, getDetail} from "./common/prismic_fn";
import { getLang } from "./common/lang";



gsap.registerPlugin(ScrollTrigger);

//Home

const solutionScript = {
    namespace: 'solution',
    afterEnter(data) {
        getApiSol()

        function getApiSol() {
            getDetail('solution_page', 'solution', getLang()).then((res) => {
                return res.data
            }).then((data) => {
                getApiSolHero(data)
                getApiSolProd(data)
                getApiSolFeat(data)
                getApiSolComing(data)
                getApiSolSer(data)
            })
        }
        function getApiSolHero(data) {
            $('.sol-hero-label').text(data.hero_premble)
            let heroTitle = $('.sol-hero-title').html()
            $('.sol-hero-title').html(heroTitle.replace('Innovation', `${data.hero_title}`))
            $('.sol-hero-sub').text(data.hero_subtitle)
        }
        function getApiSolProd(data) {
            $('.sol-prod-label .txt').text(data.product_label)
            let prodBody = data.product_title
            $(data.product_title_hl).each((idx, el) => {
                prodBody = prodBody.replace(el.item, `<span class="txt-hl">${el.item}</span>`)
            })
            $('.sol-prod-title').html(prodBody)
        }
        function getApiSolFeat(data) {
            $('.sol-fea-sub').text(data.feature_label)
            let FeatTitle = $('.sol-fea-title').html()
            $('.sol-fea-title').html(FeatTitle.replace('Discover Key Advantages', data.feature_title))
        }
        function getApiSolComing(data) {
            $('.sol-coming-label').text(data.upcoming_subtitle)
            $('.sol-coming-title').text(data.upcoming_title)
            $('.sol-coming-sub').text(data.upcoming_body)
        }
        function getApiSolSer(data) {
            $('.sol-ser-label').text(data.service_label)
            $('.sol-ser-title').text(data.service_title)
        }

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
            getAllDataByType('sol_feature', getLang()).then((res) => {
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
        function getAPiSolSerItem() {
            getAllDataByType('sol_service', getLang()).then((res) => {
                let allSer = sortAsc(res);
                let templateSerItem = $('.sol-ser-main-item').eq(0).clone();
                let parent = '.sol-ser-main-inner'
                $(parent).find('.sol-ser-main-item').remove()
                allSer.forEach((i) => {
                    let html = templateSerItem.clone();
                    html.find('.sol-ser-main-item-thumb img').attr('src', i.data.image.url)
                    html.find('.sol-ser-main-item-thumb img').attr('alt', i.data.image.alt ? i.data.image.alt : i.data.title)
                    html.find('.sol-ser-main-item-title').text(i.data.title)
                    html.find('.sol-ser-main-item-sub').text(i.data.body)
                    html.appendTo(parent);
                })
            })
        }
        getAPiSolSerItem()
    },
    beforeLeave() {
    }
}
export default solutionScript

