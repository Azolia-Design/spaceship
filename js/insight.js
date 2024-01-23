import $ from "jquery";
import gsap from "gsap";
import Swiper from "swiper";
import { Navigation, Grid } from "swiper";
import ScrollTrigger from "gsap/ScrollTrigger";
import { parseRem } from "./untils";
import { getAllDataByType } from "./common/prismic_fn";

gsap.registerPlugin(ScrollTrigger);

//Home

const insightScript = {
    namespace: 'insight',
    afterEnter(data) {
        function getApiInsNews() {
            getAllDataByType('news').then((res) => {
                let allNews = res;
                let templateNewsItem = $('.ins-news-main-item').eq(0).clone();
                let parent = '.ins-news-main-list';
                $(parent).html('')
                let templateIconItem = $('.ins-news-logo-item:not(.item-default)').eq(0).clone();
                let parentIcon = '.ins-news-logo-inner';
                $(parentIcon).find('.ins-news-logo-item:not(.item-default)').remove()
                allNews.forEach((i, idx) => {
                    let html = templateNewsItem.clone();
                    html.attr('href', i.data.link.url).attr('target', '_blank')
                    html.find('.ins-news-main-item-title').text(i.data.title)
                    html.find('.ins-news-main-item-name').text(i.data.press_name)
                    html.find('.ins-news-main-item-year').text(new Date(i.data.date).getFullYear())
                    html.find('.ins-news-main-item-logo img').attr('src', i.data.press_logo.url)
                    html.find('.ins-news-main-item-logo').attr('style', `--press_color_mb: ${i.data.press_color}`)
                    html.appendTo(parent);

                    let htmlIcon = templateIconItem.clone();
                    htmlIcon.find('.ins-news-logo-item-img img').attr('src', i.data.press_logo.url)
                    htmlIcon.find('.ins-news-logo-item-inner').attr('style', `--press_color: ${i.data.press_color}`)
                    htmlIcon.appendTo(parentIcon)
                })
            }).then(insNews).then(insNewsLogo)
        }
        getApiInsNews()
        function insNews() {
            const insNewsSwiper = new Swiper('.ins-news-main-inner', {
                modules: [Navigation, Grid],
                slidesPerView: 1,
                navigation: {
                    nextEl: '.ins-news-main-pagi .swiper-pagi-next',
                    prevEl: '.ins-news-main-pagi .swiper-pagi-prev'
                },
                grid: {
                    fill: 'column',
                    rows: 4,
                },
                breakpoints: {
                    767: {
                        slidesPerView: 2,
                        grid: {
                            rows: 2,
                        },
                    },
                    991: {
                        slidesPerView: 1,
                        grid: {
                            rows: 4,
                        },
                    }
                }
            });
        }
        function insNewsLogo() {
            $('.ins-news-logo-item.item-default').addClass('active');
            $('.ins-news-main-item').on('pointermove', function(e) {
                let idx = $(this).index()
                $('.ins-news-logo-item').removeClass('active')
                $('.ins-news-logo-item').eq(idx + 1).addClass('active')
            })
            $('.ins-news-main-item').on('pointerleave', function(e) {
                $('.ins-news-logo-item').removeClass('active')
                $('.ins-news-logo-item.item-default').addClass('active');
            })
        }
        let pageLimit = 2;
        function getApiInsArt() {
            getAllDataByType('article').then((res) => {
                let allArt = res;
                if (allArt.length < pageLimit) {
                    $('.ins-art-main-btn-wrap').addClass('hidden')
                }
                let templateArtItem = $('.ins-art-main-item').eq(0).clone();
                let parent = '.ins-art-main-inner';
                $(parent).html('')
                allArt.forEach((i, idx) => {
                    let html = templateArtItem.clone();
                    let originalUrl = html.attr('href');
                    html.attr('href', `${originalUrl}?id=${i.uid}`)
                    html.find('.ins-art-main-item-thumb img').attr('src', i.data.image.url).attr('alt', i.data.image.alt ? i.data.image.alt : i.data.title)
                    html.find('.ins-art-main-item-title').text(i.data.title)
                    html.find('.ins-art-main-item-label .txt-med').text(`${new Date(i.data.date).toLocaleString('default', { month: 'long' })}, ${new Date(i.data.date).getFullYear()}`)
                    if ((idx + 1) > pageLimit) {
                        html.addClass('hidden')
                    }
                    html.appendTo(parent);
                })
            }).then(insArtPagi)
        }
        getApiInsArt()
        function insArtPagi() {
            $('.ins-art-main-btn-wrap .btn').on('click', function(e) {
                e.preventDefault();
                let allHiddenItem = $('.ins-art-main-item.hidden');
                allHiddenItem.each((idx, el) => {
                    if ((idx + 1) <= pageLimit) {
                        $(el).css('display', 'none')
                        $(el).removeClass('hidden');
                        $(el).slideDown()
                    }
                })
                if ($('.ins-art-main-item.hidden').length == 0) {
                    $('.ins-art-main-btn-wrap').slideUp(() => {
                        $('.ins-art-main-btn-wrap').addClass('hidden')
                    })
                }
            })
        }
    },
    beforeLeave() {
    }
}
export default insightScript

