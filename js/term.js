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
                getApiPolicyContent(data)
                getApiPolicyRichText(data)
            });
            function getApiPolicyContent(data) {
                $('.term-hero-title').text(data.hero_title)
                let effectiveTxt = $('.term-hero-date').html()
                $('.term-hero-date').html(effectiveTxt.replace('Effective from', data.hero_effective))
            }
            function getApiPolicyRichText(data) {
                let richTxt = data.policy_richtext
                $('.term-main-rictxt').html(toHTML(richTxt))
                updateUlLi($('.term-main-rictxt'))
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
                            html += `<h2 class="heading h5">${block.text}</h2>`;
                            break;
                        case 'heading3':
                            isLabeled = block.spans.filter(span => span.type == 'label');
                            html += `<h3 class="heading h6" data-label="${isLabeled.length ? isLabeled[0].data.label : ''}">${block.text}</h3>`;
                            break;
                        case 'heading4':
                            isLabeled = block.spans.filter(span => span.type == 'label');
                            html += `<h4 class="txt txt-20 txt-med" data-label="${isLabeled.length ? isLabeled[0].data.label : ''}">${block.text}</h4>`;
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
        }
    },
    beforeLeave() {
    }
}
export default termScript

