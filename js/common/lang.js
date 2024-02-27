import $ from "jquery";

function getlang() {
    if (localStorage.getItem('lang')) {
        if (localStorage.getItem('lang') == 'es') {
            return 'es-es'
        } else {
            return 'en-us'
        }
    } else {
        return 'en-us'
    }
}

function setLang(data) {
    localStorage.setItem('lang', data)
}

function updateSearch() {
    let urlSearch = window.location.search.substring(1)
    if (urlSearch !== '') {
        let search = JSON.parse('{"' + decodeURI(urlSearch).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
        if (search.lang == 'es' || search.lang == 'es-es') {
            history.replaceState({}, '', `${window.location.origin + window.location.pathname}?${search.id ? `id=${search.id}&` : ''}lang=es`);
            setLang('es')
            $('html').attr('lang', 'es')

        } else {
            history.replaceState({}, '', `${window.location.origin + window.location.pathname}${search.id ? `?id=${search.id}` : ''}`);
            setLang('en')
            $('html').attr('lang', 'en')
        }
    }
    $(`[data-lang="${getlang()}"]`).addClass('active')
    $('[data-lang]').on('click', function (e) {
        e.preventDefault()
        if ($(this).attr('data-lang') == 'es-es') {
            setLang('es')
            window.location = `${window.location.origin + window.location.pathname}?lang=es`
        } else {
            setLang('en')
            window.location = `${window.location.origin + window.location.pathname}`
        }
    })
}
function setDefaultlang() {
    let langTarget = localStorage.getItem('lang')
    if (langTarget) {
        if (localStorage.getItem('lang') !== 'es' && localStorage.getItem('lang') !== 'en') {
            setLang('en')
        }
    } else {
        setLang('en')
    }
}

export { setLang, getlang, setDefaultlang, updateSearch }