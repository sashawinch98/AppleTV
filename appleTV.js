(function () {

    'use strict';

    if (window.LampaAppleTVTest) return;

    window.LampaAppleTVTest = true;

    function start() {

        if (!window.Lampa) {

            setTimeout(start, 500);

            return;

        }

        var style = document.createElement('style');

        style.type = 'text/css';

        style.textContent = [

            'html, body {',

            '    background: #050505 !important;',

            '    color: #ffffff !important;',

            '}',

            '.head {',

            '    background: rgba(5,5,5,.96) !important;',

            '    box-shadow: none !important;',

            '}',

            '.items-line__title {',

            '    color: #ffffff !important;',

            '    font-weight: 700 !important;',

            '}',

            '.card__view {',

            '    border-radius: 14px !important;',

            '    overflow: hidden !important;',

            '}',

            '.card.focus {',

            '    transform: scale(1.05) !important;',

            '    z-index: 20 !important;',

            '}',

            '.card.focus .card__view {',

            '    box-shadow: 0 20px 50px rgba(0,0,0,.65) !important;',

            '}',

            '.menu {',

            '    background: #08080a !important;',

            '}',

            '.menu__item.focus {',

            '    background: rgba(255,255,255,.12) !important;',

            '    color: #ffffff !important;',

            '    border-radius: 12px !important;',

            '}',

            '.simple-button,',

            '.button {',

            '    border-radius: 999px !important;',

            '}',

            '.full-start {',

            '    background: #050505 !important;',

            '}',

            '.full-start__poster {',

            '    border-radius: 16px !important;',

            '    overflow: hidden !important;',

            '}',

            '.full-start__title {',

            '    color: #ffffff !important;',

            '    font-weight: 800 !important;',

            '}',

            '.full-start__description {',

            '    color: #d1d1d6 !important;',

            '}',

            '.modal,',

            '.selectbox {',

            '    background: #151517 !important;',

            '    border-radius: 18px !important;',

            '}'

        ].join('\\n');

        document.head.appendChild(style);

        console.log('[Apple TV Lampa] loaded');

        if (Lampa.Noty) {

            Lampa.Noty.show('Apple TV UI загружен');

        }

    }

    start();

})();
