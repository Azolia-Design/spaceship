function getLang() {
    switch (document.querySelector('html').getAttribute('lang')) {
        case 'es':
            return 'es-es';
        default:
            return 'en-us';
    }
}
function setLang(data, setURL = true) {
    document.querySelector('html').setAttribute('lang', data)
    setActiveLangBtn(data)
    setAnchor(data)
    document.querySelector('.header-lang-open-txt').textContent = data.toUpperCase()
    if (setURL) {
        setActiveLangURL(data)
    }
}
function setActiveLangBtn(data) {
    document.querySelectorAll("[data-lang]").forEach((el) => {
        el.classList.remove("active")
    })
    document.querySelectorAll(`[data-lang=${data}]`).forEach((el) => {
        el.classList.add("active")
    })
}
function setAnchor(data) {
    if (data == 'es') {
        document.querySelectorAll('a:not([data-lang])').forEach((el) => {
            if (!el.getAttribute('href').includes('mailto') &&
                !el.getAttribute('href').includes('tel:') &&
                !el.getAttribute('href').includes('https:')) {
                let newHref = el.getAttribute('href') + '?lang=es'
                el.setAttribute('href', newHref)
            }
        })
    } else if (data == 'en') {
        document.querySelectorAll('a:not([data-lang])').forEach((el) => {
            if (!el.getAttribute('href').includes('mailto') &&
                !el.getAttribute('href').includes('tel:') &&
                !el.getAttribute('href').includes('https:')) {
                let newHref = el.getAttribute('href').replace('?lang=es', '')
                el.setAttribute('href', newHref)
            }
        })
    }
}
function setActiveLangURL(data) {
    let newUrl
    switch (data) {
        case 'es':
            if (!window.location.href.includes('?')) {
                newUrl = `${window.location.origin + window.location.pathname}${window.location.href.includes('#') ? window.location.hash: ''}?lang=` + data
            } else {
                newUrl = `${window.location.origin + window.location.pathname + window.location.search}&lang=` + data
            }
            break;
        default:
            if (!window.location.href.includes('id')) {
                newUrl = window.location.href.replace('?lang=es', '')
            } else {
                newUrl = window.location.href.replace('lang=es', '').replace('&', '')
            }
            break;
    }
    history.replaceState({}, '', newUrl)
    if (newUrl.includes('#')) {
        location.reload();
    } else {
        window.location = newUrl
    }
}
function setDefaultlang() {
    let initLang;
    if (!window.location.search.includes('lang')) {
        if (window.location.hash.includes('?lang')) {
            initLang = window.location.hash.split('=')[1]
        } else {
            initLang = 'en'
        }
    } else {
        let search = JSON.parse('{"' + decodeURI(window.location.search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
        initLang = search.lang   
    }
    console.log(initLang)
    switch (initLang) {
        case 'es':
            setLang('es', false)
            break;
        case 'en':
            setLang('en', false)
            break;
        default:
            setLang('en', false)
            break;
    }
}

export { setLang, getLang, setDefaultlang, setActiveLangURL }