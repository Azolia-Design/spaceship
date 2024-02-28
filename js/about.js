import $ from "jquery";
import gsap from "gsap";
import Swiper from "swiper";
import lenis from './vendors/lenis';
import { Navigation } from "swiper";
import ScrollTrigger from "gsap/ScrollTrigger";
import { parseRem, sortAsc } from "./untils";
import { getAllDataByType, getDetail } from "./common/prismic_fn";
import { getLang } from "./common/lang";


gsap.registerPlugin(ScrollTrigger);

//Home

const aboutScript = {
    namespace: 'about',
    afterEnter(data) {
        getApiAbt()

        function getApiAbt() {
            getDetail('about_page', 'about', getLang()).then((res) => {
                return res.data
            }).then((data) => {
                console.log(data);
                getApiAbtHero(data)
                getApiAbtVision(data)
                getApiAbtPartner(data)
                getApiAbtCEO(data)
            })
        }
        function getApiAbtHero(data) {
            $('.abt-hero-title').text(data.heri_title)
        }
        function getApiAbtVision(data) {
            $('.abt-hero-label .txt').text(data.vision_label)
            let visionBody = data.vision_body
            $(data.vision_hl).each((idx, el) => {
                visionBody = visionBody.replace(el.item, `<span class="txt-hl">${el.item}</span>`)
            })
            $('.abt-hero-sub').html(visionBody)
        }
        function getApiAbtPartner(data) {
            $('.home-part-label').text(data.partners_grants)
        }
        function getApiAbtCEO(data) {
            let parent = $('.abt-ceo-quote')
            let templateParaItem = parent.find('.abt-ceo-quote-txt').eq(0).clone();
            parent.find('.abt-ceo-quote-txt').remove()
            let CeoBody = $(data.ceo_body_new)
            CeoBody.each((idx, el) => {
                let html = templateParaItem.clone()
                let bodyText = el.text
                console.log(bodyText);
                $(el.spans).each((idx, hl) => {
                    // let subString = $(bodyText).subString(hl.start, hl.end)
                    // bodyText = bodyText.replace(subString, `<span class="txt-hl">${subString}</span>`)
                })

                parent.append(html)
            })

        }


        function scrollTo(data) {
            if (window.location.hash) {
                let locationHash = window.location.hash;
                setTimeout(() => {
                    lenis.scrollTo(locationHash, {
                        force: true,
                        immediate: true,
                    });
                    if ($(window).width() < 767) {
                        setTimeout(() => {
                            document.querySelector('.wrapper').scrollTo(0, document.getElementById(locationHash.replace('#', '')).offsetTop)
                        }, 300);
                    }
                }, 300);
            }
        }
        scrollTo(data)
        function getApiAbtMile() {
            getAllDataByType('milstone', getLang()).then((res) => {
                let allMils = sortAsc(res);
                let templateMilItem = $('.abt-mile-item').eq(0).clone();
                let parent = '.abt-mile-main-inner'
                $(parent).html('')
                allMils.forEach((i) => {
                    let htmlSlide = templateMilItem.clone();
                    htmlSlide.find('.abt-mile-item-thumb img').attr('src', i.data.image.url).attr('alt', i.data.image.alt ? i.data.image.alt : i.type)
                    htmlSlide.find('.abt-mile-item-title').text(i.data.title)
                    htmlSlide.find('.abt-mile-item-sub').text(i.data.body_text)
                    htmlSlide.find('.abt-mile-item-date-month').text(new Date(i.data.date).toLocaleString('default', { month: 'short' }))
                    htmlSlide.find('.abt-mile-item-date-year').text(new Date(i.data.date).getFullYear())
                    htmlSlide.appendTo(parent);
                })
            }).then(abtMile).then(scrollTo)
        }
        getApiAbtMile()
        function getAPiHomePart() {
            getAllDataByType('part_logo').then((res) => {
                let allPart = sortAsc(res);
                let templatePartItem = $('.home-part-marquee-item').eq(0).clone();
                let parent = '.home-part-marquee-inner'
                $(parent).find('.home-part-marquee-item').remove()
                allPart.forEach((i) => {
                    let html = templatePartItem.clone();
                    html.find('img').attr('src', i.data.image.url).attr('alt', i.data.image.alt ? i.data.image.alt : i.data.name)
                    html.attr('href', i.data.link.url).attr('target', '_blank');
                    html.appendTo(parent);
                })
            }).then(scrollTo)
        }
        getAPiHomePart()
        function abtMile() {
            if ($(window).width() > 767) {
                let offsetTop = ($(window).height() - $('.abt-mile-sticky').outerHeight()) / 2;
                $('.abt-mile-sticky').css('top', `${offsetTop}px`)
                let distance = $('.abt-mile-item').outerWidth() * ($('.abt-mile-item').length) - $('.abt-mile-main').outerWidth();
                if ($(window).width() > 991) {
                    $('.abt-mile').css('height', `${distance + $(window).height()}`);
                } else {
                    $('.abt-mile').css('height', `${distance}`);
                }
                requestAnimationFrame(() => {
                    let tlScrub = gsap.timeline({
                        scrollTrigger: {
                            trigger: '.abt-mile',
                            start: $(window).width() > 991 ? `top top+=${offsetTop}` : `top top+=${offsetTop}`,
                            end: $(window).width() > 991 ? `bottom bottom-=${offsetTop}` : `bottom bottom-=${offsetTop}`,
                            scrub: true,
                        },
                        defaults: {
                            ease: 'none'
                        }
                    })
                    tlScrub
                        .fromTo('.abt-mile-main-inner', { x: $(window).width() > 991 ? 0 : 0 }, { x: $(window).width() > 991 ? -distance : -distance })
                        .fromTo('.abt-mile-prog-inner', { width: '0%' }, { width: '100%' }, 0)
                })
            } else {
                const abtMileSwiper = new Swiper('.swiper.abt-mile-main', {
                    slidesPerView: 'auto',
                    spaceBetween: parseRem(24),
                    on: {
                        slideChange: (swiper) => {
                            gsap.to('.abt-mile-prog-inner', { width: `${swiper.progress * 100}%` })
                        }
                    }
                })
                abtMileSwiper.slideTo(0)
            }

        }
        function getApiAbtTeam() {
            getAllDataByType('team', getLang()).then((res) => {
                let allTeam = sortAsc(res);
                let templateTeamItem = $('.abt-team-item').eq(0).clone();
                let parent = '.abt-team-main'
                $(parent).find('.abt-team-item').remove()
                allTeam.forEach((i) => {
                    let html = templateTeamItem.clone();
                    html.find('.abt-team-item-thumb img').attr('src', i.data.image.url).attr('alt', i.data.image.alt ? i.data.image.alt : i.data.name)
                    html.find('.abt-team-item-name').text(i.data.name)
                    html.find('.abt-team-item-job').text(i.data.job_title)
                    if (i.data.linkedin.url) {
                        html.find('.abt-team-item-name-wrap').attr('href', i.data.linkedin.url).attr('target', '_blank')
                    } else {
                        html.find('.abt-team-item-name-wrap').css('pointer-events', 'none')
                        html.find('.abt-team-item-name-wrap').find('.abt-team-item-ic').remove()
                    }
                    html.appendTo(parent);
                })
            })
        }
        getApiAbtTeam()
        function getApiAbtJob() {
            getAllDataByType('job', getLang()).then((res) => {
                let allJob = sortAsc(res).reverse();
                let templateJobItem = $('.abt-job-item').eq(0).clone();
                let parent = '.abt-job-main-inner'
                $(parent).html('')
                allJob.forEach((i) => {
                    let html = templateJobItem.clone();
                    if (i.data.link_pdf.url) {
                        html.attr('href', i.data.link_pdf.url).attr('target', '_blank')
                    } else {
                        html.css('pointer-events', 'none')
                    }
                    html.find('.abt-job-item-title').text(i.data.job_title)
                    html.find('.abt-job-item-type').text(i.data.job_type)
                    html.find('.abt-job-item-loc').text(i.data.location)
                    html.appendTo(parent);
                })
            })
        }
        getApiAbtJob()

    },
    beforeLeave() {
    }
}
export default aboutScript

