import $ from "jquery";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import MotionPathPlugin from "gsap/MotionPathPlugin";
import lenis from './vendors/lenis';
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper";
import { getAllDataByType } from "./common/prismic_fn"
import { parseRem, xSetter, ySetter, xGetter, yGetter, pointerCurr, lerp, sortAsc } from "./untils";
import { getlang } from "./common/lang";


gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

//Home

const homeScript = {
    namespace: 'home',
    afterEnter() {

        function homeHeroMouse() {
            function mousMove() {
                let iconX = xGetter('.home-hero-img-sat')
                let iconY = yGetter('.home-hero-img-sat')

                let targetX = (pointerCurr().x / $(window).width() - .5) * 2;
                let targetY = (pointerCurr().y / $(window).height() - .5) * 2;
                xSetter('.home-hero-img-sat')(lerp(iconX, targetX * $('.home-hero-img-sat').width() * .15, 0.01))
                ySetter('.home-hero-img-sat')(lerp(iconY, targetY * $('.home-hero-img-sat').height() * .15, 0.01))
                requestAnimationFrame(mousMove)
            }
            requestAnimationFrame(mousMove)
        }
        homeHeroMouse()
        function homeHeroPath() {
            let duration = 24
            function arrowAnim(pathID, arrEl, rotate = true, delay = false, rev = false) {
                $(arrEl).each((idx, el) => {
                    let tl = gsap.timeline({
                        repeat: -1,
                        delay: delay ? (- duration / 3 * idx) - duration / 6 : - duration / 3 * idx
                    })
                    tl
                        .from(el, { autoAlpha: 0, duration: 1, ease: 'none' })
                        .to(el, {
                            duration: duration,
                            ease: "none",
                            motionPath: {
                                path: pathID,
                                align: pathID,
                                start: rev ? 1 : 0,
                                end: rev ? 0 : 1,
                                autoRotate: rotate,
                                alignOrigin: [0.5, 0.5]
                            }
                        }, 0)
                        .to(el, { autoAlpha: 0, duration: 1, ease: 'none' }, '>=-1')
                })
            }
            arrowAnim('#outPathR', '.outArrR', true, false, false)
            arrowAnim('#outPathL', '.outArrL', true, true, false)
            arrowAnim('#inPathR', '.inArrR', true, false, false)
            arrowAnim('#inPathL', '.inArrL', true, false, false)
            if ($(window).width() > 991) {
                arrowAnim('.show-dk #upPath', '.show-dk .upArr', 90, false, true)
                arrowAnim('.show-dk #downPathL', '.show-dk .downArrL', -90, true, false)
                arrowAnim('.show-dk #downPathR', '.show-dk .downArrR', -90, false, false)
            } else if ($(window).width() >= 767) {
                arrowAnim('.show-tb #upPath', '.show-tb .upArr', 90, false, true)
                arrowAnim('.show-tb #downPathL', '.show-tb .downArrL', -90, true, false)
                arrowAnim('.show-tb #downPathR', '.show-tb .downArrR', -90, false, false)
            } else {
                arrowAnim('.show-mb #upPath', '.show-mb .upArr', 90, false, true)
                arrowAnim('.show-mb #downPathL', '.show-mb .downArrL', -90, true, false)
                arrowAnim('.show-mb #downPathR', '.show-mb .downArrR', -90, false, false)
            }
        }
        homeHeroPath()
        function getAPiHomePart() {
            getAllDataByType('part_logo').then((res) => {
                let allPart = sortAsc(res);
                let templatePartItem = $('.home-part-marquee-item').eq(0).clone();
                let parent = '.home-part-marquee-inner';
                $(parent).find('.home-part-marquee-item').remove()
                allPart.forEach((i) => {
                    let html = templatePartItem.clone();
                    html.find('img').attr('src', i.data.image.url).attr('alt', i.data.image.alt ? i.data.image.alt : i.data.name)
                    html.attr('href', i.data.link.url).attr('target', '_blank');
                    html.appendTo(parent);
                })
            })
        }
        getAPiHomePart()
        function getApiHomeProb() {
            getAllDataByType('problem').then((res) => {
                let allProb = sortAsc(res);
                let templateProbItem = $('.home-prob-item').eq(0).clone();
                let parent = '.home-prob-inner'
                $(parent).html('')
                allProb.forEach((i) => {
                    let html = templateProbItem.clone();
                    html.find('.home-prob-item-ic img').attr('src', i.data.icon.url).attr('alt', i.data.icon.alt ? i.data.icon.alt : i.data.title)
                    html.find('.home-prob-item-title').text(i.data.title)
                    html.find('.home-prob-item-body').text(i.data.body_text)
                    html.appendTo(parent);
                })
            }).then(homeProb)
        }
        getApiHomeProb()
        function toHTML(richTextArray) {
            let html = '';
            let isLabeled;
            for (const block of richTextArray) {
                switch (block.type) {
                    case 'paragraph':
                        let string = block.text;
                        for (const span of block.spans) {
                            switch (span.type) {
                                case 'strong':
                                    string = string.replace(block.text.substring(span.start, span.end), `<strong>${block.text.substring(span.start, span.end)}</strong>`);
                                    break;
                                case 'em':
                                    string = string.replace(block.text.substring(span.start, span.end), `<em>${block.text.substring(span.start, span.end)}</em>`);
                                    break;
                                default:
                                    break;
                            }
                        }
                        html += `<p>${string}</p>`;
                        break;
                    case 'list-item':
                        let listString = block.text;
                        for (const span of block.spans) {
                            switch (span.type) {
                                case 'strong':
                                    listString = listString.replace(block.text.substring(span.start, span.end), `<strong>${block.text.substring(span.start, span.end)}</strong>`);
                                    break;
                                case 'em':
                                    listString = listString.replace(block.text.substring(span.start, span.end), `<em>${block.text.substring(span.start, span.end)}</em>`);
                                    break;
                                default:
                                    break;
                            }
                        }
                        html += `<li>${listString}</li>`;
                        break;
                    default:
                        console.error(`Unsupported block type: ${block.type}`);
                }
            }
            return html;
        }
        function getAPiHomeSol() {
            getAllDataByType('home_sol').then((res) => {
                let allSol = sortAsc(res);
                let templateSolItem = $('.home-sol-item').eq(0).clone();
                let parent = '.home-sol-inner'
                $(parent).find('.home-sol-item').remove()
                allSol.forEach((i) => {
                    let html = templateSolItem.clone();
                    html.find('.home-sol-item-ic img').attr('src', i.data.icon.url).attr('alt', i.data.icon.alt ? i.data.icon.alt : i.data.name)
                    html.find('.home-sol-item-title').text(i.data.title)
                    html.find('.home-sol-item-body').html(toHTML(i.data.content))
                    html.appendTo(parent);
                })
            })
        }
        getAPiHomeSol()
        function homeProb() {
            const homeProbSwiper = new Swiper('.home-prob-main', {
                modules: [Navigation, Pagination],
                slidesPerView: 'auto',
                spaceBetween: parseRem(20),
                navigation: {
                    nextEl: '.home-prob-pagi .swiper-pagi-next',
                    prevEl: '.home-prob-pagi .swiper-pagi-prev'
                },
                pagination: {
                    el: '.home-prob-counter',
                    type: 'fraction'
                },
                breakpoints: {
                    767: {
                        slidesPerView: 'auto',
                    },
                    991: {
                        slidesPerView: 3
                    }
                }
            })
        }
        function getApiHomeFaq() {
            getAllDataByType('home_benefit').then((res) => {
                let allFaq = sortAsc(res);
                let templateFaqItem = $('.home-faq-item').eq(0).clone();
                let parent = '.home-faq-inner'
                $(parent).find('.home-faq-item').remove()
                allFaq.forEach((i) => {
                    let html = templateFaqItem.clone();
                    html.find('.home-faq-item-head-txt').text(i.data.title)
                    html.find('.home-faq-item-body-inner .txt').html(toHTML(i.data.content))
                    html.appendTo(parent);
                })
            }).then(homeFaq)
        }
        getApiHomeFaq()
        function homeFaq() {
            $('.home-faq-item').eq(0).addClass('active');
            $('.home-faq-item').eq(0).find('.home-faq-item-body').slideDown();
            $('.home-faq-item-head').on('click', function (e) {
                e.preventDefault();
                if ($(this).closest('.home-faq-item').hasClass('active')) {
                    $(this).closest('.home-faq-item').removeClass('active')
                    $(this).closest('.home-faq-item').find('.home-faq-item-body').slideUp();
                } else {
                    $('.home-faq-item.active').find('.home-faq-item-body').slideUp();
                    $('.home-faq-item').removeClass('active');
                    $(this).closest('.home-faq-item').addClass('active')
                    $(this).closest('.home-faq-item').find('.home-faq-item-body').slideDown();
                }
            })
        }
    },
    beforeLeave() {
    }
}
export default homeScript

