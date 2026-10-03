/**
* Фонарь Studios2 — плагин главной страницы (Likhtar Team).
* Кастомная главная, стриминги, студии, подписки на студии, Кинообзор.
*/
(function () {
   'use strict';

   window.LIKHTAR_STUDIOS_VER = '3.0';
   window.LIKHTAR_STUDIOS_LOADED = false;
   window.LIKHTAR_STUDIOS_ERROR = null;

   if (typeof Lampa === 'undefined') {
       window.LIKHTAR_STUDIOS_ERROR = 'Lampa not found (script loaded before app?)';
       return;
   }


   // =================================================================
   // CONFIGURATION & CONSTANTS
   // =================================================================

   var currentScript = document.currentScript || [].slice.call(document.getElementsByTagName('script')).filter(function (s) {
       return (s.src || '').indexOf('studios') !== -1 || (s.src || '').indexOf('fix.js') !== -1 || (s.src || '').indexOf('likhtar') !== -1;
   })[0];

   var LIKHTAR_BASE_URL = (currentScript && currentScript.src) ? currentScript.src.replace(/[#?].*$/, '').replace(/[^/]+$/, '') : 'http://127.0.0.1:3000/';

   if (LIKHTAR_BASE_URL.indexOf('raw.githubusercontent.com') !== -1) {
       LIKHTAR_BASE_URL = LIKHTAR_BASE_URL
           .replace('raw.githubusercontent.com', 'cdn.jsdelivr.net/gh')
           .replace(/\/([^@/]+\/[^@/]+)\/main\//, '/$1@main/')
           .replace(/\/([^@/]+\/[^@/]+)\/master\//, '/$1@master/');
   } else if (LIKHTAR_BASE_URL.indexOf('.github.io') !== -1) {
       // e.g. https://syvyj.github.io/studio_2/ → https://cdn.jsdelivr.net/gh/syvyj/studio_2@main/
       var gitioMatch = LIKHTAR_BASE_URL.match(/https?:\/\/([^.]+)\.github\.io\/([^/]+)\//i);
       if (gitioMatch) {
           LIKHTAR_BASE_URL = 'https://cdn.jsdelivr.net/gh/' + gitioMatch[1] + '/' + gitioMatch[2] + '@main/';
       }
   }



   var UKRAINIAN_FEED_CATEGORIES = [
       { title: 'Новые украинские фильмы', url: 'discover/movie', params: { with_origin_country: 'UA', sort_by: 'primary_release_date.desc', 'vote_count.gte': '5' } },
       { title: 'Новые украинские сериалы', url: 'discover/tv', params: { with_origin_country: 'UA', sort_by: 'first_air_date.desc', 'vote_count.gte': '5' } },
       { title: 'В тренде в Украине', url: 'discover/movie', params: { with_origin_country: 'UA', sort_by: 'popularity.desc' } },
       { title: 'Украинские сериалы в тренде', url: 'discover/tv', params: { with_origin_country: 'UA', sort_by: 'popularity.desc' } },
       { title: 'Лучшие украинские фильмы', url: 'discover/movie', params: { with_origin_country: 'UA', sort_by: 'vote_average.desc', 'vote_count.gte': '50' } },
       { type: 'from_global', globalKey: 'LIKHTAR_UA_MOVIES', title: 'Украинские фильмы (полная подборка)' },
       { type: 'from_global', globalKey: 'LIKHTAR_UA_SERIES', title: 'Украинские сериалы (полная подборка)' }
   ];

   var SERVICE_CONFIGS = {
       'netflix': {
           title: 'Netflix',
           icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 2L16.5 22" stroke="#E50914" stroke-width="4"/><path d="M7.5 2L7.5 22" stroke="#E50914" stroke-width="4"/><path d="M7.5 2L16.5 22" stroke="#E50914" stroke-width="4"/></svg>',
           categories: [
               { "title": "Новые фильмы", "url": "discover/movie", "params": { "with_watch_providers": "8", "watch_region": "UA", "sort_by": "primary_release_date.desc", "primary_release_date.lte": "{current_date}", "vote_count.gte": "5" } },
               { "title": "Новые сериалы", "url": "discover/tv", "params": { "with_networks": "213", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "5" } },
               { "title": "В тренде на Netflix", "url": "discover/tv", "params": { "with_networks": "213", "sort_by": "popularity.desc" } },
               { "title": "Экшен и Блокбастеры", "url": "discover/movie", "params": { "with_companies": "213", "with_genres": "28,12", "sort_by": "popularity.desc" } },
               { "title": "Фантастические миры", "url": "discover/tv", "params": { "with_networks": "213", "with_genres": "10765", "sort_by": "vote_average.desc", "vote_count.gte": "200" } },
               { "title": "Реалити-шоу: Хиты", "url": "discover/tv", "params": { "with_networks": "213", "with_genres": "10764", "sort_by": "popularity.desc" } },
               { "title": "Криминальные драмы", "url": "discover/tv", "params": { "with_networks": "213", "with_genres": "80", "sort_by": "popularity.desc" } },
               { "title": "K-Dramas (Корейские сериалы)", "url": "discover/tv", "params": { "with_networks": "213", "with_original_language": "ko", "sort_by": "popularity.desc" } },
               { "title": "Аниме коллекция", "url": "discover/tv", "params": { "with_networks": "213", "with_genres": "16", "with_keywords": "210024", "sort_by": "popularity.desc" } },
               { "title": "Документальное кино", "url": "discover/movie", "params": { "with_companies": "213", "with_genres": "99", "sort_by": "release_date.desc" } },
               { "title": "Выбор критиков (Высокий рейтинг)", "url": "discover/movie", "params": { "with_companies": "213", "vote_average.gte": "7.5", "vote_count.gte": "300", "sort_by": "vote_average.desc" } }
           ]
       },
       'apple': {
           title: 'Apple TV+',
           icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>',
           categories: [
               { "title": "Новые фильмы", "url": "discover/movie", "params": { "with_watch_providers": "350", "watch_region": "UA", "sort_by": "primary_release_date.desc", "primary_release_date.lte": "{current_date}", "vote_count.gte": "5" } },
               { "title": "Новые сериалы", "url": "discover/tv", "params": { "with_watch_providers": "350", "watch_region": "UA", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "5" } },
               { "title": "Хиты Apple TV+", "url": "discover/tv", "params": { "with_watch_providers": "350", "watch_region": "UA", "sort_by": "popularity.desc" } },
               { "title": "Apple Original Films", "url": "discover/movie", "params": { "with_watch_providers": "350", "watch_region": "UA", "sort_by": "release_date.desc", "vote_count.gte": "10" } },
               { "title": "Фантастика Apple", "url": "discover/tv", "params": { "with_watch_providers": "350", "watch_region": "UA", "with_genres": "10765", "sort_by": "vote_average.desc", "vote_count.gte": "200" } },
               { "title": "Комедии и Feel-good", "url": "discover/tv", "params": { "with_watch_providers": "350", "watch_region": "UA", "with_genres": "35", "sort_by": "popularity.desc" } },
               { "title": "Триллеры и Детективы", "url": "discover/tv", "params": { "with_watch_providers": "350", "watch_region": "UA", "with_genres": "9648,80", "sort_by": "popularity.desc" } }
           ]
       },
       'hbo': {
           title: 'HBO / Max',
           icon: '<svg width="24px" height="24px" viewBox="0 0 24 24" fill="currentColor"><path d="M7.042 16.896H4.414v-3.754H2.708v3.754H.01L0 7.22h2.708v3.6h1.706v-3.6h2.628zm12.043.046C21.795 16.94 24 14.689 24 11.978a4.89 4.89 0 0 0-4.915-4.92c-2.707-.002-4.09 1.991-4.432 2.795.003-1.207-1.187-2.632-2.58-2.634H7.59v9.674l4.181.001c1.686 0 2.886-1.46 2.888-2.713.385.788 1.72 2.762 4.427 2.76zm-7.665-3.936c.387 0 .692.382.692.817 0 .435-.305.817-.692.817h-1.33v-1.634zm.005-3.633c.387 0 .692.382.692.817 0 .436-.305.818-.692.818h-1.33V9.373zm1.77 2.607c.305-.039.813-.387.992-.61-.063.276-.068 1.074.006 1.35-.204-.314-.688-.701-.998-.74zm3.43 0a2.462 2.462 0 1 1 4.924 0 2.462 2.462 0 0 1-4.925 0zm2.462 1.936a1.936 1.936 0 1 0 0-3.872 1.936 1.936 0 0 0 0 3.872z"/></svg>',
           categories: [
               { "title": "Новые фильмы WB/HBO", "url": "discover/movie", "params": { "with_companies": "174|49", "sort_by": "primary_release_date.desc", "primary_release_date.lte": "{current_date}", "vote_count.gte": "10" } },
               { "title": "Новые сериалы HBO/Max", "url": "discover/tv", "params": { "with_networks": "49|3186", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "5" } },
               { "title": "HBO: Главные хиты", "url": "discover/tv", "params": { "with_networks": "49", "sort_by": "popularity.desc" } },
               { "title": "Max Originals", "url": "discover/tv", "params": { "with_networks": "3186", "sort_by": "popularity.desc" } },
               { "title": "Блокбастеры Warner Bros.", "url": "discover/movie", "params": { "with_companies": "174", "sort_by": "revenue.desc", "vote_count.gte": "1000" } },
               { "title": "Золотая коллекция HBO (Самый высокий рейтинг)", "url": "discover/tv", "params": { "with_networks": "49", "sort_by": "vote_average.desc", "vote_count.gte": "500", "vote_average.gte": "8.0" } },
               { "title": "Эпические миры (Фэнтези)", "url": "discover/tv", "params": { "with_networks": "49|3186", "with_genres": "10765", "sort_by": "popularity.desc" } },
               { "title": "Премиальные драмы", "url": "discover/tv", "params": { "with_networks": "49", "with_genres": "18", "without_genres": "10765", "sort_by": "popularity.desc" } },
               { "title": "Взрослая анимация (Adult Swim)", "url": "discover/tv", "params": { "with_networks": "3186|80", "with_genres": "16", "sort_by": "popularity.desc" } },
               { "title": "Вселенная DC (Фильмы)", "url": "discover/movie", "params": { "with_companies": "174", "with_keywords": "9715", "sort_by": "release_date.desc" } }
           ]
       },
       'amazon': {
           title: 'Prime Video',
           icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 800.3 246.3" xml:space="preserve"><path style="fill:#D1EFFA;" d="M396.5,246.3v-0.4c0.4-0.5,1.1-0.8,1.7-0.7c2.9-0.1,5.7-0.1,8.6,0c0.6,0,1.3,0.2,1.7,0.7v0.4H396.5z"/><path style="fill:#00A8E1;" d="M408.5,245.9c-4-0.1-8-0.1-12,0c-5.5-0.3-11-0.5-16.5-0.9c-14.6-1.1-29.1-3.3-43.3-6.6c-49.1-11.4-92.2-34.3-129.8-67.6c-3.5-3.1-6.8-6.3-10.2-9.5c-0.8-0.7-1.5-1.7-1.9-2.7c-0.6-1.4-0.3-2.9,0.7-4c1-1.1,2.6-1.5,4-0.9c0.9,0.4,1.8,0.8,2.6,1.3c35.9,22.2,75.1,38.4,116.2,48c13.8,3.2,27.7,5.7,41.7,7.5c20.1,2.5,40.4,3.4,60.6,2.7c10.9-0.3,21.7-1.3,32.5-2.7c25.2-3.2,50.1-8.9,74.2-16.9c12.7-4.2,25.1-9,37.2-14.6c1.8-1,4-1.3,6-0.8c3.3,0.8,5.3,4.2,4.5,7.5c-0.1,0.4-0.3,0.9-0.5,1.3c-0.8,1.5-1.9,2.8-3.3,3.8c-11.5,9-23.9,16.9-37,23.5c-24.7,12.5-51.1,21.4-78.3,26.5C440.2,243.6,424.4,245.3,408.5,245.9z"/><path style="fill:#00A8E1;" d="M76.7,66.6c-0.4-5.2-1.8-10.3-3.9-15c-4.1-8.6-10.4-14.9-20-17.1c-11-2.4-20.9,0-29.9,6.7c-0.6,0.6-1.3,1.1-2.1,1.5c-0.2-0.1-0.4-0.2-0.4-0.3c-0.3-1-0.5-2-0.8-3c-0.8-2.5-1.8-3.4-4.5-3.4c-3,0-6.1,0.1-9.1,0c-2.3-0.1-4.4,0.2-6,2C0,73,0,108.1,0.1,143c1.3,2.1,3.3,2.5,5.6,2.4c3.6-0.1,7.2,0,10.8,0c6.3,0,6.3,0,6.3-6.2v-28.5c0-0.7-0.3-1.5,0.4-2.1c5,3.9,11.1,6.3,17.4,6.9c8.8,0.9,16.8-1.3,23.5-7.3c4.9-4.5,8.5-10.3,10.4-16.7C77.2,83.3,77.4,75,76.7,66.6z M52.8,87.3c-0.7,3.1-2.3,5.9-4.6,8c-2.6,2.2-5.8,3.5-9.2,3.5c-5.1,0.3-10.1-0.8-14.6-3.2c-1.1-0.5-1.8-1.6-1.7-2.8V74.7c0-6,0.1-12,0-18c-0.1-1.4,0.7-2.6,2-3.1c5.5-2.6,11.2-3.8,17.2-2.6c4.2,0.6,7.8,3.3,9.5,7.2c1.5,3.2,2.4,6.7,2.6,10.2C54.6,74.8,54.6,81.2,52.8,87.3z"/><path style="fill:#232F3E;" d="M467.7,93c0.6-2,1.2-3.9,1.8-5.9c4.6-15.5,9.2-30.9,13.8-46.4l0.6-1.8c0.5-1.8,2.2-2.9,4-2.9h15.2c3.8,0,4.6,1.1,3.3,4.7l-6,15.9c-6.7,17.4-13.4,34.9-20.1,52.3c-0.2,0.6-0.5,1.2-0.7,1.8c-0.7,2.1-2.8,3.5-5,3.3c-4.4-0.1-8.8-0.1-13.2,0c-3.1,0.1-4.9-1.3-6-4.1c-2.5-6.6-5.1-13.3-7.6-19.9c-6-15.7-12.1-31.4-18.1-47.2c-0.6-1.2-1-2.6-1.3-3.9c-0.3-2,0.4-3,2.4-3c5.7-0.1,11.4,0,17,0c2.4,0,3.5,1.6,4.1,3.7c1.1,3.8,2.2,7.7,3.4,11.5c4.1,13.9,8.1,27.9,12.2,41.8C467.4,93,467.5,93,467.7,93z"/><path style="fill:#232F3E;" d="M538.5,75v36c-0.2,2-1.1,2.9-3.1,3c-5.4,0.1-10.7,0.1-16.1,0c-2,0-2.9-1-3.1-2.9c-0.1-0.6-0.1-1.3-0.1-1.9V40c0.1-3.1,0.9-4,4-4h14.4c3.1,0,4,0.9,4,4L538.5,75L538.5,75z"/><path style="fill:#232F3E;" d="M527.4,0.1c2-0.2,4,0.2,5.9,1c3.9,1.5,6.6,5.1,6.8,9.3c0.8,9.1-5.3,13.7-13.4,13.5c-1.1,0-2.2-0.2-3.3-0.4c-6.2-1.5-9.4-6.3-8.8-13.2c0.5-5.5,4.8-9.6,10.7-10.1C526,0.1,526.7,0,527.4,0.1z"/></svg>',
           categories: [
               { "title": "В тренде на Prime Video", "url": "discover/tv", "params": { "with_networks": "1024", "sort_by": "popularity.desc" } },
               { "title": "Новые фильмы", "url": "discover/movie", "params": { "with_watch_providers": "119", "watch_region": "UA", "sort_by": "primary_release_date.desc", "primary_release_date.lte": "{current_date}", "vote_count.gte": "5" } },
               { "title": "Новые сериалы", "url": "discover/tv", "params": { "with_networks": "1024", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "5" } },
               { "title": "Жесткий экшен и Антигерои", "url": "discover/tv", "params": { "with_networks": "1024", "with_genres": "10765,10759", "sort_by": "popularity.desc" } },
               { "title": "Блокбастеры MGM и Amazon", "url": "discover/movie", "params": { "with_companies": "1024|21", "sort_by": "revenue.desc" } },
               { "title": "Комедии", "url": "discover/tv", "params": { "with_networks": "1024", "with_genres": "35", "sort_by": "vote_average.desc" } },
               { "title": "Самый высокий рейтинг IMDb", "url": "discover/tv", "params": { "with_networks": "1024", "vote_average.gte": "8.0", "vote_count.gte": "500", "sort_by": "vote_average.desc" } }
           ]
       },
       'disney': {
           title: 'Disney+',
           icon: '<svg viewBox="0 0 1041 565" xmlns="http://www.w3.org/2000/svg"><path d="M735.8 365.7C721.4 369 683.5 370.9 683.5 370.9L678.7 385.9C678.7 385.9 697.6 384.3 711.4 385.7 711.4 385.7 715.9 385.2 716.4 390.8 716.6 396 716 401.6 716 401.6 716 401.6 715.7 405 710.9 405.8 705.7 406.7 670.1 408 670.1 408L664.3 427.5C664.3 427.5 662.2 432 667 430.7 671.5 429.5 708.8 422.5 713.7 423.5 718.9 424.8 724.7 431.7 723 438.1 721 445.9 683.8 469.7 661.1 468 661.1 468 649.2 468.8 639.1 452.7 629.7 437.4 642.7 408.3 642.7 408.3 642.7 408.3 636.8 394.7 641.1 390.2 641.1 390.2 643.7 387.9 651.1 387.3L660.2 368.4C660.2 368.4 649.8 369.1 643.6 361.5 637.8 354.2 637.4 350.9 641.8 348.9 646.5 346.6 689.8 338.7 719.6 339.7 719.6 339.7 730 338.7 738.9 356.7 738.8 356.7 743.2 364 735.8 365.7ZM623.7 438.3C619.9 447.3 609.8 456.9 597.3 450.9 584.9 444.9 565.2 404.6 565.2 404.6 565.2 404.6 557.7 389.6 556.3 389.9 556.3 389.9 554.7 387 553.7 403.4 552.7 419.8 553.9 451.7 547.4 456.7 541.2 461.7 533.7 459.7 529.8 453.8 526.3 448 524.8 434.2 526.7 410 529 385.8 534.6 360 541.8 351.9 549 343.9 554.8 349.7 557 351.8 557 351.8 566.6 360.5 582.5 386.1L585.3 390.8C585.3 390.8 599.7 415 601.2 414.9 601.2 414.9 602.4 416 603.4 415.2 604.9 414.8 604.3 407 604.3 407 604.3 407 601.3 380.7 588.2 336.1 588.2 336.1 586.2 330.5 587.6 325.3 588.9 320 594.2 322.5 594.2 322.5 594.2 322.5 614.6 332.7 624.4 365.9 634.1 399.4 627.5 429.3 623.7 438.3ZM387.5 460.9C381.7 465.2 369.4 463.3 365.9 458.5 362.4 454.2 361.2 437.1 361.9 410.3 362.6 383.2 363.2 349.6 369 344.3 375.2 338.9 379 343.6 381.4 347.3 384 350.9 387.1 354.9 387.8 363.4 388.4 371.9 390.4 416.5 390.4 416.5 390.4 416.5 393 456.7 387.5 460.9ZM842.9 418.5C833.6 434.7 807.5 468.5 772.7 460.6 761.2 488.5 751.6 516.6 746.1 558.8 746.1 558.8 744.9 567 738.1 564.1 731.4 561.7 720.2 550.5 718 535 715.6 514.6 724.7 480.1 743.2 440.6 737.8 431.8 734.1 419.2 737.3 401.3 737.3 401.3 742 368.1 775.3 338.1 775.3 338.1 779.3 334.6 781.6 335.7 784.2 336.8 783 347.6 780.9 352.8 778.8 358 763.9 383.8 763.9 383.8 763.9 383.8 754.6 401.2 757.2 414.9 774.7 388 814.5 333.7 839.2 350.8 847.5 356.7 851.3 369.6 851.3 383.5 851.2 395.8 848.3 408.8 842.9 418.5ZM835.7 375.9C835.7 375.9 834.3 365.2 823.9 377 814.9 386.9 798.7 405.6 785.6 430.9 799.3 429.4 812.5 421.9 816.5 418.1 823 412.3 838.1 396.7 835.7 375.9ZM350.2 389.5C348.3 413.7 339 454.4 273.1 474.5 229.6 487.6 188.5 481.3 166.1 475.6 165.6 484.5 164.6 488.3 163.2 489.8 161.3 491.7 147.1 499.9 139.3 488.3 135.8 482.8 134 472.8 133 463.9 82.6 440.7 59.4 407.3 58.5 405.8 57.4 404.7 45.9 392.7 57.4 378 68.2 364.7 103.5 351.4 135.3 346 136.4 318.8 139.6 298.3 143.4 288.9 148 278 153.8 287.8 158.8 295.2 163 300.7 165.5 324.4 165.7 343.3 186.5 342.3 198.8 343.8 222 348 252.2 353.5 272.4 368.9 270.6 386.4 269.3 403.6 253.5 410.7 247.5 411.2 241.2 411.7 231.4 407.2 231.4 407.2 224.7 404 230.9 401.2 239 397.7 247.8 393.4 245.8 389 245.8 389 242.5 379.4 203.3 372.7 164.3 372.7 164.1 394.2 165.2 429.9 165.7 450.7 193 455.9 213.4 454.9 213.4 454.9 213.4 454.9 313 452.1 316 388.5 319.1 324.8 216.7 263.7 141 244.3 65.4 224.5 22.6 238.3 18.9 240.2 14.9 242.2 18.6 242.8 18.6 242.8 18.6 242.8 22.7 243.4 29.8 245.8 37.3 248.2 31.5 252.1 31.5 252.1 18.6 256.2 4.1 253.6 1.3 247.7-1.5 241.8 3.2 236.5 8.6 228.9 14 220.9 19.9 221.2 19.9 221.2 113.4 188.8 227.3 247.4 227.3 247.4 334 301.5 352.2 364.9 350.2 389.5ZM68 386.2C57.4 391.4 64.7 398.9 64.7 398.9 84.6 420.3 109.1 433.7 132.4 442 135.1 405.1 134.7 392.1 135 373.5 98.6 376 77.6 381.8 68 386.2Z" fill="#01147c"/><path d="M1040.9 378.6L1040.9 391.8C1040.9 394.7 1038.6 397 1035.7 397L972.8 397C972.8 400.3 972.9 403.2 972.9 405.9 972.9 425.4 972.1 441.3 970.2 459.2 969.9 461.9 967.7 463.9 965.1 463.9L951.5 463.9C950.1 463.9 948.8 463.3 947.9 462.3 947 461.3 946.5 459.9 946.7 458.5 948.6 440.7 949.5 425 949.5 405.9 949.5 403.1 949.5 400.2 949.4 397L887.2 397C884.3 397 882 394.7 882 391.8L882 378.6C882 375.7 884.3 373.4 887.2 373.4L948.5 373.4C947.2 351.9 944.6 331.2 940.4 310.2 940.2 308.9 940.5 307.6 941.3 306.6 942.1 305.6 943.3 305 944.6 305L959.3 305C961.6 305 963.5 306.6 964 308.9 968.1 330.6 970.7 351.7 972 373.4L1035.7 373.4C1038.5 373.4 1040.9 375.8 1040.9 378.6Z" fill="#01147c"/></svg>',
           categories: [
               { "title": "Новые фильмы на Disney+", "url": "discover/movie", "params": { "with_watch_providers": "337", "watch_region": "US", "sort_by": "primary_release_date.desc", "primary_release_date.lte": "{current_date}", "vote_count.gte": "5" } },
               { "title": "Новые сериалы на Disney+", "url": "discover/tv", "params": { "with_networks": "2739", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "5" } },
               { "title": "Marvel: Киновселенная (MCU)", "url": "discover/movie", "params": { "with_companies": "420", "sort_by": "release_date.desc", "vote_count.gte": "200" } },
               { "title": "Marvel: Сериалы", "url": "discover/tv", "params": { "with_companies": "420", "with_networks": "2739", "sort_by": "first_air_date.desc" } },
               { "title": "Звездные Войны: Фильмы", "url": "discover/movie", "params": { "with_companies": "1", "sort_by": "release_date.asc" } },
               { "title": "Звездные Войны: Мандалорец и другие", "url": "discover/tv", "params": { "with_companies": "1", "with_keywords": "1930", "sort_by": "popularity.desc" } },
               { "title": "Классика Disney", "url": "discover/movie", "params": { "with_companies": "6125", "sort_by": "popularity.desc" } },
               { "title": "Pixar: Бесконечность и далее", "url": "discover/movie", "params": { "with_companies": "3", "sort_by": "popularity.desc" } },
               { "title": "FX: Взрослые хиты (The Bear, Shogun)", "url": "discover/tv", "params": { "with_networks": "88", "sort_by": "popularity.desc" } },
               { "title": "Симпсоны и анимация FOX", "url": "discover/tv", "params": { "with_networks": "19", "with_genres": "16", "sort_by": "popularity.desc" } }
           ]
       },
       'paramount': {
           title: 'Paramount+',
           icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-161.599 -100.544 1000 622.214"><path fill="currentColor" d="M337.935-100.544c-135.92,0-246.104,110.13-246.104,245.983c-0.072,52.591,16.8,103.807,48.115,146.058c10.324-4.456,16.061-11.117,20.159-16.218l45.823-58.576c0.965-1.235,2.225-2.206,3.665-2.825l6.898-2.967l75.345-95.524l10.925-8.549l22.45-31.233c0.58-0.808,1.287-1.519,2.094-2.104l9.795-7.117c2.42-1.758,5.688-1.786,8.136-0.068l11.886,8.339c6.306,4.423,11.417,10.338,14.88,17.217l47.61,83.586c0.777,1.595,2.098,2.86,3.724,3.568c9.337,4.646,15.041,5.467,27.261,18.735c5.702,6.186,30.688,34.117,65.705,77.526c5.089,6.964,11.902,12.484,19.769,16.02c31.22-42.219,48.034-93.359,47.96-145.868C584.031,9.585,473.852-100.544,337.935-100.544z M787.559,394.747l20.212-46.649h-23.92l-20.213,46.649h-50.841l-8.481,19.563h50.856l-20.212,46.649h23.92l20.214-46.649h50.84l8.467-19.563H787.559z"/></svg>',
           categories: [
               { "title": "Блокбастеры Paramount Pictures", "url": "discover/movie", "params": { "with_companies": "4", "sort_by": "revenue.desc" } },
               { "title": "Paramount+ Originals", "url": "discover/tv", "params": { "with_networks": "4330", "sort_by": "popularity.desc" } },
               { "title": "Вселенная Йеллоустоун", "url": "discover/tv", "params": { "with_networks": "318|4330", "with_genres": "37,18", "sort_by": "popularity.desc" } },
               { "title": "Star Trek: Последний рубеж", "url": "discover/tv", "params": { "with_networks": "4330", "with_keywords": "159223", "sort_by": "first_air_date.desc" } },
               { "title": "Nickelodeon: Для детей", "url": "discover/tv", "params": { "with_networks": "13", "sort_by": "popularity.desc" } }
           ]
       },
       'sky_showtime': {
           title: 'Sky Showtime',
           icon: '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><text y="18" font-size="14" font-family="Arial,sans-serif" font-weight="bold" fill="currentColor">Sky</text></svg>',
           categories: [
               { "title": "Новые фильмы Sky Showtime", "url": "discover/movie", "params": { "with_watch_providers": "1773", "watch_region": "PL", "sort_by": "primary_release_date.desc", "primary_release_date.lte": "{current_date}", "vote_count.gte": "5" } },
               { "title": "Сериалы Sky Showtime", "url": "discover/tv", "params": { "with_watch_providers": "1773", "watch_region": "PL", "sort_by": "popularity.desc" } },
               { "title": "Боевики и Триллеры", "url": "discover/movie", "params": { "with_watch_providers": "1773", "watch_region": "PL", "with_genres": "28,53", "sort_by": "popularity.desc" } },
               { "title": "Комедии для всех", "url": "discover/movie", "params": { "with_watch_providers": "1773", "watch_region": "PL", "with_genres": "35", "sort_by": "popularity.desc" } }
           ]
       },
       'hulu': {
           title: 'Hulu',
           icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 33"><path fill="currentColor" d="M29.6,2L18.7,2L18.7,10.1C17.3,9.5 15.7,9.2 13.9,9.2L4.7,9.2L4.7,2L0,2L0,31L4.7,31L4.7,19.8C4.7,18.7 5.6,17.8 6.7,17.8L13.3,17.8C14.4,17.8 15.3,18.7 15.3,19.8L15.3,31L29.6,31L29.6,2ZM68.3,9.2L59.1,9.2C57.3,9.2 55.7,9.5 54.3,10.1L54.3,2L43.4,2L43.4,31L54.3,31L54.3,19.8C54.3,18.7 55.2,17.8 56.3,17.8L62.9,17.8C64,17.8 64.9,18.7 64.9,19.8L64.9,31L79.2,31L79.2,9.2L68.3,9.2ZM41.1,9.2L30.2,9.2L30.2,31L41.1,31L41.1,9.2ZM95.3,9.2L84.4,9.2C82.6,9.2 81,9.5 79.6,10.1L79.6,2L79.6,9.2L79.6,31L89.2,31L89.2,19.8C89.2,18.7 90.1,17.8 91.2,17.8L95.3,17.8C96.4,17.8 97.3,18.7 97.3,19.8L97.3,31L100,31L100,9.2L95.3,9.2Z"/></svg>',
           categories: [
               { "title": "Hulu Originals: В тренде", "url": "discover/tv", "params": { "with_networks": "453", "sort_by": "popularity.desc" } },
               { "title": "Драмы и Триллеры Hulu", "url": "discover/tv", "params": { "with_networks": "453", "with_genres": "18,9648", "sort_by": "vote_average.desc" } },
               { "title": "Комедии и Анимация для взрослых", "url": "discover/tv", "params": { "with_networks": "453", "with_genres": "35,16", "sort_by": "popularity.desc" } },
               { "title": "Мини-сериалы (Limited Series)", "url": "discover/tv", "params": { "with_networks": "453", "with_keywords": "158718", "sort_by": "first_air_date.desc" } }
           ]
       },
       'syfy': {
           title: 'Syfy',
           icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-326.5 140.209 1000 245.582"><g fill="currentColor"><path d="M155.556,140.209H57.469c-2.189,2.19-3.416,3.418-5.604,5.605v116.616H27.187V145.815l-5.604-5.605h-96.964c-2.189,2.19-3.415,3.418-5.604,5.605v117.738l66.425,67.021v49.611c2.189,2.188,3.415,3.412,5.604,5.604H88.01c2.189-2.191,3.415-3.416,5.604-5.604v-50.188l67.546-67.567V145.815C158.972,143.627,157.745,142.4,155.556,140.209"/><path d="M667.896,140.212h-98.088c-2.189,2.189-3.415,3.419-5.604,5.607v116.616h-24.678V145.819c-2.189-2.188-3.414-3.417-5.604-5.607h-96.964c-2.189,2.189-3.416,3.419-5.605,5.607v117.734l66.426,67.021v49.611c2.189,2.189,3.414,3.416,5.604,5.605h96.967c2.189-2.189,3.416-3.416,5.604-5.605v-50.184l67.547-67.567V145.819C671.311,143.631,670.084,142.401,667.896,140.212"/><path d="M-111.27,140.209h-166.187l-49.044,49.058v67.573c2.19,2.19,3.417,3.416,5.604,5.59h104.813v-24.106h104.813c2.19-2.19,3.415-3.418,5.604-5.609v-86.9C-107.854,143.627-109.079,142.4-111.27,140.209"/><path d="M-320.895,286.539c-2.189,2.189-3.417,3.418-5.604,5.607v88.037c2.188,2.188,3.415,3.416,5.604,5.605h166.187l49.042-49.057v-68.693c-2.188-2.191-3.415-3.42-5.604-5.607h-104.813v24.107H-320.895z"/><path d="M401.07,140.212H234.883l-49.043,49.059v190.915c2.189,2.189,3.417,3.416,5.604,5.605h96.967c2.188-2.189,3.415-3.416,5.604-5.605v-30.553H401.07c2.189-2.193,3.414-3.42,5.604-5.609v-75.982c-2.189-2.191-3.414-3.416-5.604-5.606H294.016v-24.109H401.07c2.189-2.189,3.414-3.417,5.604-5.606v-86.9C404.484,143.631,403.26,142.401,401.07,140.212"/></g></svg>',
           categories: [
               { "title": "Хиты телеканала Syfy", "url": "discover/tv", "params": { "with_networks": "77", "sort_by": "popularity.desc" } },
               { "title": "Космические путешествия и Научная Фантастика", "url": "discover/tv", "params": { "with_networks": "77", "with_genres": "10765", "with_keywords": "3801", "sort_by": "vote_average.desc" } },
               { "title": "Мистика, Ужасы и Фэнтези", "url": "discover/tv", "params": { "with_networks": "77", "with_genres": "9648,10765", "without_keywords": "3801", "sort_by": "popularity.desc" } }
           ]
       },
       'educational_and_reality': {
           title: 'Познавательное',
           icon: '<svg viewBox="0 0 24 24" fill="#FF9800"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>',
           categories: [
               { "title": "Новые выпуски: Discovery, NatGeo, BBC", "url": "discover/tv", "params": { "with_networks": "64|91|43|2696|4|65", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "0" } },
               { "title": "Discovery Channel: Хиты", "url": "discover/tv", "params": { "with_networks": "64", "sort_by": "popularity.desc" } },
               { "title": "National Geographic: Мир вокруг", "url": "discover/tv", "params": { "with_networks": "43", "sort_by": "popularity.desc" } },
               { "title": "Animal Planet: Животные", "url": "discover/tv", "params": { "with_networks": "91", "sort_by": "popularity.desc" } },
               { "title": "BBC Earth: Природа (Высокий рейтинг)", "url": "discover/tv", "params": { "with_networks": "4", "with_genres": "99", "sort_by": "vote_average.desc", "vote_count.gte": "50" } },
               { "title": "History Channel: История и Легенды", "url": "discover/tv", "params": { "with_networks": "65", "sort_by": "popularity.desc" } },
               { "title": "Мир авто: Top Gear и другие", "url": "discover/tv", "params": { "with_keywords": "334", "with_genres": "99", "sort_by": "popularity.desc" } }
           ]
       },
       'ukrainian_feed': { title: 'Украинская лента', icon: '🇺🇦', categories: UKRAINIAN_FEED_CATEGORIES }
   };

   function getTmdbKey() {
       var custom = (Lampa.Storage.get('likhtar_tmdb_apikey') || '').trim();
       return custom || (Lampa.TMDB && Lampa.TMDB.key ? Lampa.TMDB.key() : '');
   }

   function isSettingEnabled(key, defaultVal) {
       var val = Lampa.Storage.get(key, defaultVal);
       return val !== false && val !== 'false' && val !== 0 && val !== '0';
   }

   /** Для строки на главной: HBO/Prime/Paramount через watch_providers (TMDB), чтобы получать и фильмы, и сериалы с актуальным контентом. */
   var SERVICE_WATCH_PROVIDERS_FOR_ROW = { hbo: '384', amazon: '119', paramount: '531' };

   // =================================================================
   // UTILS & COMPONENTS
   // =================================================================

   window.LikhtarHeroLogos = window.LikhtarHeroLogos || {};

   function fetchHeroLogo(movie, jqItem, heightEm) {
       var titleElem = jqItem.find('.hero-title');

       function renderLogo(img_url, invert) {
           var img = new Image();
           img.crossOrigin = 'anonymous';
           img.src = img_url;
           img.onload = function () {
               if (invert) img.style.filter = 'brightness(0) invert(1)';
               img.style.maxHeight = (heightEm / 35 * 6) + 'em';
               img.style.maxWidth = '60%';
               img.style.objectFit = 'contain';
               img.style.objectPosition = 'left bottom';
               img.style.filter = (img.style.filter || '') + ' drop-shadow(3px 3px 6px rgba(0,0,0,0.8))';

               titleElem.empty().append(img);
               titleElem.css({ 'margin-bottom': '0.3em', 'display': 'flex', 'align-items': 'flex-end', 'text-shadow': 'none' });
           };
       }

       if (window.LikhtarHeroLogos[movie.id]) {
           if (window.LikhtarHeroLogos[movie.id].path) {
               renderLogo(window.LikhtarHeroLogos[movie.id].path, window.LikhtarHeroLogos[movie.id].invert);
           }
           return;
       }

       window.LikhtarHeroLogos[movie.id] = { fetching: true };

       var type = movie.name ? 'tv' : 'movie';
       var requestLang = Lampa.Storage.get('logo_lang') || Lampa.Storage.get('language', 'uk');
       var url = Lampa.TMDB.api(type + '/' + movie.id + '/images?api_key=' + getTmdbKey() + '&include_image_language=uk,' + requestLang + ',en,null');

       var network = new Lampa.Reguest();
       network.silent(url, function (data) {
           var final_logo = null;
           if (data.logos && data.logos.length > 0) {
               // Ensure the found logo is actually an image path
               var validLogo = function (l) { return l && l.file_path; };

               var found = data.logos.find(function (l) { return l.iso_639_1 == 'uk' && validLogo(l); }) ||
                   data.logos.find(function (l) { return l.iso_639_1 == requestLang && validLogo(l); }) ||
                   data.logos.find(function (l) { return l.iso_639_1 == 'en' && validLogo(l); }) ||
                   data.logos.find(validLogo);

               if (found) final_logo = found.file_path;
           }
           if (final_logo) {
               if (!isSettingEnabled('likhtar_show_logo_instead_text', true)) return;
               var img_url = Lampa.TMDB.image('t/p/w500' + final_logo.replace('.svg', '.png'));
               var img = new Image();
               img.crossOrigin = 'anonymous';
               img.src = img_url;
               img.onload = function () {
                   var invert = false;
                   try {
                       var canvas = document.createElement('canvas');
                       var ctx = canvas.getContext('2d');
                       canvas.width = img.naturalWidth || img.width;
                       canvas.height = img.naturalHeight || img.height;
                       if (canvas.width > 0 && canvas.height > 0) {
                           ctx.drawImage(img, 0, 0);
                           var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                           var darkPixels = 0, totalPixels = 0;
                           for (var i = 0; i < imgData.length; i += 4) {
                               if (imgData[i + 3] < 10) continue;
                               totalPixels++;
                               if ((imgData[i] * 299 + imgData[i + 1] * 587 + imgData[i + 2] * 114) / 1000 < 120) darkPixels++;
                           }
                           if (totalPixels > 0 && (darkPixels / totalPixels) >= 0.85) {
                               invert = true;
                           }
                       }
                   } catch (e) { }

                   window.LikhtarHeroLogos[movie.id] = { path: img_url, invert: invert };
                   renderLogo(img_url, invert);
               };
               img.onerror = function () {
                   window.LikhtarHeroLogos[movie.id] = { fail: true };
               };
           } else {
               window.LikhtarHeroLogos[movie.id] = { fail: true };
           }
       }, function () {
           window.LikhtarHeroLogos[movie.id] = { fail: true };
       });
   }

   // Добавляем CSS для фокуса героя (поскольку Lampa использует класс .focus вместо псевдоклассов)
   if (!$('style#likhtar-hero-css').length) {
       $('head').append('<style id="likhtar-hero-css">' +
           '.hero-banner { transition: transform 0.2s, box-shadow 0.2s; }' +
           '.hero-banner.focus { transform: scale(1.02); outline: 4px solid #fff; outline-offset: -4px; box-shadow: 0 10px 30px rgba(0,0,0,0.8); z-index: 10; }' +
           '.hero-meta span { text-shadow: 1px 1px 2px rgba(0,0,0,0.8); }' +
           '</style>');
   }

   // Кэш для дополнительных деталей героя-баннера
   window.LikhtarHeroDetails = window.LikhtarHeroDetails || {};

   function fetchHeroDetails(movie, jqItem, metaEm) {
       var metaContainer = jqItem.find('.hero-meta-dynamic');
       if (!metaContainer.length) return;

       function renderDetails(details) {
           var html = '';
           if (details.age) html += '<span style="border: 1px solid rgba(255,255,255,0.4); padding: 0.1em 0.3em; border-radius: 0.2em; font-size: 0.9em;">' + details.age + '</span>';
           if (details.country) html += '<span>' + details.country + '</span>';
           if (details.time) html += '<span>' + details.time + '</span>';
           metaContainer.html(html);
       }

       if (window.LikhtarHeroDetails[movie.id]) {
           renderDetails(window.LikhtarHeroDetails[movie.id]);
           return;
       }

       var type = movie.name ? 'tv' : 'movie';
       var lang = Lampa.Storage.get('language', 'uk');
       var append = type === 'movie' ? 'release_dates' : 'content_ratings';
       var url = Lampa.TMDB.api(type + '/' + movie.id + '?api_key=' + getTmdbKey() + '&language=' + lang + '&append_to_response=' + append);

       var network = new Lampa.Reguest();
       network.silent(url, function (data) {
           var details = { age: '', country: '', time: '' };

           // Длительность
           if (type === 'movie' && data.runtime) {
               var h = Math.floor(data.runtime / 60);
               var m = data.runtime % 60;
               details.time = (h > 0 ? h + ' ч ' : '') + m + ' мин';
           } else if (type === 'tv' && data.episode_run_time && data.episode_run_time.length) {
               details.time = '~' + data.episode_run_time[0] + ' мин';
           }

           // Страна
           if (data.production_countries && data.production_countries.length > 0) {
               details.country = data.production_countries[0].iso_3166_1;
           }

           // Возрастной рейтинг
           if (type === 'movie' && data.release_dates && data.release_dates.results) {
               var usRelease = data.release_dates.results.find(function (r) { return r.iso_3166_1 === 'US'; });
               if (usRelease && usRelease.release_dates.length > 0) {
                   details.age = usRelease.release_dates[0].certification;
               }
           } else if (type === 'tv' && data.content_ratings && data.content_ratings.results) {
               var usRating = data.content_ratings.results.find(function (r) { return r.iso_3166_1 === 'US'; });
               if (usRating) details.age = usRating.rating;
           }

           if (!details.age) details.age = ''; // Fallback

           window.LikhtarHeroDetails[movie.id] = details;
           renderDetails(details);
       });
   }

   // Один элемент героя-строки (backdrop + overlay). heightEm — высота баннера (напр. 28).
   function makeHeroResultItem(movie, heightEm) {
       heightEm = heightEm || 22.5;
       var pad = (heightEm / 35 * 2).toFixed(1);
       var titleEm = (heightEm / 35 * 2.5).toFixed(2);
       var descEm = (heightEm / 35 * 1.1).toFixed(2);
       var metaEm = (heightEm / 35 * 1.0).toFixed(2);

       var year = (movie.release_date || movie.first_air_date || '').substr(0, 4);
       var rating = movie.vote_average ? movie.vote_average.toFixed(1) : '';
       var typeStr = movie.name ? 'Сериал' : 'Фильм';

       var metaHtml = '<div class="hero-meta" style="font-size: ' + metaEm + 'em; color: #ddd; margin-bottom: 0.8em; display: flex; gap: 0.6em; align-items: center; font-weight: 500;">';
       if (rating && rating !== '0.0') metaHtml += '<span style="background: rgba(255,255,255,0.25); padding: 0.1em 0.5em; border-radius: 0.2em; color: #fff;">Оценка: ' + rating + '</span>';
       if (year) metaHtml += '<span>' + year + '</span>';
       metaHtml += '<span style="color: #999">•</span><span>' + typeStr + '</span>';
       metaHtml += '<div class="hero-meta-dynamic" style="display: flex; gap: 0.6em; align-items: center;"></div>';
       metaHtml += '</div>';

       return {
           title: 'Hero',
           params: {
               createInstance: function (element) {
                   var card = Lampa.Maker.make('Card', element, function (module) { return module.only('Card', 'Callback'); });
                   return card;
               },
               emit: {
                   onCreate: function () {
                       var img = movie.backdrop_path ? Lampa.TMDB.image('t/p/w1280' + movie.backdrop_path) : (movie.poster_path ? Lampa.TMDB.image('t/p/w780' + movie.poster_path) : '');
                       try {
                           var item = $(this.html);
                           item.addClass('hero-banner');
                           item.css({
                               'background-image': 'url(' + img + ')',
                               'width': '100%',
                               'height': heightEm + 'em',
                               'background-size': 'cover',
                               'background-position': 'center',
                               'border-radius': '1em',
                               'position': 'relative',
                               'box-shadow': '0 0 20px rgba(0,0,0,0.5)',
                               'margin-bottom': '10px',
                               'cursor': 'pointer'
                           });
                           item.append('<div class="hero-overlay" style="position: absolute; bottom: 0; left: 0; right: 0; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 40%, transparent 100%); padding: ' + (pad * 1.2) + 'em; border-radius: 0 0 1em 1em;">' +
                               '<div class="hero-title" style="font-size: ' + titleEm + 'em; font-weight: bold; color: #fff; margin-bottom: 0.2em; text-shadow: 2px 2px 4px rgba(0,0,0,0.7);">' + (movie.title || movie.name) + '</div>' +
                               metaHtml +
                               '<div class="hero-desc" style="font-size: ' + descEm + 'em; color: #eee; max-width: 65%; line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-shadow: 1px 1px 3px rgba(0,0,0,0.9);">' + (movie.overview || '') + '</div></div>');
                           item.find('.card__view').remove();
                           item.find('.card__title').remove();
                           item.find('.card__age').remove();
                           item[0].heroMovieData = movie;
                           item[0]._heroInitDone = true;

                           fetchHeroLogo(movie, item, heightEm);
                           fetchHeroDetails(movie, item, metaEm);
                       } catch (e) { console.log('Hero onCreate error:', e); }
                   },
                   onVisible: function () {
                       try {
                           var item = $(this.html);
                           // Only re-init if Lampa reset the DOM (hero-banner class lost)
                           if (!item.hasClass('hero-banner') || !this.html._heroInitDone) {
                               var img = movie.backdrop_path ? Lampa.TMDB.image('t/p/w1280' + movie.backdrop_path) : (movie.poster_path ? Lampa.TMDB.image('t/p/w780' + movie.poster_path) : '');
                               item.addClass('hero-banner');
                               item.css({
                                   'background-image': 'url(' + img + ')',
                                   'width': '100%',
                                   'height': heightEm + 'em',
                                   'background-size': 'cover',
                                   'background-position': 'center',
                                   'border-radius': '1em',
                                   'position': 'relative',
                                   'box-shadow': '0 0 20px rgba(0,0,0,0.5)',
                                   'margin-bottom': '10px',
                                   'cursor': 'pointer'
                               });
                               item.append('<div class="hero-overlay" style="position: absolute; bottom: 0; left: 0; right: 0; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 40%, transparent 100%); padding: ' + (pad * 1.2) + 'em; border-radius: 0 0 1em 1em;">' +
                                   '<div class="hero-title" style="font-size: ' + titleEm + 'em; font-weight: bold; color: #fff; margin-bottom: 0.2em; text-shadow: 2px 2px 4px rgba(0,0,0,0.7);">' + (movie.title || movie.name) + '</div>' +
                                   metaHtml +
                                   '<div class="hero-desc" style="font-size: ' + descEm + 'em; color: #eee; max-width: 65%; line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-shadow: 1px 1px 3px rgba(0,0,0,0.9);">' + (movie.overview || '') + '</div></div>');

                               item.find('.card__view').remove();
                               item.find('.card__title').remove();
                               item.find('.card__age').remove();
                               item[0].heroMovieData = movie;
                               item[0]._heroInitDone = true;

                               fetchHeroLogo(movie, item, heightEm);
                               fetchHeroDetails(movie, item, metaEm);
                           }
                           // Stop default image loading
                           if (this.img) this.img.onerror = function () { };
                           if (this.img) this.img.onload = function () { };
                       } catch (e) { console.log('Hero onVisible error:', e); }
                   },
                   onlyEnter: function () {
                       Lampa.Activity.push({
                           url: '',
                           component: 'full',
                           id: movie.id,
                           method: movie.name ? 'tv' : 'movie',
                           card: movie,
                           source: 'tmdb'
                       });
                   }
               }
           }
       };
   }

   function StudiosMain(object) {
       var comp = new Lampa.InteractionMain(object);

       comp.create = function () {
           var _this = this;
           this.activity.loader(true);

           if (object.categories && object.categories.length) {
               var categories = object.categories;
               var network = new Lampa.Reguest();
               var status = new Lampa.Status(categories.length);

               status.onComplite = function () {
                   var fulldata = [];
                   Object.keys(status.data).sort(function (a, b) { return a - b; }).forEach(function (key) {
                       var data = status.data[key];
                       if (data && data.results && data.results.length) {
                           var cat = categories[parseInt(key)];
                           Lampa.Utils.extendItemsParams(data.results, { style: { name: 'wide' } });
                           fulldata.push({
                               title: cat.title,
                               results: data.results,
                               url: cat.url,
                               params: cat.params,
                               service_id: object.service_id
                           });
                       }
                   });

                   if (fulldata.length) {
                       _this.build(fulldata);
                       _this.activity.loader(false);
                   } else {
                       _this.empty();
                   }
               };

               categories.forEach(function (cat, index) {
                   var params = [];
                   params.push('api_key=' + getTmdbKey());
                   params.push('language=' + Lampa.Storage.get('language', 'uk'));

                   if (cat.params) {
                       for (var key in cat.params) {
                           var val = cat.params[key];
                           if (val === '{current_date}') {
                               var d = new Date();
                               val = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
                           }
                           params.push(key + '=' + val);
                       }
                   }

                   var url = Lampa.TMDB.api(cat.url + '?' + params.join('&'));

                   network.silent(url, function (json) {
                       // FIX: Normalize image paths for all items
                       if (json && json.results && Array.isArray(json.results)) {
                           json.results.forEach(function (item) {
                               if (!item.poster_path && item.backdrop_path) {
                                   item.poster_path = item.backdrop_path;
                               }
                           });
                       }
                       status.append(index.toString(), json);
                   }, function () {
                       status.error();
                   });
               });
           } else {
               this.activity.loader(false);
               this.empty();
           }

           return this.render();
       };

       // OnMore will be handled by StudiosView 
       comp.onMore = function (data) {
           Lampa.Activity.push({
               url: data.url,
               params: data.params,
               title: data.title,
               component: 'studios_view',
               page: 1
           });
       };
       return comp;
   }

   // Категории перенесены наверх
   function UkrainianFeedMain(object) {
       var comp = new Lampa.InteractionMain(object);
       var network = new Lampa.Reguest();
       var categories = UKRAINIAN_FEED_CATEGORIES;

       comp.create = function () {
           var _this = this;
           this.activity.loader(true);
           var requestIndices = [];
           categories.forEach(function (c, i) { if (c.type !== 'from_global') requestIndices.push(i); });
           var status = new Lampa.Status(requestIndices.length);

           status.onComplite = function () {
               var fulldata = [];
               if (status.data) {
                   Object.keys(status.data).sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); }).forEach(function (key) {
                       var data = status.data[key];
                       var cat = categories[requestIndices[parseInt(key, 10)]];
                       if (cat && data && data.results && data.results.length) {
                           Lampa.Utils.extendItemsParams(data.results, { style: { name: 'wide' } });
                           fulldata.push({
                               title: cat.title,
                               results: data.results,
                               url: cat.url,
                               params: cat.params
                           });
                       }
                   });
               }
               categories.forEach(function (cat) {
                   if (cat.type === 'from_global' && cat.globalKey && window[cat.globalKey] && window[cat.globalKey].results && window[cat.globalKey].results.length) {
                       var raw = window[cat.globalKey].results;
                       var results = Array.isArray(raw) ? raw.slice(0, 100) : (raw.results || []).slice(0, 100);
                       if (results.length === 0) return;
                       Lampa.Utils.extendItemsParams(results, { style: { name: 'wide' } });
                       var mediaType = (results[0] && results[0].media_type) ? results[0].media_type : 'movie';
                       fulldata.push({
                           title: cat.title,
                           results: results,
                           url: mediaType === 'tv' ? 'discover/tv' : 'discover/movie',
                           params: { with_origin_country: 'UA' }
                       });
                   }
               });
               if (fulldata.length) {
                   _this.build(fulldata);
                   _this.activity.loader(false);
               } else {
                   _this.empty();
               }
           };

           requestIndices.forEach(function (catIndex, rIdx) {
               var cat = categories[catIndex];
               var params = ['api_key=' + getTmdbKey(), 'language=' + Lampa.Storage.get('language', 'uk')];
               if (cat.params) {
                   for (var key in cat.params) {
                       var val = cat.params[key];
                       if (val === '{current_date}') {
                           var d = new Date();
                           val = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
                       }
                       params.push(key + '=' + val);
                   }
               }
               var url = Lampa.TMDB.api(cat.url + '?' + params.join('&'));
               network.silent(url, function (json) {
                   // FIX: Normalize image paths for all items
                   if (json && json.results && Array.isArray(json.results)) {
                       json.results.forEach(function (item) {
                           if (!item.poster_path && item.backdrop_path) {
                               item.poster_path = item.backdrop_path;
                           }
                       });
                   }
                   status.append(rIdx.toString(), json);
               }, function () { status.error(); });
           });

           return this.render();
       };

       comp.onMore = function (data) {
           Lampa.Activity.push({
               url: data.url,
               params: data.params,
               title: data.title,
               component: 'studios_view',
               page: 1
           });
       };

       return comp;
   }



   function StudiosView(object) {
       var comp = new Lampa.InteractionCategory(object);
       var network = new Lampa.Reguest();

       function buildUrl(page) {
           var params = [];
           params.push('api_key=' + getTmdbKey());
           params.push('language=' + Lampa.Storage.get('language', 'uk'));
           params.push('page=' + page);

           if (object.params) {
               for (var key in object.params) {
                   var val = object.params[key];
                   if (val === '{current_date}') {
                       var d = new Date();
                       val = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
                   }
                   params.push(key + '=' + val);
               }
           }
           return Lampa.TMDB.api(object.url + '?' + params.join('&'));
       }

       comp.create = function () {
           var _this = this;
           network.silent(buildUrl(1), function (json) {
               // FIX: Ensure all items have poster_path for display
               // If backdrop_path exists but poster_path doesn't, use backdrop_path
               if (json && json.results && Array.isArray(json.results)) {
                   json.results.forEach(function (item) {
                       if (!item.poster_path && item.backdrop_path) {
                           item.poster_path = item.backdrop_path;
                       }
                   });
               }
               _this.build(json);
           }, this.empty.bind(this));
       };

       comp.nextPageReuest = function (object, resolve, reject) {
           network.silent(buildUrl(object.page), resolve, reject);
       };

       return comp;
   }

   // =================================================================
   // ПОДПИСКИ НА СТУДИИ (Фонарь — интегрировано с studio_subscription)
   // =================================================================
   var LikhtarStudioSubscription = (function () {
       var storageKey = 'likhtar_subscription_studios';

       function getParams() {
           var raw = Lampa.Storage.get(storageKey, '[]');
           return typeof raw === 'string' ? (function () { try { return JSON.parse(raw); } catch (e) { return []; } })() : (Array.isArray(raw) ? raw : []);
       }

       function setParams(params) {
           Lampa.Storage.set(storageKey, params);
       }

       function add(company) {
           var c = { id: company.id, name: company.name || '', logo_path: company.logo_path || '' };
           var studios = getParams();
           if (!studios.find(function (s) { return String(s.id) === String(c.id); })) {
               studios.push(c);
               setParams(studios);
               Lampa.Noty.show(Lampa.Lang.translate('title_bookmarked') || 'Добавлено в подписки');
           }
       }

       function remove(company) {
           var studios = getParams();
           var idx = studios.findIndex(function (c) { return c.id === company.id; });
           if (idx !== -1) {
               studios.splice(idx, 1);
               setParams(studios);
               Lampa.Noty.show(Lampa.Lang.translate('title_unbookmarked'));
           }
       }

       function isSubscribed(company) {
           return !!getParams().find(function (c) { return c.id === company.id; });
       }

       function injectButton(object) {
           var attempts = 0;
           var interval = setInterval(function () {
               var nameEl = $('.company-start__name');
               var company = object.company;
               if (!nameEl.length || !company || !company.id) {
                   attempts++;
                   if (attempts > 25) clearInterval(interval);
                   return;
               }
               clearInterval(interval);
               if (nameEl.find('.studio-subscription-btn').length) return;

               var btn = $('<div class="studio-subscription-btn selector"></div>');

               function updateState() {
                   var sub = isSubscribed(company);
                   btn.text(sub ? 'Отписаться' : 'Подписаться');
                   btn.removeClass('studio-subscription-btn--sub studio-subscription-btn--unsub').addClass(sub ? 'studio-subscription-btn--unsub' : 'studio-subscription-btn--sub');
               }

               function doToggle() {
                   if (isSubscribed(company)) remove(company);
                   else add({ id: company.id, name: company.name || '', logo_path: company.logo_path || '' });
                   updateState();
               }

               btn.on('click', function (e) {
                   e.stopPropagation();
                   e.preventDefault();
                   doToggle();
               });
               btn.on('hover:enter', doToggle);

               updateState();
               nameEl.append(btn);

               // Auto-focus the subscription button so it's visible immediately
               setTimeout(function () {
                   try {
                       if (Lampa.Controller && Lampa.Controller.collectionFocus) {
                           Lampa.Controller.collectionFocus(btn[0]);
                       }
                   } catch (e) { }
               }, 300);
           }, 200);
       }

       function registerComponent() {
           var langSubs = { en: 'My subscriptions', ru: 'Мои подписки', uk: 'Мої підписки', be: 'Мае падпіскі' };
           Lampa.Lang.add({
               title_studios_subscription: { en: 'Studios', ru: 'Студии', uk: 'Студії', be: 'Студыі' },
               likhtar_my_subscriptions: langSubs
           });

           Lampa.Component.add('studios_subscription', function (object) {
               var comp = new Lampa.InteractionMain(object);
               var network = new Lampa.Reguest();
               var studios = getParams();
               var limitPerStudio = 20;

               comp.create = function () {
                   var _this = this;
                   this.activity.loader(true);
                   if (!studios.length) {
                       this.empty();
                       this.activity.loader(false);
                       return this.render();
                   }
                   var status = new Lampa.Status(studios.length);
                   status.onComplite = function () {
                       var fulldata = [];
                       if (status.data) {
                           Object.keys(status.data).sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); }).forEach(function (key) {
                               var data = status.data[key];
                               var studio = studios[parseInt(key, 10)];
                               if (studio && data && data.results && data.results.length) {
                                   Lampa.Utils.extendItemsParams && Lampa.Utils.extendItemsParams(data.results, { style: { name: 'wide' } });
                                   fulldata.push({
                                       title: studio.name || ('Студия ' + studio.id),
                                       results: (data.results || []).slice(0, limitPerStudio),
                                       url: 'discover/movie',
                                       params: { with_companies: String(studio.id), sort_by: 'popularity.desc' }
                                   });
                               }
                           });
                       }
                       if (fulldata.length) {
                           _this.build(fulldata);
                       } else {
                           _this.empty();
                       }
                       _this.activity.loader(false);
                   };

                   studios.forEach(function (studio, index) {
                       var d = new Date();
                       var currentDate = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
                       var apiKeyParam = '?api_key=' + getTmdbKey() + '&language=' + Lampa.Storage.get('language', 'uk');

                       var movieUrl = Lampa.TMDB.api('discover/movie' + apiKeyParam + '&with_companies=' + encodeURIComponent(studio.id) + '&sort_by=popularity.desc&primary_release_date.lte=' + currentDate + '&page=1');
                       var tvUrl = Lampa.TMDB.api('discover/tv' + apiKeyParam + '&with_networks=' + encodeURIComponent(studio.id) + '&sort_by=popularity.desc&first_air_date.lte=' + currentDate + '&page=1');

                       var pending = 2;
                       var combinedResults = [];
                       var failed = false;

                       function donePart(res) {
                           if (res && res.results) {
                               res.results.forEach(function (item) {
                                   if (!item.poster_path && item.backdrop_path) item.poster_path = item.backdrop_path;
                                   combinedResults.push(item);
                               });
                           }
                           pending--;
                           if (pending === 0) finalize();
                       }

                       function finalize() {
                           if (failed && combinedResults.length === 0) {
                               status.error();
                           } else {
                               combinedResults.sort(function (a, b) {
                                   var popA = a.popularity || 0;
                                   var popB = b.popularity || 0;
                                   return popB - popA;
                               });
                               status.append(index.toString(), { results: combinedResults });
                           }
                       }

                       network.silent(movieUrl, donePart, function () { failed = true; donePart(); });
                       network.silent(tvUrl, donePart, function () { failed = true; donePart(); });
                   });
                   return this.render();
               };

               comp.onMore = function (data) {
                   Lampa.Activity.push({
                       url: data.url,
                       params: data.params,
                       title: data.title,
                       component: 'studios_view',
                       page: 1
                   });
               };

               return comp;
           });

           var menuLine = $('<li class="menu__item selector" data-action="studios_subscription"><div class="menu__ico"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M437 75a68 68 0 00-47.5-19.5h-267A68 68 0 0075 123.5v265A68 68 0 00122.5 456h267a68 68 0 0047.5-19.5H437A68 68 0 00456.5 388.5v-265A68 68 0 00437 75zM122.5 94h267a28 28 0 0128 28v265a28 28 0 01-28 28h-267a28 28 0 01-28-28v-265a28 28 0 0128-28z"></path></svg></div><div class="menu__text">' + (Lampa.Lang.translate('likhtar_my_subscriptions') || 'Мои подписки') + '</div></li>');
           var target = $('.menu .menu__list .menu__item[data-action="subscribes"]');
           if (target.length) target.after(menuLine);
           else $('.menu .menu__list').append(menuLine);

           menuLine.on('hover:enter', function () {
               Lampa.Activity.push({
                   url: '',
                   title: Lampa.Lang.translate('likhtar_my_subscriptions') || 'Мои подписки',
                   component: 'studios_subscription',
                   page: 1
               });
           });
       }

       return {
           init: function () {
               var existing = Lampa.Storage.get(storageKey, '[]');
               var fromOld = Lampa.Storage.get('subscription_studios', '[]');
               if ((!existing || existing === '[]' || (Array.isArray(existing) && !existing.length)) && fromOld && fromOld !== '[]') {
                   try {
                       var arr = typeof fromOld === 'string' ? JSON.parse(fromOld) : fromOld;
                       if (Array.isArray(arr) && arr.length) setParams(arr);
                   } catch (e) { }
               }
               registerComponent();
               Lampa.Listener.follow('activity', function (e) {
                   if (e.type === 'start' && e.component === 'company') injectButton(e.object);
               });
           }
       };
   })();

   // =================================================================
   // MAIN PAGE ROWS
   // =================================================================

   // ========== Убираем секцию Shots ==========
   function removeShotsSection() {
       function doRemove() {
           $('.items-line').each(function () {
               var title = $(this).find('.items-line__title').text().trim();
               if (title === 'Shots' || title === 'shots') {
                   $(this).remove();
               }
           });
       }
       // Выполняем с задержкой, так как Shots может подгрузиться позже
       setTimeout(doRemove, 1000);
       setTimeout(doRemove, 3000);
       setTimeout(doRemove, 6000);
   }

   // ========== ROW 1: HERO SLIDER (New Releases) ==========
   function addHeroRow() {
       Lampa.ContentRows.add({
           index: 0,
           name: 'custom_hero_row',
           title: 'Новинки проката', // "New Releases"
           screen: ['main'],
           call: function (params) {
               return function (callback) {
                   var network = new Lampa.Reguest();
                   // Fetch Now Playing movies (Fresh releases)
                   var url = Lampa.TMDB.api('movie/now_playing?api_key=' + getTmdbKey() + '&language=' + Lampa.Storage.get('language', 'uk') + '&region=UA');

                   network.silent(url, function (json) {
                       var items = json.results || [];
                       if (!items.length) {
                           // Fallback if no fresh movies
                           url = Lampa.TMDB.api('trending/all/week?api_key=' + getTmdbKey() + '&language=' + Lampa.Storage.get('language', 'uk'));
                           network.silent(url, function (retryJson) {
                               items = retryJson.results || [];
                               build(items);
                           });
                           return;
                       }
                       build(items);

                       function build(movies) {
                           var moviesWithBackdrop = movies.filter(function (m) { return m.backdrop_path; });
                           var results = moviesWithBackdrop.slice(0, 15).map(function (movie) { return makeHeroResultItem(movie, 22.5); });

                           callback({
                               results: results,
                               title: '🔥 Новинки проката', // Title visible above the row
                               params: {
                                   items: {
                                       mapping: 'line',
                                       view: 15
                                   }
                               }
                           });
                       }

                   }, function () {
                       callback({ results: [] });
                   });
               };
           }
       });
   }

   // ========== ROW 2: STUDIOS (Moved Up) ==========
   function addStudioRow() {
       var studios = [
           { id: 'netflix', name: 'Netflix', img: LIKHTAR_BASE_URL + 'logos/netflix.svg', providerId: '8' },
           { id: 'disney', name: 'Disney+', img: LIKHTAR_BASE_URL + 'logos/disney.svg', providerId: '337' },
           { id: 'hbo', name: 'HBO', img: LIKHTAR_BASE_URL + 'logos/hbo.svg', providerId: '384' },
           { id: 'apple', name: 'Apple TV+', img: LIKHTAR_BASE_URL + 'logos/apple.svg', providerId: '350' },
           { id: 'amazon', name: 'Prime Video', img: LIKHTAR_BASE_URL + 'logos/amazon.png', providerId: '119' },
           { id: 'hulu', name: 'Hulu', img: LIKHTAR_BASE_URL + 'logos/Hulu.svg', providerId: '15' },
           { id: 'paramount', name: 'Paramount+', img: LIKHTAR_BASE_URL + 'logos/paramount.svg', providerId: '531' },
           { id: 'sky_showtime', name: 'Sky Showtime', img: LIKHTAR_BASE_URL + 'logos/SkyShowtime.svg', providerId: '1773' },
           { id: 'syfy', name: 'Syfy', img: LIKHTAR_BASE_URL + 'logos/Syfy.svg', networkId: '77' },
           { id: 'educational_and_reality', name: 'Познавательное', img: LIKHTAR_BASE_URL + 'logos/Discovery.svg' },
           { id: 'ukrainian_feed', name: 'Украинская лента', isUkrainianFeed: true }
       ];

       // Проверка нового контента за последние 7 дней
       function check
