// Something Wicked cards (049), rebuilt from the prototypes in the vault
// (reference/sw-*.html, as embedded in reference/sw-case-study-mockup.html).
// Every <figure class="media cs-card swc" data-swc="…"> in the case study
// becomes one card, so swapping a card is changing that attribute. Motion,
// timing, layout and text follow the prototypes. Styles:
// css/something-wicked.css. Frame, header, pause button, clock, the loop
// and when a card plays are shared with the other case studies:
// js/cards.js.

(function () {
  'use strict';

  var C = window.SWCards;
  var reflow = C.reflow;
  var hd = C.hd;
  var seq = C.seq;
  var IMG = '/img/something-wicked/';

  function src(a, b) {
    return '<div class="swc-src"><span>' + a + '</span>' + (b ? '<span>' + b + '</span>' : '') + '</div>';
  }
  function img(file, cls) {
    return '<img src="' + IMG + file + '" alt=""' + (cls ? ' class="' + cls + '"' : '') + ' decoding="async">';
  }
  function each(list, f) { Array.prototype.forEach.call(list, f); }

  var CARDS = {};

  // ---------------------------------------------------------------------
  // Logo construction: the guides draw in (the planchette's centre line,
  // the triangle, type lines, the eye circles, the ray fan from where the
  // rays really meet), then the mark inks in part by part; the guides step
  // back, a rest, it fades and starts again. The layers come from
  // OutlineSW.png, split in the prototype.
  // ---------------------------------------------------------------------
  var RAYS = [[173, 509], [258, 287], [407, 102], [607, -27], [837, -89], [995, -89], [1225, -27], [1425, 102], [1574, 287], [1659, 509]];
  var LAYERS = [
    ['ray', 'rays', 12.620, 0.000, 70.856, 31.285],
    ['tri', 'triangle', 18.610, 20.577, 61.658, 70.438],
    ['sig', 'sigil', 44.492, 25.233, 10.428, 10.568],
    ['word', 'wordmark', 14.064, 39.246, 73.957, 24.721],
    ['eye', 'eye', 34.332, 65.270, 30.053, 19.460],
    ['hand', 'hands', 0.000, 60.661, 100.000, 39.339]
  ];
  CARDS.logo = {
    ctl: 'logo construction animation',
    label: 'Construction of the Something Wicked logo: a planchette triangle holds the sigil and the wordmark, the eye sits below them, two skeleton hands frame it and the rays fan out from behind the sigil. Drawn by hand, so it is close to symmetrical but not mirrored exactly.',
    build: function (card, t) {
      function g(el, d, attrs) {
        return '<' + el + ' class="swc-g' + (d === 0 ? ' swc-ax' : '') + '" ' + attrs + ' pathLength="100" style="--d:' + d + 's"/>';
      }
      var guides =
        g('line', 0, 'x1="928" y1="60" x2="928" y2="2208"') +
        g('path', .25, 'd="M-95 1930 L928 442 L1951 1930 Z"') +
        g('line', .4, 'x1="-200" y1="1930" x2="2070" y2="1930"') +
        g('line', .55, 'x1="-200" y1="862" x2="2070" y2="862"') +
        g('line', .6, 'x1="-200" y1="1079" x2="2070" y2="1079"') +
        g('line', .65, 'x1="-200" y1="1374" x2="2070" y2="1374"') +
        g('circle', .75, 'cx="923" cy="1611" r="215"') +
        g('circle', .85, 'cx="923" cy="1611" r="128"') +
        g('circle', .95, 'cx="916" cy="667" r="12"') +
        RAYS.map(function (r, i) {
          return g('line', (1 + i * .05).toFixed(2), 'x1="916" y1="667" x2="' + r[0] + '" y2="' + r[1] + '"');
        }).join('');
      card.innerHTML = hd('Logo', 'Construction') +
        '<div class="swc-stage" aria-hidden="true">' +
          '<div class="swc-logo">' +
            '<svg class="swc-guides" viewBox="0 0 1870 2148" focusable="false">' + guides + '</svg>' +
            LAYERS.map(function (l) {
              return '<span class="swc-ly swc-' + l[0] + '" style="left:' + l[2] + '%;top:' + l[3] + '%;width:' + l[4] + '%;height:' + l[5] + '%">' + img('logo/' + l[1] + '.webp') + '</span>';
            }).join('') +
          '</div>' +
          '<span class="swc-note" style="left:52%;top:15.5%">drawn by hand</span>' +
        '</div>' +
        src('Built around the planchette, drawn by hand', 'Something Wicked, 2024');
      var stage = card.querySelector('.swc-stage');
      var S = ['is-on', 'is-s1', 'is-s2', 'is-s3', 'is-s4', 'is-s5', 'is-s6', 'is-done'];
      // Guides first, then the mark part by part; guides step back
      var STEPS = [[2100, 'is-s1'], [700, 'is-s2'], [500, 'is-s3'], [900, 'is-s4'], [600, 'is-s5'], [900, 'is-s6'], [1500, 'is-done']];
      function off() { S.forEach(function (c) { card.classList.remove(c); }); }
      function run() {
        stage.classList.remove('is-out');
        off();
        reflow(card);
        card.classList.add('is-on');
        var k = 0;
        (function next() {
          if (k >= STEPS.length) {
            // Rest, fade, and start again
            t.at(2500 + 800, function () {
              stage.classList.add('is-out');
              t.at(900, function () {
                off();
                t.at(400, run);
              });
            });
            return;
          }
          var s = STEPS[k++];
          t.at(s[0], function () {
            card.classList.add(s[1]);
            next();
          });
        })();
      }
      return {
        still: function () { S.forEach(function (c) { card.classList.add(c); }); },
        play: function () { t.at(300, run); }
      };
    }
  };

  // ---------------------------------------------------------------------
  // Light and dark: the mark on ink (screens), then a bone panel slides
  // over with the black version (print), and back
  // ---------------------------------------------------------------------
  CARDS.contrast = {
    ctl: 'light and dark animation',
    label: 'The Something Wicked logo works in white on ink for screens and in black on bone for print',
    build: function (card, t) {
      function panel(cls, file, lab, small, hex) {
        return '<div class="swc-p swc-p--' + cls + '">' +
          hd('Logo', 'Light and dark') +
          img(file) +
          '<div class="swc-lab">' + lab + '<small>' + small + '</small></div>' +
          src('One mark, both ways round', hex) +
        '</div>';
      }
      card.innerHTML =
        panel('dark', 'logo-white.webp', 'On ink', 'Screens: the site, socials', '#F2EEE6 on #0B0B0B') +
        panel('light', 'logo-black.webp', 'On bone', 'Print: business cards, stickers', '#0B0B0B on #F2EEE6');
      // The pause button turns ink on the bone panel
      var fig = card.parentNode;
      function light(on) {
        card.classList.toggle('is-light', on);
        fig.classList.toggle('is-light', on);
      }
      return {
        play: function () {
          seq(t, [
            [2600, function () { light(true); }],
            [2600 + 2500, function () { light(false); }]
          ]);
        }
      };
    }
  };

  // ---------------------------------------------------------------------
  // Logo levels: L1 steps down to L2, L3 and the favicon at 32 and 16px,
  // with the rule for each level
  // ---------------------------------------------------------------------
  CARDS.levels = {
    ctl: 'logo system animation',
    label: 'Something Wicked logo system in three levels: L1 the illustration for big moments, L2 the wordmark in the header, L3 SW on phones and as the favicon, down to 16 pixels',
    build: function (card, t) {
      var M = [
        ['L1', 'The illustration. Big moments only, like the About cards. Min. 160px wide.'],
        ['L2', 'The wordmark. The header from 760px up: Quinthero over Heartless.'],
        ['L3', 'SW, in Quinthero. The phone header, below 760px.'],
        ['16px', 'Still SW: the favicon at 32 and 16px, and the touch icon.']
      ];
      card.innerHTML = hd('Logo system', 'Three sizes') +
        '<div class="swc-lvstage" aria-hidden="true">' +
          '<div class="swc-lv">' + img('logo-white.webp') + '</div>' +
          '<div class="swc-lv"><div class="swc-wm"><b>SOMETHING</b><i>Wicked</i></div></div>' +
          '<div class="swc-lv"><div class="swc-sw">SW</div></div>' +
          '<div class="swc-lv"><div class="swc-fav">' +
            '<div class="swc-tab"><span class="swc-ico" style="width:32px;height:32px;font-size:20px">SW</span>32px</div>' +
            '<div class="swc-tab"><span class="swc-ico" style="width:16px;height:16px;font-size:10px;border-radius:2px">SW</span>16px</div>' +
          '</div></div>' +
        '</div>' +
        '<div class="swc-foot">' +
          '<div class="swc-dots" aria-hidden="true"><i></i><i></i><i></i><i></i></div>' +
          '<div class="swc-meta"><div class="swc-lvl"></div><div class="swc-rule"></div></div>' +
          src('The less room there is, the more it drops', 'Something Wicked, 2026') +
        '</div>';
      var V = card.querySelectorAll('.swc-lv');
      var D = card.querySelectorAll('.swc-dots i');
      var lvl = card.querySelector('.swc-lvl');
      var rule = card.querySelector('.swc-rule');
      var cur = 0;
      function mark(i) {
        each(D, function (d, k) { d.classList.toggle('is-on', k === i); });
      }
      function show(i) {
        var p = cur;
        each(V, function (v, k) {
          v.classList.toggle('is-on', k === i);
          v.classList.toggle('is-gone', k === p && k !== i);
        });
        mark(i);
        lvl.classList.add('is-hide');
        rule.classList.add('is-hide');
        t.at(350, function () {
          lvl.textContent = M[i][0];
          rule.textContent = M[i][1];
          lvl.classList.remove('is-hide');
          rule.classList.remove('is-hide');
        });
        cur = i;
        t.at(1200, function () { V[p].classList.remove('is-gone'); });
      }
      // L1 from the start
      V[0].classList.add('is-on');
      mark(0);
      lvl.textContent = M[0][0];
      rule.textContent = M[0][1];
      return {
        play: function () {
          seq(t, [
            [2800, function () { show(1); }],
            [2800, function () { show(2); }],
            [2800, function () { show(3); }],
            [2800 + 2500, function () { show(0); }]
          ]);
        }
      };
    }
  };

  // ---------------------------------------------------------------------
  // Typography: each font comes in with its role, loud ones on top, calm
  // ones below
  // ---------------------------------------------------------------------
  CARDS.type = {
    ctl: 'typography animation',
    label: 'Something Wicked typography: Quinthero and Heartless only in the logo and the hero, Archivo 900 condensed for headings, Outfit for body text and UI',
    build: function (card, t) {
      function sp(cls, name, role) {
        return '<div class="swc-sp swc-' + cls + '"><span class="swc-big">Aa</span><div class="swc-nm">' + name + '</div><div class="swc-ro">' + role + '</div></div>';
      }
      card.innerHTML = hd('Typography', 'Four fonts, two jobs') +
        '<div class="swc-grid" aria-hidden="true">' +
          '<div class="swc-row"><div class="swc-grp">The logo and the hero</div>' +
            sp('q', 'Quinthero', '\'SOMETHING\', the SW monogram') +
            sp('h', 'Heartless', '\'Wicked\'. Only ever one big word') +
          '</div>' +
          '<div class="swc-row"><div class="swc-grp">Everything else</div>' +
            sp('a', 'Archivo 900, 70% wide', 'Headings, uppercase') +
            sp('o', 'Outfit 300 to 800', 'Body text, nav, buttons') +
          '</div>' +
        '</div>' +
        '<span class="swc-note swc-note--type" aria-hidden="true">loud, then calm</span>' +
        src('Bold at the top, calm where the work is', 'Something Wicked, 2026');
      var S = card.querySelectorAll('.swc-sp');
      var note = card.querySelector('.swc-note');
      function on(i) { return function () { S[i].classList.add('is-v'); }; }
      function off() {
        each(S, function (s) { s.classList.remove('is-v'); });
        note.classList.remove('is-v');
      }
      return {
        still: function () {
          each(S, function (s) { s.classList.add('is-v'); });
          note.classList.add('is-v');
        },
        play: function () {
          seq(t, [
            [300, on(0)], [450, on(1)], [700, on(2)], [450, on(3)],
            [700, function () { note.classList.add('is-v'); }],
            [2600 + 2500, off],
            [1300, function () {}]
          ]);
        }
      };
    }
  };

  // ---------------------------------------------------------------------
  // Colour, built like the homepage hero: the headline in bone, an empty
  // polaroid drops in, the yellow lands on 'something wicked', then the
  // caution tape crosses. Keys below: name, hex, role.
  // ---------------------------------------------------------------------
  CARDS.colour = {
    ctl: 'colour animation',
    label: 'Something Wicked colours, shown like the homepage hero: Ink #0B0B0B for the page, Bone #F2EEE6 for text and paper, and Yellow #E8C547 as the one loud accent, on the words something wicked and the caution tape',
    build: function (card, t) {
      var K = [
        ['#0B0B0B', 'Ink', 'the page'],
        ['#F2EEE6', 'Bone', 'text and paper'],
        ['#E8C547', 'Yellow', 'one per section']
      ];
      card.innerHTML = hd('Colour', 'Ink, bone, one yellow') +
        '<div class="swc-art" aria-hidden="true">' +
          '<div class="swc-hl">' +
            '<span class="swc-ln"><span>Useful design</span></span>' +
            '<span class="swc-ln"><span>with <span class="swc-q">SOMETHING</span></span></span>' +
            '<span class="swc-ln"><span><span class="swc-h">Wicked</span> in it.</span></span>' +
          '</div>' +
          '<div class="swc-pol"><span class="swc-pt"></span><i></i></div>' +
          '<div class="swc-caution"></div>' +
          '<span class="swc-note swc-note--colour">an accent, not a fill</span>' +
        '</div>' +
        '<div class="swc-foot">' +
          '<div class="swc-keys">' + K.map(function (k) {
            return '<div class="swc-k" style="--c:' + k[0] + '"><i></i><b>' + k[1] + '</b><span>' + k[0] + '<br>' + k[2] + '</span></div>';
          }).join('') + '</div>' +
          src('Projects bring their own colour', 'Something Wicked, 2026') +
        '</div>';
      var ALL = ['is-v', 'is-p', 'is-y', 'is-t', 'is-n'];
      function add(c) { return function () { card.classList.add(c); }; }
      return {
        still: function () { ALL.forEach(function (c) { card.classList.add(c); }); },
        play: function () {
          // Headline, polaroid, yellow, tape, note; rest, then again
          seq(t, [
            [300, add('is-v')], [1100, add('is-p')], [1100, add('is-y')], [1100, add('is-t')], [1100, add('is-n')],
            [2500 + 1500, function () { ALL.forEach(function (c) { card.classList.remove(c); }); }],
            [1300, function () {}]
          ]);
        }
      };
    }
  };

  // ---------------------------------------------------------------------
  // References: one studio at a time, about 4s each. Their plain pattern
  // in an outlined box, a yellow arrow, then my version as a taped note.
  // ---------------------------------------------------------------------
  var REFS = [
    ['Koto', 'Opening a project like an app, and a Just seen state', 'the case study tears open like yellow paper'],
    ['Framna', 'Key numbers in a row of their own', 'set big in my own Archivo, not their serif'],
    ['G2K', 'Showing type as something that moves', 'a moving type card for every project']
  ];
  CARDS.refs = {
    ctl: 'references animation',
    label: 'What I took from Koto (opening a project like an app, and a Just seen state; mine tears open like yellow paper), Framna (key numbers in a row of their own; mine are set in my own Archivo, not their serif) and G2K (showing type as something that moves; mine is a moving type card for every project)',
    build: function (card, t) {
      card.innerHTML = hd('References', 'Borrowed, then made mine') +
        '<div class="swc-dots swc-dots--refs" aria-hidden="true"><i></i><i></i><i></i></div>' +
        '<div aria-hidden="true">' + REFS.map(function (r) {
          return '<div class="swc-sl">' +
            '<div class="swc-from">Borrowed from</div>' +
            '<div class="swc-st"><span>' + r[0] + '</span></div>' +
            '<div class="swc-pair">' +
              '<div class="swc-pat"><small>The pattern</small><p>' + r[1] + '</p></div>' +
              '<svg class="swc-ar" viewBox="0 0 40 12" focusable="false"><path d="M1 6 H37 M31 1 L38 6 L31 11" pathLength="100"/></svg>' +
              '<div class="swc-mine"><span class="swc-pt"></span><small>Made mine</small><p class="swc-hw">' + r[2] + '</p></div>' +
            '</div>' +
          '</div>';
        }).join('') + '</div>' +
        src('A shared language, with my own accent', 'Something Wicked, 2026');
      var S = card.querySelectorAll('.swc-sl');
      var D = card.querySelectorAll('.swc-dots i');
      var cur = -1;
      function go(i) {
        var n = S[i];
        if (cur >= 0) {
          var p = S[cur];
          p.classList.remove('is-a');
          p.classList.add('is-o');
          t.at(600, function () { p.classList.remove('is-o'); });
          t.at(520, function () { n.classList.add('is-a'); });
        } else {
          n.classList.add('is-a');
        }
        each(D, function (d, k) { d.classList.toggle('is-on', k === i); });
        cur = i;
      }
      return {
        still: function () { go(2); },
        play: function () {
          // Rest on the last one, then start again
          seq(t, [
            [300, function () { go(0); }],
            [4200, function () { go(1); }],
            [4200, function () { go(2); }],
            [4200 + 2500, function () {}]
          ]);
        }
      };
    }
  };

  // ---------------------------------------------------------------------
  // Before and after: the old homepage against the new one. A real range
  // input (arrow keys work) moves the handle; on first view the new site
  // wipes in once to halfway and stops. No loop.
  // ---------------------------------------------------------------------
  CARDS['before-after'] = {
    once: true,
    interactive: true,
    label: 'Before and after of the Something Wicked homepage',
    build: function (card, t) {
      card.innerHTML =
        '<img src="' + IMG + 'site-old.webp" width="1920" height="1000" alt="Before: the old homepage, a neutral editorial layout with the line \'Designing with people in mind.\' and no photo" decoding="async">' +
        '<img class="swc-after" src="' + IMG + 'site-new.webp" width="1920" height="1000" alt="After: the new homepage, \'Useful design with something wicked in it.\' in big type, my halftone photo on torn yellow paper and the caution tape" decoding="async">' +
        '<div class="swc-lay swc-lay--before" aria-hidden="true"><span class="swc-tag">Before</span></div>' +
        '<div class="swc-lay swc-after" aria-hidden="true"><span class="swc-tag swc-tag--after">After</span></div>' +
        '<input type="range" min="0" max="100" value="100" step="1" aria-label="Compare the old and new homepage: lower shows more of the new site">' +
        '<div class="swc-line" aria-hidden="true"><span class="swc-knob"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M9 6 3 12l6 6M15 6l6 6-6 6"/></svg></span></div>';
      var r = card.querySelector('input');
      function set(v) {
        card.style.setProperty('--p', v + '%');
        r.value = v;
      }
      set(100);
      r.addEventListener('input', function () {
        card.classList.remove('is-anim');
        set(r.value);
      });
      return {
        still: function () { set(50); },
        // The old site first, then the new one wipes in to halfway
        play: function () {
          card.classList.add('is-anim');
          t.frame(function () { t.frame(function () { set(50); }); });
          t.at(1700, function () { card.classList.remove('is-anim'); });
        }
      };
    }
  };

  C.mount('swc', CARDS);
})();
