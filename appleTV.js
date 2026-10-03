{\rtf1\ansi\ansicpg1251\cocoartf2639
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;\red255\green255\blue255;\red53\green134\blue255;}
{\*\expandedcolortbl;;\cssrgb\c100000\c100000\c100000;\cssrgb\c25490\c61176\c100000;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf0 \expnd0\expndtw0\kerning0
(function () \{\
   'use strict';\
\
   if (window.LampaAppleTVUI) return;\
   window.LampaAppleTVUI = true;\
\
   var STYLE_ID = 'lampa-apple-tv-ui';\
\
   var css = `\
   /* =========================================================\
      LAMPA \'97 APPLE TV STYLE\
      Visual skin only\
      No external libraries\
      ========================================================= */\
\
   :root \{\
       --atv-bg: #050505;\
       --atv-bg-soft: #0b0b0d;\
       --atv-card: #151517;\
       --atv-card-hover: #202023;\
\
       --atv-white: #f5f5f7;\
       --atv-text: #e8e8ed;\
       --atv-secondary: #a1a1a6;\
       --atv-muted: #77777d;\
\
       --atv-blue: #0a84ff;\
\
       --atv-radius: 14px;\
       --atv-radius-small: 10px;\
\
       --atv-shadow:\
           0 12px 35px rgba(0,0,0,.45);\
\
       --atv-shadow-focus:\
           0 20px 55px rgba(0,0,0,.65);\
   \}\
\
\
   /* =========================================================\
      GLOBAL\
      ========================================================= */\
\
   html,\
   body \{\
       background: var(--atv-bg) !important;\
       color: var(--atv-text) !important;\
   \}\
\
   body \{\
       font-family:\
           -apple-system,\
           BlinkMacSystemFont,\
           "SF Pro Display",\
           "SF Pro Text",\
           "Segoe UI",\
           Roboto,\
           Arial,\
           sans-serif !important;\
\
       overflow-x: hidden !important;\
   \}\
\
   .app,\
   .app__content,\
   .app-content,\
   .main,\
   .activity,\
   .scroll \{\
       background: var(--atv-bg) !important;\
   \}\
\
   * \{\
       box-sizing: border-box;\
   \}\
\
\
   /* =========================================================\
      HEADER\
      ========================================================= */\
\
   .head \{\
       background:\
           linear-gradient(\
               180deg,\
               rgba(5,5,5,.98) 0%,\
               rgba(5,5,5,.88) 45%,\
               rgba(5,5,5,0) 100%\
           ) !important;\
\
       border: 0 !important;\
       box-shadow: none !important;\
\
       min-height: 4.8em !important;\
\
       z-index: 100 !important;\
   \}\
\
   .head__title \{\
       color: #fff !important;\
\
       font-size: 1.25em !important;\
       font-weight: 700 !important;\
\
       letter-spacing: -.025em !important;\
   \}\
\
\
   /* =========================================================\
      MENU\
      ========================================================= */\
\
   .menu \{\
       background:\
           rgba(8,8,10,.98) !important;\
\
       border: 0 !important;\
\
       box-shadow:\
           18px 0 55px rgba(0,0,0,.45) !important;\
   \}\
\
   .menu__item \{\
       color: #a1a1a6 !important;\
\
       border-radius: 12px !important;\
\
       margin:\
           .18em .65em !important;\
\
       padding:\
           .72em .9em !important;\
\
       transition:\
           transform .12s ease,\
           background .12s ease,\
           color .12s ease !important;\
   \}\
\
   .menu__item:hover,\
   .menu__item.focus \{\
       color: #fff !important;\
\
       background:\
           rgba(255,255,255,.10) !important;\
\
       transform:\
           scale(1.015) !important;\
   \}\
\
   .menu__item.active \{\
       color: #fff !important;\
\
       background:\
           rgba(255,255,255,.13) !important;\
   \}\
\
\
   /* =========================================================\
      CONTENT ROWS\
      ========================================================= */\
\
   .items-line \{\
       background: transparent !important;\
\
       margin-bottom:\
           1.6em !important;\
   \}\
\
   .items-line__body \{\
       background: transparent !important;\
   \}\
\
   .items-line__head \{\
       margin-bottom:\
           .55em !important;\
\
       padding-left:\
           .1em !important;\
   \}\
\
   .items-line__title \{\
       color: var(--atv-white) !important;\
\
       font-size: 1.22em !important;\
\
       font-weight: 700 !important;\
\
       letter-spacing:\
           -.025em !important;\
   \}\
\
   .items-line__more \{\
       color:\
           var(--atv-blue) !important;\
\
       font-weight:\
           600 !important;\
   \}\
\
\
   /* =========================================================\
      MOVIE CARDS\
      ========================================================= */\
\
   .card \{\
       background:\
           transparent !important;\
\
       border-radius:\
           var(--atv-radius) !important;\
\
       overflow:\
           visible !important;\
\
       box-shadow:\
           none !important;\
\
       transition:\
           transform .16s ease !important;\
   \}\
\
   .card__view \{\
       background:\
           var(--atv-card) !important;\
\
       border-radius:\
           var(--atv-radius) !important;\
\
       overflow:\
           hidden !important;\
\
       border:\
           1px solid rgba(255,255,255,.035) !important;\
\
       box-shadow:\
           var(--atv-shadow) !important;\
   \}\
\
   .card__img,\
   .card__view img \{\
       border-radius:\
           var(--atv-radius) !important;\
   \}\
\
   .card__title \{\
       color:\
           var(--atv-white) !important;\
\
       font-size:\
           .9em !important;\
\
       font-weight:\
           600 !important;\
\
       letter-spacing:\
           -.01em !important;\
\
       padding-top:\
           .5em !important;\
   \}\
\
   .card__subtitle \{\
       color:\
           var(--atv-secondary) !important;\
   \}\
\
\
   /* =========================================================\
      APPLE TV FOCUS\
      ========================================================= */\
\
   .card.focus,\
   .card:hover \{\
       transform:\
           scale(1.045) !important;\
\
       z-index:\
           20 !important;\
   \}\
\
   .card.focus .card__view,\
   .card:hover .card__view \{\
       background:\
           var(--atv-card-hover) !important;\
\
       border-color:\
           rgba(255,255,255,.14) !important;\
\
       box-shadow:\
           var(--atv-shadow-focus) !important;\
   \}\
\
\
   /* =========================================================\
      WIDE / LANDSCAPE CARDS\
      ========================================================= */\
\
   .card--wide .card__view,\
   .card.wide .card__view \{\
       border-radius:\
           12px !important;\
   \}\
\
\
   /* =========================================================\
      FULL MOVIE / SERIES PAGE\
      ========================================================= */\
\
   .full-start \{\
       background:\
           #050505 !important;\
\
       color:\
           #fff !important;\
   \}\
\
   .full-start__background \{\
       opacity:\
           .58 !important;\
\
       filter:\
           saturate(.9) !important;\
\
       -webkit-mask-image:\
           linear-gradient(\
               to bottom,\
               black 0%,\
               black 35%,\
               transparent 92%\
           ) !important;\
\
       mask-image:\
           linear-gradient(\
               to bottom,\
               black 0%,\
               black 35%,\
               transparent 92%\
           ) !important;\
   \}\
\
   .full-start__background img \{\
       filter:\
           brightness(.70) !important;\
   \}\
\
   .full-start__poster \{\
       border-radius:\
           16px !important;\
\
       overflow:\
           hidden !important;\
\
       box-shadow:\
           0 20px 60px rgba(0,0,0,.70) !important;\
   \}\
\
   .full-start__title \{\
       color:\
           #fff !important;\
\
       font-weight:\
           800 !important;\
\
       letter-spacing:\
           -.035em !important;\
\
       text-shadow:\
           0 2px 20px rgba(0,0,0,.55) !important;\
   \}\
\
   .full-start__description \{\
       color:\
           #d1d1d6 !important;\
\
       line-height:\
           1.5 !important;\
   \}\
\
   .full-start__details,\
   .full-start__info,\
   .full-start__pg \{\
       color:\
           #b8b8bd !important;\
   \}\
\
\
   /* =========================================================\
      MAIN ACTION BUTTONS\
      ========================================================= */\
\
   .full-start__buttons .selector,\
   .full-start__buttons .simple-button,\
   .full-start__button,\
   .button,\
   .simple-button \{\
       border:\
           0 !important;\
\
       border-radius:\
           999px !important;\
\
       font-weight:\
           700 !important;\
\
       transition:\
           transform .12s ease,\
           background .12s ease !important;\
   \}\
\
   .full-start__buttons .selector,\
   .full-start__buttons .simple-button \{\
       background:\
           #fff !important;\
\
       color:\
           #050505 !important;\
\
       padding:\
           .72em 1.3em !important;\
   \}\
\
   .full-start__buttons .selector.focus,\
   .full-start__buttons .selector:hover,\
   .full-start__buttons .simple-button.focus,\
   .full-start__buttons .simple-button:hover \{\
       background:\
           #f2f2f2 !important;\
\
       transform:\
           scale(1.035) !important;\
   \}\
\
\
   /* =========================================================\
      SECONDARY BUTTONS\
      ========================================================= */\
\
   .full-start__buttons .selector + .selector \{\
       background:\
           rgba(255,255,255,.13) !important;\
\
       color:\
           #fff !important;\
   \}\
\
\
   /* =========================================================\
      TABS\
      ========================================================= */\
\
   .tab,\
   .filter,\
   .filter__item,\
   .sort,\
   .sort__item \{\
       border-radius:\
           999px !important;\
   \}\
\
   .filter__item,\
   .sort__item \{\
       color:\
           #a1a1a6 !important;\
\
       background:\
           #161618 !important;\
   \}\
\
   .filter__item.active,\
   .filter__item.focus,\
   .sort__item.active,\
   .sort__item.focus \{\
       color:\
           #fff !important;\
\
       background:\
           #2b2b2e !important;\
   \}\
\
\
   /* =========================================================\
      SEARCH\
      ========================================================= */\
\
   .search \{\
       background:\
           transparent !important;\
   \}\
\
   .search__input,\
   input,\
   textarea,\
   select \{\
       background:\
           #1c1c1e !important;\
\
       color:\
           #fff !important;\
\
       border:\
           1px solid rgba(255,255,255,.06) !important;\
\
       border-radius:\
           12px !important;\
\
       outline:\
           none !important;\
   \}\
\
   .search__input:focus,\
   input:focus,\
   textarea:focus,\
   select:focus \{\
       border-color:\
           rgba(10,132,255,.75) !important;\
\
       box-shadow:\
           0 0 0 3px rgba(10,132,255,.16) !important;\
   \}\
\
\
   /* =========================================================\
      SETTINGS\
      ========================================================= */\
\
   .settings,\
   .settings__body,\
   .settings__content \{\
       background:\
           var(--atv-bg) !important;\
   \}\
\
   .settings__item,\
   .settings-box,\
   .settings-param \{\
       background:\
           #111113 !important;\
\
       border:\
           1px solid rgba(255,255,255,.045) !important;\
\
       border-radius:\
           14px !important;\
   \}\
\
   .settings__item:hover,\
   .settings__item.focus,\
   .settings-param.focus \{\
       background:\
           #202022 !important;\
   \}\
\
   .settings__title,\
   .settings-box__title \{\
       color:\
           #fff !important;\
\
       font-weight:\
           650 !important;\
   \}\
\
   .settings__value,\
   .settings-box__value \{\
       color:\
           #98989f !important;\
   \}\
\
\
   /* =========================================================\
      MODALS / POPUPS\
      ========================================================= */\
\
   .modal,\
   .modal__body,\
   .selectbox,\
   .notice,\
   .dialog \{\
       background:\
           #151517 !important;\
\
       color:\
           #fff !important;\
\
       border:\
           1px solid rgba(255,255,255,.07) !important;\
\
       border-radius:\
           18px !important;\
\
       box-shadow:\
           0 25px 80px rgba(0,0,0,.70) !important;\
   \}\
\
\
   /* =========================================================\
      PLAYER\
      ========================================================= */\
\
   .player,\
   .player__body,\
   .player__video \{\
       background:\
           #000 !important;\
   \}\
\
   .player__controls \{\
       background:\
           linear-gradient(\
               transparent,\
               rgba(0,0,0,.90)\
           ) !important;\
   \}\
\
\
   /* =========================================================\
      SCROLLBAR\
      ========================================================= */\
\
   ::-webkit-scrollbar \{\
       width:\
           5px !important;\
\
       height:\
           5px !important;\
   \}\
\
   ::-webkit-scrollbar-track \{\
       background:\
           transparent !important;\
   \}\
\
   ::-webkit-scrollbar-thumb \{\
       background:\
           #3a3a3c !important;\
\
       border-radius:\
           10px !important;\
   \}\
\
\
   /* =========================================================\
      FOCUS\
      ========================================================= */\
\
   .selector.focus,\
   .focus \{\
       outline:\
           none !important;\
   \}\
\
   .selector.focus:after \{\
       border-color:\
           rgba(255,255,255,.20) !important;\
   \}\
\
\
   /* =========================================================\
      REMOVE OLD VISUAL NOISE\
      ========================================================= */\
\
   .card__view:before,\
   .card__view:after \{\
       box-shadow:\
           none !important;\
   \}\
\
   .loader \{\
       background:\
           #050505 !important;\
   \}\
\
\
   /* =========================================================\
      TV SIZE\
      ========================================================= */\
\
   @media (min-width: 1200px) \{\
\
       .items-line__title \{\
           font-size:\
               1.30em !important;\
       \}\
\
       .card__title \{\
           font-size:\
               .92em !important;\
       \}\
   \}\
\
\
   /* =========================================================\
      SMALL SCREENS\
      ========================================================= */\
\
   @media (max-width: 800px) \{\
\
       .items-line__title \{\
           font-size:\
               1.08em !important;\
       \}\
\
       .card__title \{\
           font-size:\
               .82em !important;\
       \}\
   \}\
\
\
   /* =========================================================\
      APPLE-LIKE MOTION\
      ========================================================= */\
\
   .card,\
   .menu__item,\
   .selector,\
   .simple-button \{\
       -webkit-tap-highlight-color:\
           transparent !important;\
   \}\
\
\
   /* =========================================================\
      DARK APPLE TV BACKGROUND\
      ========================================================= */\
\
   .activity__body,\
   .activity__content,\
   .catalog,\
   .catalog__content \{\
       background:\
           #050505 !important;\
   \}\
   `;\
\
\
   /* =========================================================\
      INSERT CSS\
      ========================================================= */\
\
   function injectStyle() \{\
\
       if (document.getElementById(STYLE_ID)) \{\
           return;\
       \}\
\
       var style = document.createElement('style');\
\
       {\field{\*\fldinst{HYPERLINK "http://style.id/"}}{\fldrslt \cf3 \ul \ulc3 style.id}} = STYLE_ID;\
\
       style.type = 'text/css';\
\
       style.textContent = css;\
\
       document.head.appendChild(style);\
\
       document.documentElement.classList.add(\
           'lampa-apple-tv'\
       );\
   \}\
\
\
   /* =========================================================\
      APPLY\
      ========================================================= */\
\
   function applySkin() \{\
\
       injectStyle();\
\
       if (document.body) \{\
           document.body.classList.add(\
               'lampa-apple-tv'\
           );\
       \}\
\
       var full =\
           document.querySelector('.full-start');\
\
       if (full) \{\
           full.classList.add(\
               'atv-full-page'\
           );\
       \}\
\
       var cards =\
           document.querySelectorAll('.card');\
\
       for (var i = 0; i < cards.length; i++) \{\
\
           cards[i].classList.add(\
               'atv-card'\
           );\
       \}\
   \}\
\
\
   /* =========================================================\
      INITIAL\
      ========================================================= */\
\
   injectStyle();\
\
   setTimeout(\
       applySkin,\
       100\
   );\
\
   setTimeout(\
       applySkin,\
       700\
   );\
\
   setTimeout(\
       applySkin,\
       1500\
   );\
\
\
   /* =========================================================\
      LAMPA SPA NAVIGATION\
      ========================================================= */\
\
   if (\
       window.Lampa &&\
       Lampa.Listener\
   ) \{\
\
       try \{\
\
           Lampa.Listener.follow(\
               'activity',\
               function () \{\
\
                   setTimeout(\
                       applySkin,\
                       80\
                   );\
\
                   setTimeout(\
                       applySkin,\
                       400\
                   );\
\
               \}\
           );\
\
       \} catch (e) \{\}\
\
\
       try \{\
\
           Lampa.Listener.follow(\
               'full',\
               function () \{\
\
                   setTimeout(\
                       applySkin,\
                       80\
                   );\
\
               \}\
           );\
\
       \} catch (e) \{\}\
   \}\
\
\
   /* =========================================================\
      DOM CHANGES\
      ========================================================= */\
\
   if (window.MutationObserver) \{\
\
       var observer =\
           new MutationObserver(\
               function () \{\
\
                   applySkin();\
\
               \}\
           );\
\
       observer.observe(\
           document.documentElement,\
           \{\
               childList: true,\
               subtree: true\
           \}\
       );\
   \}\
\
\
   /* =========================================================\
      TV FOCUS\
      ========================================================= */\
\
   document.addEventListener(\
       'focusin',\
       function () \{\
\
           applySkin();\
\
       \},\
       true\
   );\
\
\})();\
}