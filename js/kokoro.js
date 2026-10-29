// Kokoro cards (052), rebuilt from the prototypes in the vault
// (reference/ko-*.html). Every <figure class="media cs-card koc"
// data-koc="…"> in the case study becomes one card, so swapping a card is
// changing that attribute. Motion, timing, layout and text follow the
// prototypes, without their handwritten notes and arrows (Luna). Styles:
// css/kokoro.css. Frame, header, pause button, clock, the loop and when a
// card plays are shared with the other case studies: js/cards.js.
//
// Kokoro's own style: dark #111 cards with cream, like the poster.

(function () {
  'use strict';

  var C = window.SWCards;
  var hd = C.hd;
  var seq = C.seq;
  var IMG = '/img/kokoro/';

  var each = C.each;

  // The bottom of every card (js/cards.js)
  function foot(n, a, b) { return C.foot('koc', n, a, b); }
  var metaOf = C.metaOf;

  var CARDS = {};

  // ---------------------------------------------------------------------
  // Logo: 心 paints in its four strokes, in stroke order and numbered.
  // Each stroke is its own layer, cut from KOKOROblack.png, revealed by a
  // brush: one wide stroked path in a mask. Then the two hearts.
  // ---------------------------------------------------------------------
  // [mask path, brush width, paint time (ms), number x, y]
  var STROKES = [
    ['M300 280 C265 500 190 800 130 1090', 380, 700, 380, 250],
    ['M510 210 C600 520 830 880 1180 905 C1450 925 1700 850 1860 790 C1700 700 1560 640 1490 580 L1280 260', 380, 1300, 420, 140],
    ['M880 190 L1150 460', 430, 450, 800, 160],
    ['M1420 10 L1780 380', 520, 500, 1330, 70]
  ];
  CARDS.logo = {
    ctl: 'logo brush animation',
    label: 'The Kokoro logo: 心, the Japanese kanji for heart, painted with a dry brush. A tall stroke on the left, a long hooked stroke that ends in a splash, and two dots drawn as small hearts.',
    build: function (card, t) {
      card.innerHTML = hd('Logo', '心, heart') +
        '<div class="koc-lstage" aria-hidden="true"><div class="koc-logo">' +
          '<svg viewBox="0 0 1872 1109" focusable="false"><defs>' +
            STROKES.map(function (s, i) {
              return '<mask id="kocM' + i + '" maskUnits="userSpaceOnUse" x="-200" y="-200" width="2300" height="1500"><path class="koc-brush" pathLength="1" stroke-width="' + s[1] + '" d="' + s[0] + '"/></mask>';
            }).join('') +
          '</defs><g class="koc-whole">' +
            STROKES.map(function (s, i) {
              return '<image href="' + IMG + 'logo-stroke-' + (i + 1) + '.webp" width="1872" height="1109" mask="url(#kocM' + i + ')"/>';
            }).join('') +
          '</g>' +
            STROKES.map(function (s, i) {
              return '<text class="koc-num" x="' + s[3] + '" y="' + s[4] + '">' + (i + 1) + '</text>';
            }).join('') +
          '</svg>' +
        '</div></div>' +
        foot(2, 'The Kokoro logo', 'Kokoro');
      var B = card.querySelectorAll('.koc-brush');
      var NU = card.querySelectorAll('.koc-num');
      var W = card.querySelector('.koc-whole');
      var meta = metaOf(card, t);
      var MS = ['Kokoro', '心, the kanji for heart, in four brush strokes.'];
      var MH = ['Two hearts', 'Its two dots are painted as hearts.'];
      function paint(i) {
        return function () {
          B[i].style.transition = 'stroke-dashoffset ' + STROKES[i][2] + 'ms cubic-bezier(.5,0,.4,1)';
          B[i].classList.add('is-on');
          NU[i].classList.add('is-on');
        };
      }
      function hearts() {
        each(NU, function (n) { n.classList.remove('is-on'); });
        meta.to(MH, 1);
      }
      // The logo fades, then every stroke is wiped while it's out of sight
      function reset() {
        W.style.opacity = 0;
        t.at(800, function () {
          each(B, function (p) {
            p.style.transition = 'none';
            p.classList.remove('is-on');
          });
          W.style.opacity = 1;
        });
      }
      return {
        still: function () {
          each(B, function (p) {
            p.style.transition = 'none';
            p.classList.add('is-on');
          });
          meta.now(MH, 1);
        },
        play: function () {
          meta.to(MS, 0);
          seq(t, [
            [900, paint(0)],
            [STROKES[0][2] + 250, paint(1)],
            [STROKES[1][2] + 250, paint(2)],
            [STROKES[2][2] + 250, paint(3)],
            [2200, hearts],
            [6900, reset],
            [1200, function () { meta.to(MS, 0); }]
          ]);
        }
      };
    }
  };

  // ---------------------------------------------------------------------
  // Koko redrawn: the original Koko, then a soft crossfade (with a slight
  // blur) into the redraw, both in exactly the same place. The original
  // is Aiko's drawing: it only ever shows here, credited.
  // ---------------------------------------------------------------------
  CARDS.koko = {
    ctl: 'Koko redesign animation',
    label: 'Koko, Kokoro\'s lucky cat, before and after the redesign. Before: a white maneki-neko with a koi on her head, a red collar and a gold coin: original Koko by Aiko. After, redrawn by me: a cream cat with a dark tuft of hair, ear piercings, red eyeshadow, a black collar with a red bell, a rose tattoo and a tattoo sleeve, still smiling',
    build: function (card, t) {
      card.innerHTML = hd('Mascot', 'Koko, redrawn') +
        '<div class="koc-kstage" aria-hidden="true"><div class="koc-cat">' +
          '<img draggable="false" class="koc-old" src="' + IMG + 'koko-before.webp" width="984" height="1218" alt="" decoding="async">' +
          '<img draggable="false" class="koc-new" src="' + IMG + 'koko-after.webp" width="485" height="609" alt="" decoding="async">' +
        '</div></div>' +
        foot(2, 'Original Koko by Aiko, redrawn by me', 'Kokoro');
      var meta = metaOf(card, t);
      var M = [
        ['Before', 'A white lucky cat with a koi on her head, a red collar and a gold coin.'],
        ['After', 'Tattoos, piercings, a black collar and new proportions. Still smiling.']
      ];
      function before() {
        card.classList.remove('is-after');
        meta.to(M[0], 0);
      }
      function after() {
        card.classList.add('is-after');
        meta.to(M[1], 1);
      }
      return {
        still: function () {
          card.classList.add('is-after');
          meta.now(M[1], 1);
        },
        play: function () {
          before();
          seq(t, [
            [3000, after],
            [9100, before]
          ]);
        }
      };
    }
  };

  // ---------------------------------------------------------------------
  // Rockaholics: the poster printed up in its three inks, one pass at a
  // time, then set against Koko's usual colours
  // ---------------------------------------------------------------------
  var INKS = [
    ['Red', '#C22224', 'red', 'The border, the flames, the bell.'],
    ['Cream', '#F0E4AC', 'cream', 'Koko, the title, the dates and the skulls.'],
    ['Black', '#120E0E', 'black', 'The night behind it all, and every outline.']
  ];
  var USUAL = ['#F8F2EC', '#F87890', '#E00000', '#F8B018'];
  CARDS.rockaholics = {
    ctl: 'poster print animation',
    label: 'The Rockaholics poster for Kokoro, built up like a screen print in three inks: red, cream and black. Next to it, Kokoro\'s usual colours from the original lucky cat: off-white, pink, red and gold',
    build: function (card, t) {
      card.innerHTML = hd('Poster', 'Three inks') +
        '<div class="koc-pstage" aria-hidden="true">' +
          INKS.map(function (k) {
            return '<img draggable="false" class="koc-pl" src="' + IMG + 'ink-' + k[2] + '.webp" width="900" height="1200" alt="" decoding="async">';
          }).join('') +
        '</div>' +
        '<div class="koc-inks" aria-hidden="true"><p class="koc-h">Rockaholics</p>' +
          INKS.map(function (k) {
            return '<div class="koc-ink"><i style="background:' + k[1] + '"></i><span><b>' + k[0] + '</b><small>' + k[1] + '</small></span></div>';
          }).join('') +
        '</div>' +
        '<div class="koc-usual" aria-hidden="true"><p class="koc-h">Kokoro, usually</p><div>' +
          USUAL.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') +
        '</div></div>' +
        foot(4, '', 'Kokoro');
      var PL = card.querySelectorAll('.koc-pl');
      var IK = card.querySelectorAll('.koc-ink');
      var U = card.querySelector('.koc-usual');
      var meta = metaOf(card, t);
      var SUM = ['Three inks', 'Louder than Koko’s usual warm colours.'];
      function pass(i) {
        return function () {
          PL[i].classList.add('is-on');
          IK[i].classList.add('is-on');
          meta.to(['0' + (i + 1) + ' ' + INKS[i][0], INKS[i][3]], i);
        };
      }
      function sum() {
        U.classList.add('is-on');
        meta.to(SUM, 3);
      }
      function reset() {
        each(PL, function (p) { p.classList.remove('is-on'); });
        each(IK, function (p) { p.classList.remove('is-on'); });
        U.classList.remove('is-on');
        meta.hide();
      }
      return {
        still: function () {
          each(PL, function (p) { p.classList.add('is-on'); });
          each(IK, function (p) { p.classList.add('is-on'); });
          U.classList.add('is-on');
          meta.now(SUM, 3);
        },
        play: function () {
          seq(t, [
            [700, pass(0)],
            [2300, pass(1)],
            [2300, pass(2)],
            [2600, sum],
            [6500, reset]
          ]);
        }
      };
    }
  };

  C.mount('koc', CARDS);
})();
