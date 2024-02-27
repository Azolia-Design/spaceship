import $ from "jquery";
import gsap from "gsap";
import Swiper from "swiper";
import { Navigation } from "swiper";
import ScrollTrigger from "gsap/ScrollTrigger";
import { getAllDataByType, getDetail } from "./common/prismic_fn";
import { parseRem, sortAsc } from "./untils";
import { getLang } from "./common/lang";


gsap.registerPlugin(ScrollTrigger);

const blogdtlScript = {
    namespace: 'blogdtl',
    afterEnter(data) {

        let param;
        function updateBlogContent(data) {
            param = window.location.search.replace('?id=', '')
            getDetail('article', param).then((res) => {
                let item = res;
                $(document).find('title').text(`${item.data.title} | SpaceShip`)
                $(data.next.container).find('.blogdtl-hero-title').text(item.data.title)
                $(data.next.container).find('.blogdtl-hero-thumb img').attr('src', item.data.image.url).attr('alt', item.data.title)
                $(data.next.container).find('.blogdtl-main-rictxt').html('')
                $(data.next.container).find('.blogdtl-main-rictxt').html(toHTML(item.data.content))
                updateUlLi($(data.next.container).find('.blogdtl-main-rictxt').get(0))
                // updateUrl(item)
                $(data.next.container).find('.blogdtl-hero-thumb').addClass('active')
            })
        }
        updateBlogContent(data)
        function updateUrl(item) {
            history.replaceState({}, '', `/${item.uid}`)
        }
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
                                case 'hyperlink':
                                    string = string.replace(block.text.substring(span.start, span.end), `<a href="${span.data.url}" class="txt-link" ${span.data.url.target ? 'target="_blank"' : ''}>${block.text.substring(span.start, span.end)}</a>`);
                                    break;
                                default:
                                    break;
                            }
                        }
                        html += `<p class="txt txt-18"">${string}</p>`;
                        break;
                    case 'heading2':
                        html += `<h2 class="heading h6">${block.text}</h2>`;
                        break;
                    case 'heading3':
                        isLabeled = block.spans.filter(span => span.type == 'label');
                        html += `<h3 class="txt txt-20 txt-med" data-label="${isLabeled.length ? isLabeled[0].data.label : ''}">${block.text}</h3>`;
                        break;
                    case 'image':
                        html += `<figure>
                        <div class="rictxt-img">
                            <img src="${block.url}" alt="${block.alt}" width="${block.dimensions.width}" height="${block.dimensions.height}">
                        </div>
                        ${block.alt ? '<figcaption>' + block.alt + '</figcaption>' : ''}
                    </figure>`;
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
                                case 'hyperlink':
                                    listString = listString.replace(block.text.substring(span.start, span.end), `<a href="${span.data.url}" class="txt-link">${block.text.substring(span.start, span.end)}</a>`);
                                    break;
                                default:
                                    break;
                            }
                        }
                        html += `<li class="txt txt-18">${listString}</li>`;
                        break;
                    default:
                        console.error(`Unsupported block type: ${block.type}`);
                }
            }
            return html;
        }
        function updateUlLi(wrapper) {
            const wrapperEl = $(wrapper);
            const liEls = wrapperEl.find('li');
            liEls.each((i) => {
                let ulTemplate = $('<ul class="art-txt-ul"></ul>')
                if (liEls.eq(i).prev().get(0) != liEls.eq(i - 1).get(0)) {
                    ulTemplate.clone().insertBefore(liEls.eq(i))
                }
            })
            liEls.each((i) => {
                if (liEls.eq(i).prev().prop('tagName') == 'UL') {
                    liEls.eq(i).appendTo(liEls.eq(i).prev())
                }
            })
        }
        function getApiBlogdtlRel(data) {
            getAllDataByType('article').then((res) => {
                let allArt = res.filter((i) => i.uid != param);
                let templateArtItem = $(data.next.container).find('.blogdtl-rel-item').eq(0).clone();
                let parent = '.blogdtl-rel-list';
                $(data.next.container).find(parent).html('')
                allArt.forEach((i, idx) => {
                    if (idx < 4) {
                        let html = templateArtItem.clone();
                        let originalUrl = window.location.origin + window.location.pathname;
                        html.attr('href', `${originalUrl}?id=${i.uid}`)
                        html.find('.blogdtl-rel-item-title').text(i.data.title)
                        html.find('.blogdtl-rel-item-label .txt-med').text(`${new Date(i.data.date).toLocaleString('default', { month: 'long' })}, ${new Date(i.data.date).getFullYear()}`)
                        html.appendTo(parent);
                    }
                })
            }).then(() => {
                blogdtlRel(data)
            })
        }
        getApiBlogdtlRel(data)
        function blogdtlRel(data) {
            if ($(window).width() < 767) {
                const blogdtlRelSwiper = new Swiper($(data.next.container).find('.blogdtl-rel-main').get(0), {
                    modules: [Navigation],
                    slidesPerView: 'auto',
                    spaceBetween: parseRem(20),
                    navigation: {
                        nextEl: $(data.next.container).find('.blogdtl-rel-pagi .swiper-pagi-next').get(0),
                        prevEl: $(data.next.container).find('.blogdtl-rel-pagi .swiper-pagi-prev').get(0)
                    },
                })
            }
        }
    },
    beforeLeave() {
    }
}
export default blogdtlScript

