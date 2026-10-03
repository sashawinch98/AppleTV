(function () {
   'use strict';

   /*
    * LIKHTAR RU
    * Русский интерфейс Lampa на основе TMDB
    * Версия 1.0
    */

   if (window.LIKHTAR_RU) return;
   window.LIKHTAR_RU = true;

   var VERSION = '1.0.0';
   var STYLE_ID = 'likhtar-ru-style';

   /* =========================================================
      НАСТРОЙКИ
      ========================================================= */

   var CONFIG = {
       language: 'ru-RU',
       region: 'RU',

       heroCount: 8,
       cardCount: 20,

       animation: true,
       heroHeight: 31
   };

   /* =========================================================
      ОЖИДАНИЕ LAMPA
      ========================================================= */

   function waitLampa(callback) {

       if (typeof Lampa === 'undefined') {
           setTimeout(function () {
               waitLampa(callback);
           }, 300);

           return;
       }

       if (window.appready) {
           callback();
           return;
       }

       if (Lampa.Listener) {

           Lampa.Listener.follow('app', function (event) {

               if (event.type === 'ready') {
                   callback();
               }

           });

       } else {

           setTimeout(function () {
               waitLampa(callback);
           }, 300);

       }
   }

   /* =========================================================
      TMDB
      ========================================================= */

   function tmdbKey() {

       if (
           Lampa.TMDB &&
           typeof Lampa.TMDB.key === 'function'
       ) {
           return Lampa.TMDB.key();
       }

       return Lampa.Storage.get(
           'tmdb_api_key',
           ''
       );
   }


   function tmdb(path, params, success, error) {

       params = params || {};

       params.api_key = tmdbKey();
       params.language = CONFIG.language;

       var query = Object.keys(params)
           .map(function (key) {

               return (
                   encodeURIComponent(key) +
                   '=' +
                   encodeURIComponent(params[key])
               );

           })
           .join('&');

       var url =
           path +
           (path.indexOf('?') > -1 ? '&' : '?') +
           query;


       var request = new Lampa.Reguest();

       request.timeout(10000);

       request.silent(

           Lampa.TMDB.api(url),

           function (data) {

               success(data || {});

           },

           function () {

               if (error) error();

           }

       );
   }


   /* =========================================================
      TMDB IMAGES
      ========================================================= */

   function image(path, size) {

       if (!path) return '';

       size = size || 'w780';

       if (
           Lampa.TMDB &&
           typeof Lampa.TMDB.image === 'function'
       ) {

           return Lampa.TMDB.image(
               't/p/' + size + path
           );

       }

       return '';
   }


   /* =========================================================
      HTML ESCAPE
      ========================================================= */

   function escapeHTML(value) {

       return String(value || '')
           .replace(/&/g, '&amp;')
           .replace(/</g, '&lt;')
           .replace(/>/g, '&gt;')
           .replace(/"/g, '&quot;')
           .replace(/'/g, '&#039;');

   }


   /* =========================================================
      CSS
      ========================================================= */

   function styles() {

       if (
           document.getElementById(STYLE_ID)
       ) return;


       var css = `

       /* ===============================================
          LIKHTAR RU
          =============================================== */

       html,
       body {

           background:#000 !important;

       }


       .content {

           background:#000 !important;

       }


       .main2 {

           background:

               radial-gradient(
                   ellipse 80% 35%
                   at 50% 0%,
                   rgba(90,90,110,.14),
                   transparent 70%
               ),

               #000 !important;

       }


       /* ===============================================
          HERO
          =============================================== */

       .likhtar-ru-hero {

           position:relative;

           width:100%;

           height:${CONFIG.heroHeight}em;

           border-radius:1.2em;

           overflow:hidden;

           background-size:cover;

           background-position:center;

           box-shadow:
               0 1em 3em
               rgba(0,0,0,.55);

           transition:
               transform .2s ease,
               box-shadow .2s ease;

       }


       .likhtar-ru-hero::before {

           content:"";

           position:absolute;

           inset:0;

           background:

               linear-gradient(
                   90deg,
                   rgba(0,0,0,.95),
                   rgba(0,0,0,.70) 38%,
                   rgba(0,0,0,.20) 72%,
                   rgba(0,0,0,.05)
               ),

               linear-gradient(
                   0deg,
                   rgba(0,0,0,.85),
                   transparent 60%
               );

       }


       .likhtar-ru-hero.focus {

           transform:scale(1.015);

           box-shadow:
               0 1.5em 4em
               rgba(0,0,0,.8);

       }


       .likhtar-ru-info {

           position:absolute;

           z-index:2;

           left:3.5em;

           bottom:3em;

           width:48%;

       }


       .likhtar-ru-title {

           font-size:2.7em;

           line-height:1;

           font-weight:800;

           letter-spacing:-.045em;

           margin-bottom:.45em;

           color:#fff;

           text-shadow:
               0 3px 20px
               rgba(0,0,0,.8);

       }


       .likhtar-ru-meta {

           display:flex;

           align-items:center;

           gap:.6em;

           margin-bottom:.8em;

           color:
               rgba(255,255,255,.78);

       }


       .likhtar-ru-rating {

           padding:.2em .55em;

           border-radius:.45em;

           background:
               rgba(255,255,255,.16);

           border:
               1px solid
               rgba(255,255,255,.15);

       }


       .likhtar-ru-description {

           color:
               rgba(255,255,255,.78);

           line-height:1.45;

           font-size:1em;

           display:
               -webkit-box;

           -webkit-line-clamp:3;

           -webkit-box-orient:vertical;

           overflow:hidden;

       }


       .likhtar-ru-tmdb {

           display:inline-block;

           margin-top:.8em;

           padding:.25em .6em;

           border-radius:.4em;

           background:
               rgba(255,255,255,.12);

           font-size:.8em;

           color:
               rgba(255,255,255,.75);

       }


       /* ===============================================
          СЕКЦИИ
          =============================================== */

       .likhtar-ru-section {

           margin-bottom:2.5em;

       }


       .likhtar-ru-section-title {

           font-size:1.35em;

           font-weight:700;

           letter-spacing:-.02em;

           margin-bottom:.65em;

       }


       /* ===============================================
          КАРТОЧКИ
          =============================================== */

       .likhtar-ru-card {

           border-radius:.8em !important;

           overflow:hidden !important;

           transition:
               transform .18s ease,
               box-shadow .18s ease;

       }


       .likhtar-ru-card.focus {

           transform:scale(1.06);

           z-index:50;

           box-shadow:
               0 .8em 2.5em
               rgba(0,0,0,.7);

       }


       .likhtar-ru-card .card__view {

           border-radius:.8em !important;

           overflow:hidden !important;

       }


       /* ===============================================
          ЖАНРЫ / СЕРВИСЫ
          =============================================== */

       .likhtar-ru-tile {

           min-width:15em;

           height:8em;

           border-radius:1em;

           display:flex;

           align-items:center;

           justify-content:center;

           background:

               linear-gradient(
                   135deg,
                   rgba(255,255,255,.14),
                   rgba(255,255,255,.035)
               );

           border:
               1px solid
               rgba(255,255,255,.08);

           font-size:1.15em;

           font-weight:700;

           color:#fff;

           transition:
               transform .18s ease,
               background .18s ease;

       }


       .likhtar-ru-tile.focus {

           transform:scale(1.045);

           background:
               rgba(255,255,255,.18);

       }


       /* ===============================================
          МЕНЮ
          =============================================== */

       .menu {

           background:
               rgba(8,8,10,.96)
               !important;

           backdrop-filter:
               blur(25px);

       }


       .menu__item {

           border-radius:.65em;

       }


       .menu__item.focus {

           background:
               rgba(255,255,255,.12);

       }


       /* ===============================================
          HEADER
          =============================================== */

       .head {

           background:
               linear-gradient(
                   rgba(0,0,0,.8),
                   transparent
               ) !important;

       }


       /* ===============================================
          FULL / ФИЛЬМ
          =============================================== */

       .full-start {

           background:#000 !important;

       }


       .full-start__button {

           border-radius:.65em !important;

       }


       /* ===============================================
          SEARCH
          =============================================== */

       .search-input {

           border-radius:.7em !important;

       }


       /* ===============================================
          АНИМАЦИЯ
          =============================================== */

       * {

           -webkit-tap-highlight-color:
               transparent;

       }

       `;


       $('<style>')
           .attr('id', STYLE_ID)
           .text(css)
           .appendTo('head');

   }


   /* =========================================================
      ОТКРЫТЬ ФИЛЬМ
      ========================================================= */

   function openMovie(movie) {

       if (!movie || !movie.id) return;


       var type =
           movie.media_type ||
           (movie.name ? 'tv' : 'movie');


       Lampa.Activity.push({

           url:'',

           component:'full',

           id:movie.id,

           method:type,

           card:movie,

           source:'tmdb'

       });

   }


   /* =========================================================
      HERO
      ========================================================= */

   function hero(movie) {

       var title =
           movie.title ||
           movie.name ||
           'Без названия';


       var year =
           movie.release_date ||
           movie.first_air_date ||
           '';


       year =
           year ?
           year.substring(0,4) :
           '';


       var rating =
           movie.vote_average ?
           Number(movie.vote_average)
               .toFixed(1) :
           '';


       var type =
           movie.media_type === 'tv' ||
           movie.name ?
           'Сериал' :
           'Фильм';


       var bg =
           image(
               movie.backdrop_path ||
               movie.poster_path,
               'w1280'
           );


       var element = $(

           '<div class="likhtar-ru-hero selector">' +

               '<div class="likhtar-ru-info">' +

                   '<div class="likhtar-ru-title">' +
                       escapeHTML(title) +
                   '</div>' +

                   '<div class="likhtar-ru-meta">' +

                       (
                           rating ?
                           '<span class="likhtar-ru-rating">' +
                               '★ ' +
                               escapeHTML(rating) +
                           '</span>' :
                           ''
                       ) +

                       (
                           year ?
                           '<span>' +
                               escapeHTML(year) +
                           '</span>' :
                           ''
                       ) +

                       '<span>•</span>' +

                       '<span>' +
                           type +
                       '</span>' +

                   '</div>' +

                   '<div class="likhtar-ru-description">' +
                       escapeHTML(
                           movie.overview ||
                           ''
                       ) +
                   '</div>' +

                   '<div class="likhtar-ru-tmdb">' +
                       'TMDB' +
                   '</div>' +

               '</div>' +

           '</div>'

       );


       element.css(
           'background-image',
           'url("' + bg + '")'
       );


       element.on(
           'hover:enter',
           function () {

               openMovie(movie);

           }
       );


       return {

           title:'',

           params:{

               createInstance:function (el) {

                   return Lampa.Maker.make(
                       'Card',
                       el,
                       function (module) {

                           return module.only(
                               'Card',
                               'Callback'
                           );

                       }
                   );

               },

               emit:{

                   onCreate:function () {

                       var card =
                           $(this.html);

                       card
                           .empty()
                           .append(element);

                   },

                   onlyEnter:function () {

                       openMovie(movie);

                   }

               }

           }

       };

   }


   /* =========================================================
      ОБЫЧНАЯ КАРТОЧКА
      ========================================================= */

   function card(movie) {

       movie.media_type =
           movie.media_type ||
           (movie.name ? 'tv' : 'movie');


       return movie;

   }


   /* =========================================================
      ДОБАВИТЬ СТРОКУ
      ========================================================= */

   function row(
       index,
       name,
       title,
       loader
   ) {

       Lampa.ContentRows.add({

           index:index,

           name:name,

           title:title,

           screen:['main'],

           call:function () {

               return function (callback) {

                   loader(callback);

               };

           }

       });

   }


   /* =========================================================
      HERO — TRENDING
      ========================================================= */

   function addHero() {

       row(
           0,
           'likhtar_ru_hero',
           '',
           function (callback) {

               tmdb(

                   'trending/all/week',

                   {},

                   function (data) {

                       var results =
                           (data.results || [])
                           .filter(function (item) {

                               return (
                                   item.backdrop_path &&
                                   (
                                       item.title ||
                                       item.name
                                   )
                               );

                           })
                           .slice(
                               0,
                               CONFIG.heroCount
                           )
                           .map(hero);


                       callback({

                           results:results,

                           title:'',

                           params:{

                               items:{

                                   view:1,

                                   mapping:'line'

                               }

                           }

                       });

                   },

                   function () {

                       callback({
                           results:[]
                       });

                   }

               );

           }
       );

   }


   /* =========================================================
      TRENDING
      ========================================================= */

   function addTrending() {

       row(

           1,

           'likhtar_ru_trending',

           'В тренде',

           function (callback) {

               tmdb(

                   'trending/all/week',

                   {},

                   function (data) {

                       var results =
                           (data.results || [])
                           .filter(function (item) {

                               return item.poster_path;

                           })
                           .slice(
                               0,
                               CONFIG.cardCount
                           )
                           .map(card);


                       callback({

                           results:results,

                           title:'🔥 В тренде',

                           params:{

                               items:{

                                   view:8,

                                   mapping:'line'

                               }

                           }

                       });

                   }

               );

           }

       );

   }


   /* =========================================================
      ПОПУЛЯРНЫЕ ФИЛЬМЫ
      ========================================================= */

   function addPopularMovies() {

       row(

           2,

           'likhtar_ru_movies',

           'Фильмы',

           function (callback) {

               tmdb(

                   'discover/movie',

                   {

                       sort_by:
                           'popularity.desc',

                       'vote_count.gte':
                           50,

                       page:1

                   },

                   function (data) {

                       var results =
                           (data.results || [])
                           .map(card);


                       callback({

                           results:results,

                           title:
                               '🎬 Популярные фильмы',

                           params:{

                               items:{

                                   view:8,

                                   mapping:'line'

                               }

                           }

                       });

                   }

               );

           }

       );

   }


   /* =========================================================
      ПОПУЛЯРНЫЕ СЕРИАЛЫ
      ========================================================= */

   function addPopularSeries() {

       row(

           3,

           'likhtar_ru_series',

           'Сериалы',

           function (callback) {

               tmdb(

                   'discover/tv',

                   {

                       sort_by:
                           'popularity.desc',

                       'vote_count.gte':
                           20,

                       page:1

                   },

                   function (data) {

                       var results =
                           (data.results || [])
                           .map(card);


                       callback({

                           results:results,

                           title:
                               '📺 Популярные сериалы',

                           params:{

                               items:{

                                   view:8,

                                   mapping:'line'

                               }

                           }

                       });

                   }

               );

           }

       );

   }


   /* =========================================================
      НОВИНКИ
      ========================================================= */

   function addNewMovies() {

       row(

           4,

           'likhtar_ru_new',

           'Новинки',

           function (callback) {

               tmdb(

                   'movie/now_playing',

                   {

                       region:
                           CONFIG.region,

                       page:1

                   },

                   function (data) {

                       var results =
                           (data.results || [])
                           .map(card);


                       callback({

                           results:results,

                           title:
                               '🆕 Новинки',

                           params:{

                               items:{

                                   view:8,

                                   mapping:'line'

                               }

                           }

                       });

                   }

               );

           }

       );

   }


   /* =========================================================
      СКОРО
      ========================================================= */

   function addUpcoming() {

       row(

           5,

           'likhtar_ru_upcoming',

           'Скоро',

           function (callback) {

               tmdb(

                   'movie/upcoming',

                   {

                       region:
                           CONFIG.region,

                       page:1

                   },

                   function (data) {

                       var results =
                           (data.results || [])
                           .map(card);


                       callback({

                           results:results,

                           title:
                               '⏳ Скоро в кино',

                           params:{

                               items:{

                                   view:8,

                                   mapping:'line'

                               }

                           }

                       });

                   }

               );

           }

       );

   }


   /* =========================================================
      РОССИЙСКОЕ КИНО
      ========================================================= */

   function addRussian() {

       row(

           6,

           'likhtar_ru_russian',

           'Россия',

           function (callback) {

               tmdb(

                   'discover/movie',

                   {

                       with_origin_country:
                           'RU',

                       sort_by:
                           'primary_release_date.desc',

                       'vote_count.gte':
                           3,

                       page:1

                   },

                   function (data) {

                       var results =
                           (data.results || [])
                           .map(card);


                       callback({

                           results:results,

                           title:
                               '🇷🇺 Российское кино',

                           params:{

                               items:{

                                   view:8,

                                   mapping:'line'

                               }

                           }

                       });

                   }

               );

           }

       );

   }


   /* =========================================================
      ЖАНРЫ
      ========================================================= */

   function addGenres() {

       var genres = [

           ['Боевики',28],

           ['Комедии',35],

           ['Драмы',18],

           ['Фантастика',878],

           ['Ужасы',27],

           ['Триллеры',53],

           ['Детективы',9648],

           ['Фэнтези',14],

           ['Приключения',12],

           ['Анимация',16]

       ];


       row(

           7,

           'likhtar_ru_genres',

           'Жанры',

           function (callback) {

               var results =
                   genres.map(function (genre) {

                       return {

                           title:genre[0],

                           params:{

                               createInstance:
                                   function (element) {

                                       return Lampa.Maker.make(
                                           'Card',
                                           element,
                                           function (module) {

                                               return module.only(
                                                   'Card',
                                                   'Callback'
                                               );

                                           }
                                       );

                                   },

                               emit:{

                                   onCreate:
                                       function () {

                                           var el =
                                               $(this.html);

                                           el
                                               .addClass(
                                                   'likhtar-ru-tile'
                                               )
                                               .append(
                                                   '<div>' +
                                                   escapeHTML(
                                                       genre[0]
                                                   ) +
                                                   '</div>'
                                               );

                                       },


                                   onlyEnter:
                                       function () {

                                           Lampa.Activity.push({

                                               url:
                                                   'discover/movie' +
                                                   '?with_genres=' +
                                                   genre[1] +
                                                   '&sort_by=' +
                                                   'popularity.desc',

                                               title:
                                                   genre[0],

                                               component:
                                                   'category_full',

                                               page:1,

                                               source:'tmdb'

                                           });

                                       }

                               }

                           }

                       };

                   });


               callback({

                   results:results,

                   title:'🎭 Жанры',

                   params:{

                       items:{

                           view:4,

                           mapping:'line'

                       }

                   }

               });

           }

       );

   }


   /* =========================================================
      СТРИМИНГИ
      ========================================================= */

   function addServices() {

       var services = [

           ['Netflix',8],

           ['Apple TV+',350],

           ['Disney+',337],

           ['Prime Video',119],

           ['Max',1899],

           ['Paramount+',531],

           ['Crunchyroll',283]

       ];


       row(

           8,

           'likhtar_ru_services',

           'Сервисы',

           function (callback) {

               var results =
                   services.map(function (service) {

                       return {

                           title:service[0],

                           params:{

                               createInstance:
                                   function (element) {

                                       return Lampa.Maker.make(
                                           'Card',
                                           element,
                                           function (module) {

                                               return module.only(
                                                   'Card',
                                                   'Callback'
                                               );

                                           }
                                       );

                                   },


                               emit:{

                                   onCreate:
                                       function () {

                                           var el =
                                               $(this.html);

                                           el
                                               .addClass(
                                                   'likhtar-ru-tile'
                                               )
                                               .append(
                                                   '<div>' +
                                                   escapeHTML(
                                                       service[0]
                                                   ) +
                                                   '</div>'
                                               );

                                       },


                                   onlyEnter:
                                       function () {

                                           Lampa.Activity.push({

                                               url:
                                                   'discover/movie' +
                                                   '?with_watch_providers=' +
                                                   service[1] +
                                                   '&watch_region=' +
                                                   CONFIG.region +
                                                   '&sort_by=popularity.desc',

                                               title:
                                                   service[0],

                                               component:
                                                   'category_full',

                                               page:1,

                                               source:'tmdb'

                                           });

                                       }

                               }

                           }

                       };

                   });


               callback({

                   results:results,

                   title:
                       '📺 Стриминговые сервисы',

                   params:{

                       items:{

                           view:4,

                           mapping:'line'

                       }

                   }

               });

           }

       );

   }


   /* =========================================================
      РУССКИЙ UI
      ========================================================= */

   function russianUI() {

       var replacements = {

           'Home':'Главная',

           'Main':'Главная',

           'Movies':'Фильмы',

           'TV Shows':'Сериалы',

           'Series':'Сериалы',

           'Search':'Поиск',

           'Favorites':'Избранное',

           'Favorite':'Избранное',

           'History':'История',

           'Settings':'Настройки',

           'Watch':'Смотреть',

           'Details':'Подробнее',

           'Back':'Назад',

           'Next':'Далее',

           'Cancel':'Отмена',

           'Genres':'Жанры',

           'Popular':'Популярное',

           'New':'Новинки'

       };


       function replace() {

           $('body *')
               .contents()
               .filter(function () {

                   return this.nodeType === 3;

               })
               .each(function () {

                   var text =
                       this.nodeValue;


                   Object.keys(
                       replacements
                   ).forEach(function (key) {

                       if (
                           text.indexOf(key) >
                           -1
                       ) {

                           text =
                               text
                               .split(key)
                               .join(
                                   replacements[key]
                               );

                       }

                   });


                   this.nodeValue =
                       text;

               });

       }


       replace();


       setTimeout(
           replace,
           1000
       );


       setTimeout(
           replace,
           3000
       );

   }


   /* =========================================================
      ЗАПУСК
      ========================================================= */

   function start() {

       styles();

       addHero();

       addTrending();

       addPopularMovies();

       addPopularSeries();

       addNewMovies();

       addUpcoming();

       addRussian();

       addGenres();

       addServices();

       russianUI();


       console.log(
           '[LIKHTAR RU] v' +
           VERSION +
           ' loaded'
       );

   }


   waitLampa(start);

})();
