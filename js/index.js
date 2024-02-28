import 'swiper/swiper-bundle.min.css'
import $, { get } from "jquery";
import lenis from './vendors/lenis';
import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { parseRem, xSetter, ySetter, xGetter, yGetter, pointerCurr, lerp } from "./untils";
import homeScript from './home';
import termScript from './term';
import blogdtlScript from './blogdtl';
import aboutScript from './about';
import solutionScript from './solution';
import insightScript from './insight';
import notfoundScript from './notfound';
import { getAllDataByType, getDetail } from './common/prismic_fn';
import { setLang, getLang, setDefaultlang } from "./common/lang";


const scripts = () => {

    setDefaultlang()
    handleLangToggle()
    UpdateLangApi()
    function handleLangToggle() {
        gsap.set('.header-lang-popup-ic', {'--index-item': $('[data-lang].active').index()})
    
        $(`[data-lang-toggle]`).on('click', function(e) {
            e.preventDefault()
            if ($(this).hasClass('active')) {
                $(this).removeClass('active')
                $(`.header-lang-popup`).removeClass('active')
            } else {
                $(this).addClass('active')
                $(`.header-lang-popup`).addClass('active')
            }
        })
        $('[data-lang]').on('click', function (e) {
            e.preventDefault()
            setLang($(this).attr('data-lang'))
            gsap.to('.header-lang-popup-ic', {'--index-item': $(this).index(), duration: .5})
        })
        $(window).on('click', function(e) {
            if (!$(`.header-lang-popup:hover`).length && !$(`[data-lang-toggle]:hover`).length) {
                $(`.header-lang-popup`).removeClass('active')
                $(`[data-lang-toggle]`).removeClass('active')
            }
        })
    }
    
    function UpdateLangApi() {
        getDetail('global', 'global', getLang()).then((res) => {
            return res.data;
        }).then((data) => {
            // console.log(data);
            updateContent.header(data)
            updateContent.footer(data)
        })

        const updateContent = {
            header: (data) => {
                $('.header-link-txt[data-link="home"]').text(data.home)
                $('.header-link-txt[data-link="about"]').text(data.about)
                $('.header-link-txt[data-link="solution"]').text(data.solution)
                $('.header-link-txt[data-link="insight"]').text(data.insight)
                $('.header-link-txt[data-link="careers"]').text(data.career)
                $('.header-act .btn .txt').text(data.getintouch)
            },
            footer: (data) => {
                $('.ft-ctc-grp-label.contactus').text(data.contact)
                $('.ft-ctc-grp-label.headoffice').text(data.headoffice)
                $('.ft-menu-link-txt[data-link="home"]').text(data.home)
                $('.ft-menu-link-txt[data-link="about"]').text(data.about)
                $('.ft-menu-link-txt[data-link="solution"]').text(data.solution)
                $('.ft-menu-link-txt[data-link="insight"]').text(data.insight)
                $('.ft-menu-link-txt[data-link="careers"]').text(data.career)
                $('.ft-abt-info-btn-wrap .txt').text(data.getintouch)
                $('.ft-abt-form-title').text(data.newletter)
                $('.ft-abt-form-btn-wrap .ft-abt-form-submit-txt').text(data.subscribe)

                $('.ft-copy-txt').html(data.copyright.replace(`2024`, `<span data-year>2024</span>`))
                $('[data-link="imprint"]').text(data.imprint)
                $('[data-link="term"]').text(data.privacy_policy)
            }
        }
    }

    if (history.scrollRestoration) {
        history.scrollRestoration = "manual";
    }
    const GTAG_ID = 'G-4DB80S5P4S';
    barba.use(barbaPrefetch);
    gsap.registerPlugin(ScrollTrigger);

    function debounce(func, delay = 100) {
        let timer;
        return function (event) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(func, delay, event);
        };
    }
    function refreshOnBreakpoint() {
        let initialViewportWidth = window.innerWidth || document.documentElement.clientWidth;
        let newViewportWidth;
        // portrait mobile viewport initial, any change refresh
        if (initialViewportWidth < 480) {
            $(window).on('resize', debounce(function () {
                newViewportWidth = window.innerWidth || document.documentElement.clientWidth;
                if (newViewportWidth > 479) {
                    location.reload();
                }
            }))
        }
        // landscape mobile viewport initial, any change refresh
        else if (initialViewportWidth < 768) {
            $(window).on('resize', debounce(function () {
                newViewportWidth = window.innerWidth || document.documentElement.clientWidth;
                if (newViewportWidth > 767) {
                    location.reload();
                }
            }))
        }
        // tablet viewport initial, any change refresh
        else if (initialViewportWidth > 767 && initialViewportWidth < 992) {
            $(window).on('resize', debounce(function () {
                newViewportWidth = window.innerWidth || document.documentElement.clientWidth;
                if (newViewportWidth < 768 || newViewportWidth > 991) {
                    location.reload();
                }
            }))
        }
        // web viewport initial, any change refresh
        else if (initialViewportWidth > 991) {
            $(window).on('resize', debounce(function () {
                newViewportWidth = window.innerWidth || document.documentElement.clientWidth;
                if (newViewportWidth < 992) {
                    location.reload();
                }
            }))
        }
    }
    refreshOnBreakpoint();
    function addNavActiveLink(data) {
        $('[data-link]').removeClass('active')
        $(`[data-link="${$(data.next.container).attr('data-namespace')}"]`).addClass('active')
    }
    function handleHeaderMode(data) {
        $('.header').removeClass('on-hide dark-mode')
        if ($(data.next.container).attr('data-header') == 'dark') {
            $('.header').addClass('dark-mode')
        }
    }
    function resetScroll() {
        let locationHash = window.location.hash;
        lenis.stop()
        if ($(locationHash).length) {
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

        } else {
            lenis.scrollTo(0, {
                force: true,
                immediate: true,
            });
        }
        lenis.start()
    }
    function resetBeforeLeave(data) {
        $('.header-nav').removeClass('active')
        handleHeaderMode(data)
        addNavActiveLink(data);
    }
    const handleCursor = {
        init: () => {
            function mouseMove() {
                let iconX = xGetter('.cursor-wrap')
                let iconY = yGetter('.cursor-wrap')
                xSetter('.cursor-wrap')(lerp(iconX, pointerCurr().x, .15))
                ySetter('.cursor-wrap')(lerp(iconY, pointerCurr().y, .15))
                requestAnimationFrame(mouseMove)
                if ($('.swiper-wrapper.home-prob-inner:hover').length) {
                    $('.cursor-inner').addClass('on-hover-drag')
                } else {
                    $('.cursor-inner').removeClass('on-hover-drag')
                }
            }
            requestAnimationFrame(mouseMove)
        },
        reset: () => {
            $('.cursor-inner').removeClass('on-hover-drag')
        }
    }
    handleCursor.init()
    const handlePopup = {
        init: () => {
            $('[data-popup]').on('click', function (e) {
                e.preventDefault();
                if ($(this).attr('data-popup') == 'open') {
                    $('.popup').addClass('active')
                    lenis.stop()
                    $('.header-nav').removeClass('active')
                } else {
                    $('.popup').removeClass('active')
                    lenis.start()
                }
            })
        },
        open: () => {

        }
    }
    handlePopup.init()
    function handleForm() {
        //Form utils
        function mapFormToObject(ele) {
            return (parsedFormData = [...new FormData(ele).entries()].reduce(
                (prev, cur) => {
                    const name = cur[0];
                    const val = cur[1];
                    return { ...prev, [name]: val };
                },
                {}
            ));
        }
        function initForm(form, options) {
            const { submitEle = {}, onSuccess, onError, handleSubmit, prepareMap, fields, pageName = "Form", hubspot } = options;
            const { ele, textEle } = submitEle;

            let submitBtn = $(form).find('button[type=submit]');
            if (ele) {
                submitBtn = $(form).find(ele);
            }
            let defaultText = submitBtn.clone().val();
            if (textEle) {
                defaultText = submitBtn.find(textEle).clone().text();
            }

            let url = $(form).attr('action');

            if (hubspot) {
                const { portalId, formId } = hubspot;
                url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;
            }

            const setLoading = (isLoading) => {
                if (isLoading) {
                    if (textEle) {
                        submitBtn.find(textEle).text('Please wait ...');
                    } else {
                        submitBtn.val('Please wait ...');
                    }

                    submitBtn.css({ 'pointer-events': 'none' })
                }
                else {
                    if (textEle) {
                        submitBtn.find(textEle).text(defaultText);
                    } else {
                        submitBtn.val(defaultText)
                    }
                    submitBtn.css({ 'pointer-events': '' })
                }
            }

            const showError = (message = "Something error") => {
                alert(message)
            }
            const mapField = (data) => {
                if (!fields.length) return [];
                const result = fields.map((field) => {
                    const { name, value, regexp } = field;
                    if (!value) {
                        return {
                            name,
                            value: data[name] || ""
                        }
                    }
                    else {
                        const getValue = value(data);
                        return {
                            name,
                            value: getValue || ''
                        }
                    }
                })
                return result;
            }
            const sendSubmission = (data) => {
                const mappedFields = mapField(data);
                const dataSend = {
                    fields: mappedFields,
                    context: {
                        pageUri: window.location.href,
                        pageName: pageName,
                    },
                };
                $.ajax({
                    url: url,
                    method: 'POST',
                    data: JSON.stringify(dataSend),
                    dataType: 'json',
                    headers: {
                        accept: 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    contentType: 'application/json',
                    success: function (response) {
                        $(form).get(0).reset()
                        if (onSuccess) onSuccess(data);
                        setLoading(false);
                    },
                    error: function (error) {
                        if (error.readyState === 4) {
                            const errors = error.responseJSON.errors
                            const errorArr = errors[0].message.split('.')
                            const errorMess = errorArr[errorArr.length - 1]

                            showError(errorMess);
                        }
                        else {
                            showError('Something error');
                        }
                        setLoading(false)
                    },
                });
            }

            $(form).on("submit", function (e) {
                e.preventDefault();
                setLoading(true);
                if (prepareMap) {
                    prepareMap($(this));
                }
                const data = mapFormToObject(e.target);
                if (handleSubmit) handleSubmit(data);
                sendSubmission(data);
                return false;
            });
        }

        //form contact popup
        //$('.input-field').on('change keyup blur input', hanldeInput);
        // $('.popup-form-inner .popup-form-submit').on('click', function (e) {
        //     e.preventDefault();

        //     $('.popup-form-inner').trigger('submit');
        // })
        const formContact = initForm('.popup-form-inner', {
            onSuccess: (data) => {
                // success form callback
                $('.popup-form').find('.popup-form-succ [data-form-name]').text(data.firstname)
                $('.popup-form').find('.popup-form-inner').addClass('hidden')
                $('.popup-form').find('.popup-form-succ').removeClass('hidden')
            },
            hubspot: {
                portalId: '143957301',
                formId: '34eda6ac-e4e0-4d69-af5f-ea2e02d6850a'
            },
            submitEle: {
                ele: '.popup-form-submit',
                textEle: '.popup-form-submit-txt',
            },
            pageName: document.title,
            prepareMap: (ele) => {
            },
            fields: [
                {
                    name: 'firstname',
                    value: (data) => data.firstname,
                },
                {
                    name: 'lastname',
                    value: (data) => data.lastname,
                },
                {
                    name: 'email',
                    value: (data) => data.email,
                },
                {
                    name: 'message',
                    value: (data) => data.message
                },
            ]
        })
        $('.popup-form .popup-form-succ-btn').on('click', function (e) {
            e.preventDefault();
            $('.footer__form-main').trigger('reset');
            $('.popup-form').find('.popup-form-inner').removeClass('hidden')
            $('.popup-form').find('.popup-form-succ').addClass('hidden')
        })
        //form subscribe footer
        const formSubscribe = initForm('.ft-abt-form', {
            onSuccess: (data) => {
                // success form callback
                $('.footer').find('.ft-input-wrap .input-field').val('Thanks for subscribing!')

                setTimeout(() => {
                    $('.footer').find('.ft-input-wrap .input-field').val('')
                }, 2000);
            },
            hubspot: {
                portalId: '143957301',
                formId: '82e04d4a-4077-496d-a5f1-19f7bba52cea'
            },
            submitEle: {
                ele: '.ft-abt-form-submit',
                textEle: '.ft-abt-form-submit-txt',
            },
            pageName: document.title,
            prepareMap: (ele) => {
            },
            fields: [
                {
                    name: 'email',
                    value: (data) => data.email,
                },
            ]
        })
    }
    handleForm()
    //Gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    const updateGtag = {
        once: () => {
            gtag('js', new Date());
            gtag('config', GTAG_ID);
            console.log('hello')
        },
        reinit: () => {
            gtag('config', GTAG_ID, {
                send_page_view: false,
            });
            window.dataLayer.push({
                'event': 'page_view',
                'page_title': (document.title) ? document.title : '',
                'page_URL': (window.location.href) ? window.location.href : '',
                'page_path': (window.location.pathname) ? window.location.pathname : '',
                'page_hash': (window.location.hash) ? window.location.hash : ''
            });
            console.log(window.dataLayer);
        }
    }

    const header = $('.header')
    lenis.on('scroll', function (inst) {
        if (inst.scroll < header.outerHeight()) {
            header.removeClass('on-hide')
            header.removeClass('on-scroll')
        } else {
            header.addClass('on-scroll')
            if (!$('.header-nav').hasClass('active')) {
                if (inst.direction >= 1) {
                    header.addClass('on-hide')
                } else {
                    header.removeClass('on-hide')
                }
            } else {
                header.removeClass('on-hide')
            }
        }
    })
    $('.header-toggle-link').on('click', function (e) {
        e.preventDefault();
        $('.header-nav').addClass('active')
    })
    $('.header-nav-close-ic').on('click', function (e) {
        e.preventDefault();
        $('.header-nav').removeClass('active')
    })
    function updateContactInfo(data) {
        let parent;
        // console.log(data)
        if (!data) {
            parent = $('body')
        } else {
            parent = $(data.next.container)
        }
        // console.log(parent)
        getAllDataByType('global_info').then(res => {
            let infos = res;
            let allItem = parent.find('[data-replace]');
            allItem.each((idx, el) => {
                let type = $(el).attr('data-replace')
                let src;
                switch (type) {
                    case 'tel':
                        src = infos.filter((i) => i.uid == 'tel')[0]
                        $(el).attr('href', `tel:${src.data.link.url}`)
                        if ($(el).find('.ft-ctc-link-txt').length) {
                            $(el).find('.ft-ctc-link-txt').text(src.data.link.url)
                        } else {
                            $(el).text(src.data.link.url)
                        }
                        break;
                    case 'email':
                        src = infos.filter((i) => i.uid == 'email')[0]
                        $(el).attr('href', `email:${src.data.link.url}`)
                        if ($(el).find('.ft-ctc-link-txt').length) {
                            $(el).find('.ft-ctc-link-txt').text(src.data.link.url)
                        } else {
                            $(el).text(src.data.link.url)
                        }
                        break;
                    case 'linkedin':
                        src = infos.filter((i) => i.uid == 'linkedin')[0]
                        $(el).attr('href', src.data.link.url).attr('target', '_blank')
                        break;
                    case 'address':
                        src = infos.filter((i) => i.uid == 'address')[0]
                        $(el).attr('href', src.data.link.url).attr('target', '_blank')
                        $(el).find('.ft-ctc-link-txt').text(src.data.name)
                        break;
                    default:
                        break;
                }

            })
        })
    }
    function transitionOnce(data) {
        let tl = gsap.timeline({

        })
    }
    function transitionLeave(data) {
        gsap.set(data.next.container, { opacity: 0 })
        let tl = gsap.timeline({})
        tl
            .to(data.current.container, {
                opacity: 0, duration: .4, onComplete: () => {
                    $(data.current.container).remove()
                    resetScroll()
                }
            })
            .to('.footer', { opacity: 0, duration: .4 }, '<=0')
            .to(data.next.container, { opacity: 1, duration: .4 })
            .to('.footer', { opacity: 1, duration: .4 }, '<=0')
        return tl;
    }
    function transitionEnter(data) {
        let tl = gsap.timeline({})
        tl
        return tl;
    }

    const VIEWS = [
        homeScript,
        aboutScript,
        termScript,
        blogdtlScript,
        solutionScript,
        insightScript,
        notfoundScript
    ]

    barba.init({
        preventRunning: true,
        transitions: [{
            name: 'opacity-transition',
            sync: true,
            once(data) {
                updateGtag.once();
                resetScroll()
                updateContactInfo()
                resetBeforeLeave(data)
                transitionOnce(data)
            },
            async enter(data) {

            },
            async afterLeave(data) {

            },
            async afterEnter(data) {
                await transitionEnter(data)
            },
            async beforeLeave(data) {
                resetBeforeLeave(data)
                updateContactInfo(data)
            },
            async leave(data) {
                await transitionLeave(data)
            },
            async afterLeave(data) {
            },
            async after(data) {
                updateGtag.reinit();
            }
        }],
        views: VIEWS
    })
}

window.onload = scripts
