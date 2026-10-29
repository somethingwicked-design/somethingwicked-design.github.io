// Health Potion cards (051), rebuilt from the prototypes in the vault
// (reference/hp-*.html). Every <figure class="media cs-card hpc"
// data-hpc="…"> in the case study becomes one card, so swapping a card is
// changing that attribute. Motion, timing, layout and text follow the
// prototypes. Styles: css/health-potion.css. Frame, header, pause button,
// clock, the loop, the hatching and when a card plays are shared with the
// other case studies: js/cards.js.
//
// Health Potion's own style: white, navy, Century Gothic. URW Gothic
// stands in for Century Gothic (with round dots, as Century Gothic's); the
// source lines and labels say so.

(function () {
  'use strict';

  var C = window.SWCards;
  var hd = C.hd;
  var seq = C.seq;
  var reflow = C.reflow;

  var each = C.each;

  // The bottom of every card (js/cards.js): a note on the stand-in
  // font stays on phones too
  function foot(n, a, b) { return C.foot('hpc', n, a, b, /URW Gothic/.test(b)); }
  var metaOf = C.metaOf;

  var CARDS = {};

  // ---------------------------------------------------------------------
  // Logo grid, De Bote style: pencil guides draw in, outlines, hand
  // hatching inside the letters and inside the flask's lines, then ink.
  // 2022: the name either side of the flask; the potion is hatched grey
  // and inks red, the bubbles stay white. 2024: the name stacked, with a
  // full stop, on its own guides. The lettering is URW Gothic converted to
  // outlines; the flask is redrawn with clean strokes from
  // Assets/HPFlask.svg.
  // ---------------------------------------------------------------------
  var LOGO_2022 = 'M22.61 174.64H30.28V157.28H45.06V174.64H52.74V133.26H45.06V149.94H30.28V133.26H22.61Z M60.69 174.64H82.92V167.3H68.36V157.67H82.3V150.34H68.36V140.59H82.92V133.26H60.69Z M86.39 174.64H94.85L99.44 163.94H114.17L118.59 174.64H127.05L109.69 133.26H103.64ZM102.24 156.61 106.66 144.06 111.09 156.61Z M131.25 174.64H151.58V167.3H138.92V133.26H131.25Z M160.14 174.64H167.82V140.59H175.49V133.26H152.47V140.59H160.14Z M179.41 174.64H187.08V157.28H201.86V174.64H209.54V133.26H201.86V149.94H187.08V133.26H179.41Z M418.93 174.64H426.6V158.9H429.06C434.94 158.9 437.63 158.46 439.93 157.06C443.29 154.93 445.36 150.78 445.36 146.02C445.36 141.26 443.34 137.34 439.76 135.16C437.41 133.76 434.61 133.26 429.18 133.26H418.93ZM426.6 151.57V140.59H429.18C431.7 140.59 432.87 140.7 434.05 140.98C436.29 141.6 437.63 143.56 437.63 146.14C437.63 148.15 436.74 149.72 435.11 150.62C433.94 151.23 431.86 151.57 428.84 151.57Z M470 132.53C457.68 132.53 448.16 141.88 448.16 153.98C448.16 165.96 457.79 175.37 469.94 175.37C481.98 175.37 491.28 166.02 491.28 153.98C491.28 142.05 481.82 132.53 470 132.53ZM469.89 139.92C477.56 139.92 483.55 146.08 483.55 154.03C483.55 162.04 477.73 167.98 469.89 167.98C462.05 167.98 455.89 161.82 455.89 153.98C455.89 145.97 461.94 139.92 469.89 139.92Z M501.58 174.64H509.26V140.59H516.93V133.26H493.91V140.59H501.58Z M520.85 174.64H528.52V133.26H520.85Z M556.24 132.53C543.92 132.53 534.4 141.88 534.4 153.98C534.4 165.96 544.03 175.37 556.18 175.37C568.22 175.37 577.52 166.02 577.52 153.98C577.52 142.05 568.06 132.53 556.24 132.53ZM556.13 139.92C563.8 139.92 569.79 146.08 569.79 154.03C569.79 162.04 563.97 167.98 556.13 167.98C548.29 167.98 542.13 161.82 542.13 153.98C542.13 145.97 548.18 139.92 556.13 139.92Z M583.57 174.64H591.24V144.57L608.54 174.64H617.11V133.26H609.44V163.38L592.3 133.26H583.57Z';
  var LOGO_2024 = 'M144.1 134.99H156.7V106.47H180.99V134.99H193.59V67.01H180.99V94.42H156.7V67.01H144.1Z M206.66 134.99H243.18V122.94H219.26V107.12H242.17V95.07H219.26V79.06H243.18V67.01H206.66Z M248.88 134.99H262.78L270.32 117.42H294.52L301.78 134.99H315.68L287.16 67.01H277.22ZM274.92 105.37 282.19 84.76 289.46 105.37Z M322.58 134.99H355.97V122.94H335.18V67.01H322.58Z M370.05 134.99H382.65V79.06H395.26V67.01H357.44V79.06H370.05Z M401.7 134.99H414.3V106.47H438.59V134.99H451.19V67.01H438.59V94.42H414.3V67.01H401.7Z M144.1 212.99H156.7V187.14H160.75C170.41 187.14 174.82 186.41 178.6 184.11C184.12 180.61 187.52 173.8 187.52 165.98C187.52 158.16 184.21 151.72 178.32 148.13C174.46 145.83 169.86 145.01 160.93 145.01H144.1ZM156.7 175.09V157.06H160.93C165.07 157.06 167 157.24 168.94 157.7C172.62 158.71 174.82 161.93 174.82 166.17C174.82 169.48 173.35 172.05 170.68 173.53C168.75 174.54 165.35 175.09 160.38 175.09Z M228 143.81C207.76 143.81 192.12 159.17 192.12 179.05C192.12 198.73 207.94 214.19 227.91 214.19C247.69 214.19 262.96 198.83 262.96 179.05C262.96 159.45 247.41 143.81 228 143.81ZM227.82 155.95C240.42 155.95 250.26 166.07 250.26 179.14C250.26 192.29 240.7 202.05 227.82 202.05C214.94 202.05 204.82 191.93 204.82 179.05C204.82 165.89 214.75 155.95 227.82 155.95Z M279.89 212.99H292.49V157.06H305.1V145.01H267.28V157.06H279.89Z M311.54 212.99H324.14V145.01H311.54Z M369.68 143.81C349.44 143.81 333.8 159.17 333.8 179.05C333.8 198.73 349.62 214.19 369.59 214.19C389.37 214.19 404.64 198.83 404.64 179.05C404.64 159.45 389.09 143.81 369.68 143.81ZM369.5 155.95C382.1 155.95 391.94 166.07 391.94 179.14C391.94 192.29 382.38 202.05 369.5 202.05C356.62 202.05 346.5 191.93 346.5 179.05C346.5 165.89 356.43 155.95 369.5 155.95Z M414.58 212.99H427.18V163.59L455.61 212.99H469.68V145.01H457.08V194.5L428.93 145.01H414.58Z';
  // The full stop is a circle, as Century Gothic's
  var STOP = 'cx="489.1" cy="206.9" r="6.7"';
  // The flask in its own units (placed by FLASK_AT): the heart-shaped
  // glass, the neck, the cap and its rim, the potion line, three bubbles
  var GLASS = 'M32.25 33.5 C29 30.6 24 29.1 19 29.1 C8 29.4 1.2 37 1.2 47.5 C1.2 55 4 62 9 68.5 C17 79 30 89.5 43.45 100.4 C56.9 89.5 69.9 79 77.9 68.5 C82.9 62 85.7 55 85.7 47.5 C85.7 37 78.9 29.4 67.9 29.1 C62.9 29.1 57.9 30.6 54.65 33.5 Z';
  var FLASK_AT = 'translate(229.7,40) scale(1.9456)';
  var POTION = 'M2.65 57.4 A40.8 3.9 0 0 1 84.25 57.4 L92 57.4 L92 104 L-2 104 L-2 57.4 Z';
  var BUBBLES = [[48.57, 82.38, 3.7], [23.97, 68.84, 2.9]];
  function flask(pl) {
    pl = pl ? ' pathLength="1"' : '';
    return '<path' + pl + ' d="M32.25 33.5 C29 30.6 24 29.1 19 29.1 C8 29.4 1.2 37 1.2 47.5 C1.2 55 4 62 9 68.5 C17 79 30 89.5 43.45 100.4"/>' +
      '<path' + pl + ' d="M54.65 33.5 C57.9 30.6 62.9 29.1 67.9 29.1 C78.9 29.4 85.7 37 85.7 47.5 C85.7 55 82.9 62 77.9 68.5 C69.9 79 56.9 89.5 43.45 100.4"/>' +
      '<path' + pl + ' d="M32.25 33.5 L32.25 22.1 M54.65 33.5 L54.65 22.1"/>' +
      '<path' + pl + ' d="M28.4 11.1 H58.5 V22.1 H28.4 Z"/>' +
      '<path' + pl + ' d="M36.3 11.1 L33.5 1.3 H53.4 L50.6 11.1"/>' +
      '<g clip-path="url(#hpcGlass)"><ellipse' + pl + ' cx="43.45" cy="57.4" rx="42" ry="3.9"/></g>' +
      '<circle class="hpc-ring"' + pl + ' cx="69.94" cy="41.8" r="5.2"/>' +
      BUBBLES.map(function (b) { return '<circle class="hpc-ring hpc-bub"' + pl + ' cx="' + b[0] + '" cy="' + b[1] + '" r="' + b[2] + '"/>'; }).join('');
  }
  function mask(id, inner) {
    return '<mask id="' + id + '" maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="280"><rect width="640" height="280" fill="#000"/>' + inner + '</mask>';
  }
  // Hatching as in the prototype: three bends a stroke, about 63deg
  function hatch(seed, box, o) {
    o.cls = 'hpc-sc';
    o.k = 2;
    o.jit = 1.4;
    o.op = [.6, .95];
    return C.hatching(C.rng(seed), box, o);
  }
  function line(x1, y1, x2, y2, cls) {
    return '<line' + (cls ? ' class="' + cls + '"' : ' pathLength="1"') + ' x1="' + x1 + '" x2="' + x2 + '" y1="' + y1 + '" y2="' + y2 + '"/>';
  }
  function note(x, y, s, end) {
    return '<text x="' + x + '" y="' + y + '"' + (end ? ' text-anchor="end"' : '') + '>' + s + '</text>';
  }

  CARDS.logo = {
    ctl: 'logo grid animation',
    label: 'Health Potion logo grid, 2022 to 2024. In 2022 the name sits either side of a heart-shaped potion flask, on one baseline, with equal gaps. In 2024 the flask is gone: HEALTH over POTION, left-aligned, with a full stop. The lettering is shown in URW Gothic, a close match for Century Gothic',
    build: function (card, t) {
      card.innerHTML = hd('Logo grid', '2022 to 2024') +
        '<div class="hpc-stage" aria-hidden="true">' +
          '<svg viewBox="0 0 640 280" focusable="false">' +
            '<defs>' +
              '<clipPath id="hpcGlass"><path d="' + GLASS + '"/></clipPath>' +
              mask('hpcMA', '<path fill="#fff" d="' + LOGO_2022 + '"/>') +
              // The potion, with the bubbles cut out
              mask('hpcML', '<g transform="' + FLASK_AT + '"><g clip-path="url(#hpcGlass)"><path fill="#fff" d="' + POTION + '"/></g>' +
                '<circle fill="#000" cx="48.57" cy="82.38" r="5"/><circle fill="#000" cx="23.97" cy="68.84" r="4.2"/></g>') +
              // The flask's lines: hatching only inside the white inner stroke
              mask('hpcMF', '<g transform="' + FLASK_AT + '" class="hpc-mfl">' + flask() + '</g>') +
              mask('hpcMB', '<path fill="#fff" d="' + LOGO_2024 + '"/><circle fill="#fff" ' + STOP + '/>') +
            '</defs>' +
            // 2022
            '<g class="hpc-sv">' +
              '<g class="hpc-gd">' +
                line(0, 174.6, 640, 174.6) + line(0, 133.3, 640, 133.3) +
                '<rect pathLength="1" x="229.7" y="40" width="169.4" height="198"/>' +
                line(314.4, 22, 314.4, 258, 'hpc-dash') +
                '<path pathLength="1" d="M213.7 119.3 v6 M213.7 122.3 H229.7 M229.7 119.3 v6 M399.1 119.3 v6 M399.1 122.3 H415.1 M415.1 119.3 v6"/>' +
                note(0, 190.6, 'baseline') + note(0, 127.3, 'cap height') + note(320.4, 20, 'centre') + note(417.1, 115.3, 'equal gaps') +
              '</g>' +
              '<g class="hpc-scribble" style="color:#1E1E1E" mask="url(#hpcMA)">' + hatch(22, { x1: 20, y1: 131, x2: 620, y2: 177 }, { n: 192, w: [1.04, 1.56], dur: .9 }) + '</g>' +
              '<g class="hpc-scribble" style="color:#5A5A5A" mask="url(#hpcML)">' + hatch(23, { x1: 230, y1: 144, x2: 398, y2: 237 }, { n: 67, w: [1.13, 1.68], dur: .7 }) + '</g>' +
              '<path class="hpc-gl" pathLength="1" style="color:#1E1E1E" d="' + LOGO_2022 + '"/>' +
              '<g transform="' + FLASK_AT + '">' +
                '<g clip-path="url(#hpcGlass)"><path class="hpc-liq" d="' + POTION + '"/></g>' +
                '<g class="hpc-ol hpc-olo">' + flask(true) + '</g>' +
                '<g class="hpc-ol hpc-oli">' + flask(true) + '</g>' +
              '</g>' +
              '<g class="hpc-scribble" style="color:#1E1E1E" mask="url(#hpcMF)">' + hatch(24, { x1: 228, y1: 38, x2: 401, y2: 238 }, { n: 125, w: [.64, .96], dur: .9 }) + '</g>' +
            '</g>' +
            // 2024
            '<g class="hpc-sv is-off">' +
              '<g class="hpc-gd">' +
                line(0, 135, 640, 135) + line(0, 213, 640, 213) +
                line(0, 67, 640, 67, 'hpc-dash') + line(0, 145, 640, 145, 'hpc-dash') +
                line(144.1, 20, 144.1, 262) +
                '<circle pathLength="1" cx="489.1" cy="206.9" r="13.7"/>' +
                note(640, 129, 'baseline', true) + note(640, 207, 'baseline', true) + note(150.1, 18, 'left edge') + note(507.9, 192.9, 'full stop') +
              '</g>' +
              '<g class="hpc-scribble" style="color:#213655" mask="url(#hpcMB)">' + hatch(25, { x1: 142, y1: 65, x2: 498, y2: 216 }, { n: 102, w: [1.28, 1.91], dur: .9 }) + '</g>' +
              '<path class="hpc-gl" pathLength="1" style="color:#213655" d="' + LOGO_2024 + '"/>' +
              '<circle class="hpc-gl" pathLength="1" style="color:#213655" ' + STOP + '/>' +
            '</g>' +
          '</svg>' +
        '</div>' +
        foot(2, 'From a flask to a full stop', 'Lettering in URW Gothic, a close match');
      var S = card.querySelectorAll('.hpc-sv');
      var A = S[0];
      var B = S[1];
      var meta = metaOf(card, t);
      var MA = ['2022', 'With the flask: the name either side of the heart, on one baseline.'];
      var MB = ['2024', 'Without: the name stacked and left-aligned, with a full stop.'];
      function reset(s) { s.classList.remove('is-on', 'is-hatched', 'is-settled'); }
      // One scene in, the other out; guides and outlines draw in
      function draw(s, o, m, i) {
        return function () {
          o.classList.add('is-off');
          s.classList.remove('is-off');
          t.at(800, function () { reset(o); });
          reset(s);
          reflow(s);
          s.classList.add('is-on');
          meta.to(m, i);
        };
      }
      function add(s, c) { return function () { s.classList.add(c); }; }
      return {
        still: function () {
          A.classList.add('is-off');
          B.classList.remove('is-off');
          B.classList.add('is-on', 'is-hatched', 'is-settled');
          meta.now(MB, 1);
        },
        play: function () {
          seq(t, [
            [0, draw(A, B, MA, 0)],
            [2100, add(A, 'is-hatched')],
            [1500, add(A, 'is-settled')],
            [3600, draw(B, A, MB, 1)],
            [2100, add(B, 'is-hatched')],
            [1500, add(B, 'is-settled')],
            [4200, function () {}]
          ]);
        }
      };
    }
  };

  // ---------------------------------------------------------------------
  // Colour, 2022 to 2024: one red splits into navy, blue and mauve, then
  // each fans out into its 80, 60 and 30% tints (values sampled from the
  // 2024 manual)
  // ---------------------------------------------------------------------
  // [colour, [tint, label colour] × 3]. Tint labels are white where that
  // keeps 4.5:1, else dark.
  var COLS = [
    ['#213655', [['#4C5C74', '#FFFFFF'], ['#788494', '#141414'], ['#B8C0CC', '#213655']]],
    ['#4378A2', [['#6890B4', '#141414'], ['#8CACC4', '#141414'], ['#C4D4E0', '#4A5468']]],
    ['#8A6B7D', [['#A08894', '#141414'], ['#B8A4B0', '#141414'], ['#DCD0D8', '#4A5468']]]
  ];
  CARDS.colour = {
    ctl: 'colour animation',
    label: 'Health Potion colour, 2022 to 2024. In 2022 the brand used one red, #A31C19. In 2024 it became three colours: navy #213655, blue #4378A2 and mauve #8A6B7D, each with tints at 80, 60 and 30 percent',
    build: function (card, t) {
      card.innerHTML = hd('Colour', '2022 to 2024') +
        '<div class="hpc-sw" aria-hidden="true">' + COLS.map(function (c) {
          return '<div class="hpc-col" style="--c:' + c[0] + '">' +
            '<div class="hpc-main"><span class="hpc-r">#A31C19</span><span class="hpc-h">' + c[0] + '</span></div>' +
            c[1].map(function (tn, k) {
              return '<div class="hpc-tint" style="background:' + tn[0] + ';color:' + tn[1] + '">' + [80, 60, 30][k] + '%</div>';
            }).join('') +
          '</div>';
        }).join('') + '</div>' +
        foot(3, 'From one red to a system', 'Health Potion, 2022-2024');
      var meta = metaOf(card, t);
      var M = [
        ['2022', 'One red, for everything.'],
        ['2024', 'A cooler system: navy, blue and mauve.'],
        ['Tints', 'Each colour at 80, 60 and 30%, so the three always work together.']
      ];
      function red() {
        card.classList.remove('is-split', 'is-tints');
        card.classList.add('is-red');
        meta.to(M[0], 0);
      }
      function split() {
        card.classList.remove('is-red');
        card.classList.add('is-split');
        meta.to(M[1], 1);
      }
      function tints() {
        card.classList.add('is-tints');
        meta.to(M[2], 2);
      }
      card.classList.add('is-red');
      return {
        still: function () {
          card.classList.remove('is-red');
          card.classList.add('is-split', 'is-tints');
          meta.now(M[2], 2);
        },
        play: function () {
          red();
          seq(t, [
            [2800, split],
            [2800, tints],
            [5200, function () { card.classList.remove('is-tints'); }],
            [800, red]
          ]);
        }
      };
    }
  };

  // ---------------------------------------------------------------------
  // Century Gothic: Aa with the four styles, the alphabet and numbers
  // typing in, then a heading set like the 2024 manual
  // ---------------------------------------------------------------------
  function chars(s) {
    return s.split(' ').map(function (c) { return '<i>' + c + '</i>'; }).join('');
  }
  CARDS.type = {
    ctl: 'typography animation',
    label: 'Century Gothic, the Health Potion typeface: Aa, the four styles bold, bold italic, italic and regular, the alphabet and numbers, and a heading set the way the 2024 manual does it. Shown in URW Gothic, a close match for Century Gothic',
    build: function (card, t) {
      card.innerHTML = hd('Typography', 'Century Gothic') +
        '<div class="hpc-ts" aria-hidden="true">' +
          '<div class="hpc-sc1">' +
            '<div class="hpc-aa">Aa</div>' +
            '<div class="hpc-sty">' +
              '<span style="font-weight:700"><small>Bold</small>Health Potion</span>' +
              '<span style="font-weight:700;font-style:italic"><small>Bold italic</small>Health Potion</span>' +
              '<span style="font-weight:400;font-style:italic"><small>Italic</small>Health Potion</span>' +
              '<span style="font-weight:400"><small>Regular</small>Health Potion</span>' +
            '</div>' +
          '</div>' +
          '<div class="hpc-sc2"><div class="hpc-chars">' +
            '<div class="hpc-b">' + chars('A B C D E F G H I J K L M N O P Q R S T U V W X Y Z') + '</div>' +
            '<div class="hpc-n">' + chars('a b c d e f g h i j k l m n o p q r s t u v w x y z') + '</div>' +
            '<div class="hpc-b">' + chars('0 1 2 3 4 5 6 7 8 9') + '</div>' +
            '<div class="hpc-n">' + chars('! ? &amp; @ # % * ( ) [ ] / + = : ; . , &#39; &quot;') + '</div>' +
          '</div></div>' +
          '<div class="hpc-sc3"><div class="hpc-hier">' +
            '<div class="hpc-h1">Corporate fonts<span>&amp; typographic rules.</span></div>' +
            '<div class="hpc-h2">PRIMARY FONT SELECTION FOR HEALTH POTION.</div>' +
            '<div class="hpc-bd">Century Gothic Bold for headings, the regular weight for running text.</div>' +
          '</div></div>' +
        '</div>' +
        foot(3, 'One family for everything', 'Shown in URW Gothic, a close match');
      var S = card.querySelectorAll('.hpc-ts > div');
      var CH = card.querySelectorAll('.hpc-chars i');
      var meta = metaOf(card, t);
      var M = [
        ['Century Gothic', 'One family, four styles: bold, bold italic, italic and regular.'],
        ['Characters', 'Round and geometric, from A to 9, and every sign in between.'],
        ['Hierarchy', 'A title in two colours, a subline, then the text.']
      ];
      // Every character after the last, 45ms apart, on the card's clock
      var typing = 0;
      function type(run, n) {
        if (run !== typing || n >= CH.length) return;
        CH[n].classList.add('is-on');
        t.at(45, function () { type(run, n + 1); });
      }
      function scene(i, now) {
        each(S, function (s, k) { s.classList.toggle('is-on', k === i); });
        if (now) meta.now(M[i], i);
        else meta.to(M[i], i);
        typing++;
        if (i === 1) {
          each(CH, function (c) { c.classList.remove('is-on'); });
          type(typing, 0);
        }
      }
      return {
        still: function () {
          each(CH, function (c) { c.classList.add('is-on'); });
          scene(2, true);
        },
        play: function () {
          scene(0);
          seq(t, [
            [4200, function () { scene(1); }],
            [4600, function () { scene(2); }],
            [5200, function () { scene(0); }]
          ]);
        }
      };
    }
  };

  C.mount('hpc', CARDS);
})();
