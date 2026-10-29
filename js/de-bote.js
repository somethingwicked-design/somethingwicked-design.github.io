// De Bote cards (047), rebuilt from the prototypes in the vault
// (reference/de-bote-*.html). Every <figure class="media cs-card dbc"
// data-dbc="…"> in the case study becomes one card, so swapping a card is
// changing that attribute. Motion, timing, colours, layout and text follow
// the prototypes. Styles: css/de-bote.css. Frame, header, pause button,
// clock and when a card plays are shared with the other case studies:
// js/cards.js.

(function () {
  'use strict';

  var C = window.SWCards;
  var reduce = C.reduce;
  var reflow = C.reflow;
  var hd = C.hd;
  var NS = 'http://www.w3.org/2000/svg';
  var IMG = '/img/de-bote/';

  function src(a, b) {
    return '<div class="dbc-src"><span>' + a + '</span>' + (b ? '<span>' + b + '</span>' : '') + '</div>';
  }
  function each(list, f) { Array.prototype.forEach.call(list, f); }

  var rng = C.rng;
  var f2 = C.f2;

  var CARDS = {};

  // ---------------------------------------------------------------------
  // Typography: the 'Aa' specimens play in once and stay; only the
  // headline and the columns fade and replay, so the card is never empty
  // ---------------------------------------------------------------------
  CARDS.type = {
    ctl: 'typography animation',
    label: 'De Bote typography: Playfair Display for headlines and EB Garamond for body text, shown in the front-page headline \'British Brothers Pioneer Dutch Phone Sex\' and its opening paragraph',
    build: function (card, t) {
      card.innerHTML = hd('Typography', 'Two typefaces') +
        '<div class="dbc-spec">' +
          '<div class="dbc-sp dbc-pf"><span class="dbc-aa"><span>Aa</span></span><div class="dbc-nm">Playfair Display</div><div class="dbc-role">headlines, standfirsts</div></div>' +
          '<div class="dbc-sp dbc-gm"><span class="dbc-aa"><span>Aa</span></span><div class="dbc-nm">EB Garamond</div><div class="dbc-role">body text, captions</div></div>' +
        '</div>' +
        '<div class="dbc-use">' +
          '<div class="dbc-hl"></div>' +
          '<div class="dbc-cols">' +
            '<p><span class="dbc-dc">I</span>n the mid-1980s, British brothers George and Harold Skene seized a groundbreaking business opportunity in the Netherlands with the introduction of 06 premium-rate phone numbers.</p>' +
            '<p>By the Skene brothers\' savvy marketing techniques, they used bold advertisements in print media, radio and television to draw attention to the new&nbsp;service.</p>' +
          '</div>' +
        '</div>' +
        src('Chosen for readability and a historical feel', 'Front page, De Bote');
      var use = card.querySelector('.dbc-use');
      var hl = card.querySelector('.dbc-hl');
      var chars = Array.prototype.map.call('British Brothers Pioneer Dutch Phone Sex', function (ch) {
        var s = document.createElement('span');
        s.textContent = ch;
        hl.appendChild(s);
        return s;
      });

      // The headline types on, a letter every 45ms
      function typeOn(done) {
        var k = 0;
        (function next() {
          chars[k++].classList.add('is-v');
          if (k < chars.length) t.at(45, next);
          else done();
        })();
      }
      // Set, a rest, the headline and columns fade, then type on again
      function set() {
        card.classList.add('is-set');
        t.at(2200 + 2500, function () {
          use.classList.add('is-fade');
          t.at(900, reset);
        });
      }
      function reset() {
        card.classList.remove('is-set');
        chars.forEach(function (c) { c.classList.remove('is-v'); });
        t.at(300, function () {
          use.classList.remove('is-fade');
          t.at(400, function () { typeOn(set); });
        });
      }
      return {
        still: function () {
          card.classList.add('is-on', 'is-set');
          chars.forEach(function (c) { c.classList.add('is-v'); });
        },
        play: function () {
          t.at(300, function () {
            card.classList.add('is-on');
            t.at(1600, function () { typeOn(set); });
          });
        }
      };
    }
  };

  // ---------------------------------------------------------------------
  // Colour: registration marks. Two printer's crosshairs draw in, then the
  // white, black and red circles slide in and overlap like print plates,
  // each with its name below
  // ---------------------------------------------------------------------
  CARDS.colour = {
    ctl: 'colour animation',
    label: 'The three De Bote colours: Anti-Flash White #F2F3F4 for the paper, Night Black #141414 for type and rules, Fire Engine Red #C8102E for the masthead and drop caps',
    build: function (card, t) {
      var COL = [
        { hex: '#F2F3F4', name: 'Anti-Flash White', role: 'the paper' },
        { hex: '#141414', name: 'Night Black', role: 'type and rules' },
        { hex: '#C8102E', name: 'Fire Engine Red', role: 'masthead, drop caps' }
      ];
      var X = ['0cqw', '27cqw', '54cqw'];
      var CROSS = '<svg viewBox="0 0 20 20" focusable="false"><circle cx="10" cy="10" r="5.5" pathLength="100"/><line x1="10" y1="0" x2="10" y2="20" pathLength="100"/><line x1="0" y1="10" x2="20" y2="10" pathLength="100"/></svg>';
      card.innerHTML = hd('Colour', 'Three colours') +
        '<div class="dbc-reg">' +
          COL.map(function (c, i) {
            return '<div class="dbc-dot' + (i ? '' : ' is-paper') + '" style="--c:' + c.hex + ';--x:' + X[i] + ';--x0:calc(' + X[i] + ' - 10cqw)"></div>';
          }).join('') +
          '<div class="dbc-cross" style="right:0;top:0">' + CROSS + '</div>' +
          '<div class="dbc-cross" style="left:0;bottom:-2cqw">' + CROSS + '</div>' +
        '</div>' +
        '<div class="dbc-labs">' + COL.map(function (c) {
          return '<div class="dbc-lab"><b>' + c.name + '</b><span>' + c.hex + '</span><i>' + c.role + '</i></div>';
        }).join('') + '</div>' +
        src('How provocative the 06 lines were', 'De Bote');
      var dots = card.querySelectorAll('.dbc-dot');
      var crosses = card.querySelectorAll('.dbc-cross');
      var labs = card.querySelectorAll('.dbc-lab');
      var all = [].concat.apply([], [dots, crosses, labs].map(function (l) { return Array.prototype.slice.call(l); }));
      function show(i) {
        dots[i].classList.add('is-v');
        t.at(600, function () { labs[i].classList.add('is-v'); });
      }
      // Crosshairs, then a plate every 0.8s; a rest, all out, and again
      function round() {
        t.at(300, function () { each(crosses, function (x) { x.classList.add('is-v'); }); });
        t.at(900, function () { show(0); });
        t.at(1700, function () { show(1); });
        t.at(2500, function () { show(2); });
        t.at(2500 + 1400 + 2500, function () {
          all.forEach(function (e) { e.classList.remove('is-v'); });
          t.at(1600, round);
        });
      }
      return {
        still: function () { all.forEach(function (e) { e.classList.add('is-v'); }); },
        play: round
      };
    }
  };

  // ---------------------------------------------------------------------
  // Telephone: no audio (the real clips aren't for a portfolio). The red
  // rotary phone rings, the handset lifts, the dial turns for each digit of
  // an 06 number, the line connects and a silent sound wave plays. The
  // digits after 06 stay dots, so it's never a real number.
  // ---------------------------------------------------------------------
  CARDS.phone = {
    ctl: 'telephone animation',
    label: 'The De Bote telephone: an 06 number is dialled, the line connects and the phone plays a recorded clip. An old telephone, rewired to play recorded clips, just like the real 06 lines.',
    build: function (card, t) {
      var R = '#C8102E';
      var K = '#141414';
      var W = '#F2F3F4';
      var cx = 110;
      var cy = 118;
      function pol(r, a) { return [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)]; }
      function circ(x, y, r) { return 'M' + (x - r) + ' ' + y + 'a' + r + ' ' + r + ' 0 1 0 ' + (2 * r) + ' 0a' + r + ' ' + r + ' 0 1 0 ' + (-2 * r) + ' 0Z'; }
      // The dial reads 0 to 9, with 0 next to the finger stop, like Luna's
      // own phone. Hole d (1-10) carries the digit d - 1.
      function holeA(d) { return 60 - 30 * d - 12; }
      var wheel = circ(cx, cy, 32);
      var digits = '';
      for (var d = 1; d <= 10; d++) {
        var h = pol(23, holeA(d));
        wheel += circ(h[0], h[1], 5.4);
        digits += '<text x="' + h[0].toFixed(1) + '" y="' + (h[1] + 2.6).toFixed(1) + '" text-anchor="middle" font-family="EB Garamond,Georgia,serif" font-size="7.5" font-weight="600" fill="' + K + '">' + (d - 1) + '</text>';
      }
      // The coiled cord, from the base to the handset
      var cord = 'M38 150';
      for (var i = 1; i <= 160; i++) {
        var s = i / 160;
        var u = 1 - s;
        var x = u * u * u * 38 + 3 * u * u * s * -6 + 3 * u * s * s * -6 + s * s * s * 24;
        var y = u * u * u * 150 + 3 * u * u * s * 150 + 3 * u * s * s * 78 + s * s * s * 62;
        var dx = -3 * u * u * 38 + 3 * (u * u - 2 * u * s) * -6 + 3 * (2 * u * s - s * s) * -6 + 3 * s * s * 24;
        var dy = -3 * u * u * 150 + 3 * (u * u - 2 * u * s) * 150 + 3 * (2 * u * s - s * s) * 78 + 3 * s * s * 62;
        var L = Math.hypot(dx, dy) || 1;
        var o = 5 * Math.sin(s * Math.PI * 2 * 11);
        cord += ' L' + (x - dy / L * o).toFixed(1) + ' ' + (y + dx / L * o).toFixed(1);
      }
      var stop1 = pol(29, 60);
      var stop2 = pol(40, 60);
      var phone = '<svg class="dbc-phone" viewBox="0 0 220 180" focusable="false">' +
        '<path d="' + cord + '" fill="none" stroke="' + K + '" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="M40 168L180 168Q192 168 189 157L166 72Q162 58 150 58L70 58Q58 58 54 72L31 157Q28 168 40 168Z" fill="' + R + '" stroke="' + K + '" stroke-width="2"/>' +
        '<rect x="92" y="157" width="36" height="7" fill="' + W + '" stroke="' + K + '" stroke-width="1"/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="35" fill="' + W + '" stroke="' + K + '" stroke-width="1.6"/>' + digits +
        '<g class="dbc-fw"><path d="' + wheel + '" fill="' + R + '" fill-rule="evenodd" stroke="' + K + '" stroke-width="1.4"/><circle cx="' + cx + '" cy="' + cy + '" r="10.5" fill="' + W + '" stroke="' + K + '" stroke-width="1.4"/></g>' +
        '<line x1="' + stop1[0] + '" y1="' + stop1[1] + '" x2="' + stop2[0] + '" y2="' + stop2[1] + '" stroke="' + K + '" stroke-width="3" stroke-linecap="round"/>' +
        '<g class="dbc-hs"><path d="M22 52Q20 34 40 32L180 32Q200 34 198 52L196 64Q194 73 184 71L172 65Q166 53 156 53L64 53Q54 53 48 65L36 71Q26 73 24 64Z" fill="' + R + '" stroke="' + K + '" stroke-width="2" stroke-linejoin="round"/></g>' +
        '</svg>';

      card.innerHTML = hd('Telephone', 'Interactive piece') +
        '<div class="dbc-stage">' +
          '<div class="dbc-num"><span class="dbc-pair"><span class="dbc-digit">0</span><span class="dbc-digit">6</span></span>' +
            '<span class="dbc-dots"><span></span><span></span><span></span><span></span><span></span><span></span></span></div>' +
          phone +
          '<div class="dbc-status"><span>Dialling</span><span>00:00</span></div>' +
          '<div class="dbc-wave"></div>' +
          '<p class="dbc-cap">An old telephone, rewired to play recorded clips, just like the real 06&nbsp;lines.</p>' +
        '</div>' +
        src('Rewired and programmed by me', 'The wicked part');

      var stage = card.querySelector('.dbc-stage');
      var ph = card.querySelector('.dbc-phone');
      var fw = card.querySelector('.dbc-fw');
      var wave = card.querySelector('.dbc-wave');
      var cap = card.querySelector('.dbc-cap');
      var st = card.querySelector('.dbc-status span');
      var tm = card.querySelector('.dbc-status span + span');
      var steps = card.querySelectorAll('.dbc-digit, .dbc-dots span');
      var bars = [];
      for (var k = 0; k < 36; k++) {
        var bar = document.createElement('i');
        wave.appendChild(bar);
        bars.push(bar);
      }
      // A fixed, speech-like envelope, so the wave looks like talking, not
      // noise
      function env(n) { return .35 + .65 * Math.abs(Math.sin(n * .55) * Math.cos(n * .17)); }
      function still() {
        bars.forEach(function (b, n) { b.style.height = (18 + 70 * env(n) * (.6 + .4 * Math.abs(Math.sin(n * 1.3)))) + '%'; });
      }
      function connected() { st.innerHTML = '<b>Connected</b>'; }

      // Each digit turns the dial to the finger stop and lets it spin back.
      // The holes for 0 and 6 (1 and 7), then six digits nobody sees.
      function dial(done) {
        var seq = [1, 7];
        for (var n = 0; n < 6; n++) seq.push(1 + Math.floor(Math.random() * 10));
        var j = 0;
        (function one() {
          if (j >= seq.length) { done(); return; }
          var r = 30 * seq[j] + 12;
          var dur = 380 + r * 1.5;
          t.anim(fw.animate([
            { transform: 'rotate(0deg)' },
            { transform: 'rotate(' + r + 'deg)', offset: .42, easing: 'cubic-bezier(.2,0,.4,1)' },
            { transform: 'rotate(0deg)', easing: 'cubic-bezier(.5,0,.3,1)' }
          ], { duration: dur }));
          var step = steps[j];
          t.at(dur * .42, function () { step.classList.add('is-v'); });
          t.at(dur + 120, function () { j++; one(); });
        })();
      }
      // The line connects: the wave talks for about 5s, the timer runs
      function talk(done) {
        wave.classList.add('is-live');
        connected();
        var n = 0;
        var frame = 0;
        (function tick() {
          n++;
          frame++;
          bars.forEach(function (b, m) {
            var s = Math.abs(Math.sin(frame * .9 + m * .7) * Math.sin(frame * .37 + m * .23));
            b.style.height = (8 + 84 * s * env(m + frame)) + '%';
          });
          tm.textContent = '00:0' + Math.min(9, Math.floor(n / 6));
          if (n === 10) cap.classList.add('is-v');
          if (n >= 30) { still(); done(); return; }
          t.at(160, tick);
        })();
      }
      function run() {
        stage.classList.remove('is-fade');
        ph.classList.remove('is-ring');
        reflow(ph);
        ph.classList.add('is-ring');
        t.at(1200, function () {
          ph.classList.add('is-off');
          t.at(800, function () {
            dial(function () {
              t.at(500, function () {
                talk(function () {
                  t.at(2500, function () {
                    stage.classList.add('is-fade');
                    t.at(900, reset);
                  });
                });
              });
            });
          });
        });
      }
      function reset() {
        ph.classList.remove('is-off', 'is-ring');
        each(steps, function (s) { s.classList.remove('is-v'); });
        wave.classList.remove('is-live');
        cap.classList.remove('is-v');
        bars.forEach(function (b) { b.style.height = '8%'; });
        st.textContent = 'Dialling';
        tm.textContent = '00:00';
        t.at(300, run);
      }
      return {
        still: function () {
          ph.classList.add('is-off');
          each(steps, function (s) { s.classList.add('is-v'); });
          wave.classList.add('is-live');
          still();
          cap.classList.add('is-v');
          connected();
          tm.textContent = '00:05';
        },
        play: function () { t.at(300, run); }
      };
    }
  };

  // ---------------------------------------------------------------------
  // Logo construction, from img/de-bote/logo.svg: first the lion alone,
  // large and centred, then the full logo in the same spot. Each scene:
  // pencil guides draw in, outlines, hand hatching inside the shapes, ink;
  // rest, fade, loop.
  // ---------------------------------------------------------------------

  // Pencil lines: a slight wobble along the way, like drawn by hand
  function pencilLine(r, x1, y1, x2, y2, n, amp) {
    var len = Math.hypot(x2 - x1, y2 - y1);
    var nx = -(y2 - y1) / len;
    var ny = (x2 - x1) / len;
    var p = [];
    for (var i = 0; i <= n; i++) {
      var k = i / n;
      var o = i && i < n ? (r() - .5) * 2 * amp : 0;
      p.push([x1 + (x2 - x1) * k + nx * o, y1 + (y2 - y1) * k + ny * o]);
    }
    return smooth(p);
  }
  function pencilCircle(r, x, y, rad, n, amp) {
    var p = [];
    for (var i = 0; i <= n; i++) {
      var a = i / n * Math.PI * 2 * .985;
      var o = i ? (r() - .5) * 2 * amp : 0;
      p.push([x + (rad + o) * Math.cos(a), y + (rad + o) * Math.sin(a)]);
    }
    return smooth(p);
  }
  // Through the points, with the curve bending at each one
  function smooth(p) {
    var d = 'M' + f2(p[0][0]) + ' ' + f2(p[0][1]);
    for (var i = 0; i < p.length - 1; i++) {
      d += ' Q' + f2(p[i][0]) + ' ' + f2(p[i][1]) + ' ' + f2((p[i][0] + p[i + 1][0]) / 2) + ' ' + f2((p[i][1] + p[i + 1][1]) / 2);
    }
    var e = p[p.length - 1];
    return d + ' L' + f2(e[0]) + ' ' + f2(e[1]);
  }
  CARDS.logo = {
    ctl: 'logo animation',
    label: 'The De Bote lion on its own, then the full logo, with its construction lines: a shared cap height and baseline, the lion from Leeuwarden\'s coat of arms on its own axis, overshooting both lines, and the round O overshooting slightly',
    build: function (card, t) {
      card.innerHTML = hd('Logo', 'Editorial identity') +
        '<div class="dbc-grp is-vis is-on is-settled"><div class="dbc-lstage"></div>' +
          '<div class="dbc-lnotes"><span class="is-l" style="top:50%">centre</span><span style="top:7.9%">overshoot</span><span style="top:92.1%">overshoot</span></div></div>' +
        '<div class="dbc-grp"><div class="dbc-mstage"></div>' +
          '<div class="dbc-notes"><span class="is-l" style="top:15.6%">cap height</span><span class="is-l" style="top:88.4%">baseline</span><span style="top:0">lion overshoot</span><span style="top:90.9%">round overshoot</span></div></div>' +
        src('Lion from Leeuwarden\'s coat of arms', 'Vectorised in Illustrator');
      var grps = card.querySelectorAll('.dbc-grp');
      var gL = grps[0];
      var gM = grps[1];

      // The guides, measured from the vector: [x1, y1, x2, y2] or a circle
      // [cx, cy, r]
      var LION_LINES = [
        [64.05, 21.9, 116.05, 21.9], [90.05, -4.1, 90.05, 47.9], [64.05, 0, 116.05, 0], [64.05, 43.8, 116.05, 43.8],
        [71.55, -4.1, 71.55, 47.9], [108.55, -4.1, 108.55, 47.9], [71.55, 0, 108.55, 43.8], [108.55, 0, 71.55, 43.8],
        [90.05, 21.9, 21.95], [90.05, 21.9, 13]
      ];
      var MARK_LINES = [
        [-8, 0, 250, 0], [-8, 5.72, 250, 5.72], [-8, 6.83, 250, 6.83], [-8, 38.71, 250, 38.71], [-8, 39.84, 250, 39.84], [-8, 43.8, 250, 43.8],
        [0, -5, 0, 49], [242.07, -5, 242.07, 49], [90.05, -5, 90.05, 49]
      ].concat([33.63, 36.4, 62.55, 71.55, 108.55, 115.65, 145.24, 147.67, 181.79, 184.33, 213.73, 215.95].map(function (x) {
        return [x, 3, x, 42];
      })).concat([
        [71.55, 0, 108.55, 43.8], [108.55, 0, 71.55, 43.8],
        [90.05, 21.9, 22.05], [90.05, 21.9, 14]
      ]);
      function guides(list, d0, step, amp, seed) {
        var r = rng(seed);
        return list.map(function (g, i) {
          // Long lines in 10 strokes, the short stems in 6
          var d = g.length === 4
            ? pencilLine(r, g[0], g[1], g[2], g[3], Math.hypot(g[2] - g[0], g[3] - g[1]) > 40 ? 10 : 6, amp)
            : pencilCircle(r, g[0], g[1], g[2], list === LION_LINES ? 20 : 16, amp * 2.5);
          return '<path class="dbc-ln" pathLength="1" style="--d:' + f2(d0 + i * step) + 's" d="' + d + '"/>';
        }).join('');
      }

      var ready = fetch(IMG + 'logo.svg').then(function (res) { return res.text(); }).then(function (text) {
        var doc = new DOMParser().parseFromString(text, 'image/svg+xml');
        // The shapes in reading order: D, E, the lion, B, O, T, E
        var shapes = Array.prototype.map.call(doc.querySelectorAll('path'), function (p) {
          var d = p.getAttribute('d');
          return { d: d, x: parseFloat(d.slice(1)) };
        });
        var lion = shapes[0].d;
        shapes.sort(function (a, b) { return a.x - b.x; });

        gL.querySelector('.dbc-lstage').innerHTML =
          '<svg viewBox="64.05 -4.1 52 52" focusable="false">' +
            '<defs><mask id="dbcLionMask" maskUnits="userSpaceOnUse" x="64.05" y="-4.1" width="52" height="52"><rect x="64.05" y="-4.1" width="52" height="52" fill="#000"/><path fill="#fff" fill-rule="evenodd" d="' + lion + '"/></mask></defs>' +
            '<g>' + guides(LION_LINES, .4, .08, .05, 7) + '</g>' +
            '<g class="dbc-scribble" mask="url(#dbcLionMask)">' + C.hatching(rng(11), { x1: 70, y1: -1, x2: 110, y2: 45 }, { cls: 'dbc-sc', n: 105, seg: 2.25, jit: .1, w: [.16, .26], dur: 1.4 }) + '</g>' +
            '<g><path class="dbc-gl" pathLength="1" style="--d:.9s" d="' + lion + '"/></g>' +
          '</svg>';
        gM.querySelector('.dbc-mstage').innerHTML =
          '<svg viewBox="0 0 242.07 43.81" preserveAspectRatio="xMidYMid meet" focusable="false">' +
            '<defs><mask id="dbcMarkMask" maskUnits="userSpaceOnUse" x="-20" y="-20" width="290" height="90"><rect x="-20" y="-20" width="290" height="90" fill="#000"/>' +
              shapes.map(function (s) { return '<path fill="#fff" fill-rule="evenodd" d="' + s.d + '"/>'; }).join('') + '</mask></defs>' +
            '<g>' + guides(MARK_LINES, 0, .06, .12, 3) + '</g>' +
            '<g class="dbc-scribble" mask="url(#dbcMarkMask)">' + C.hatching(rng(5), { x1: -2, y1: -2, x2: 244.07, y2: 45.81 }, { cls: 'dbc-sc', n: 217, seg: 4.8, jit: .25, w: [.32, .5], dur: 1.6 }) + '</g>' +
            '<g>' + shapes.map(function (s, i) { return '<path class="dbc-gl" pathLength="1" style="--d:' + f2(i * .12) + 's" d="' + s.d + '"/>'; }).join('') + '</g>' +
          '</svg>';
      });

      // One scene: guides and outlines, then hatching, then ink; a rest,
      // fade out, then the next scene in the same spot
      function scene(g, next) {
        g.classList.remove('is-on', 'is-hatched', 'is-settled');
        reflow(g);
        g.classList.add('is-vis');
        t.at(200, function () {
          g.classList.add('is-on');
          t.at(2600, function () {
            g.classList.add('is-hatched');
            t.at(2400, function () {
              g.classList.add('is-settled');
              t.at(1300 + 2500, function () {
                g.classList.remove('is-vis');
                t.at(1000, function () {
                  g.classList.remove('is-on', 'is-hatched', 'is-settled');
                  next();
                });
              });
            });
          });
        });
      }
      function run() { scene(gL, function () { scene(gM, run); }); }
      return {
        still: function () {
          gL.classList.remove('is-vis');
          gM.classList.add('is-vis', 'is-on', 'is-settled');
        },
        play: function () { ready.then(function () { t.at(300, run); }); }
      };
    }
  };

  // ---------------------------------------------------------------------
  // Newspaper: the front page alone, then it opens into spreads 02-03,
  // 04-05 and 06-07, pages turning right to left; a rest, it closes, and
  // again. Hover or focus holds it.
  // ---------------------------------------------------------------------
  CARDS.newspaper = {
    ctl: 'newspaper pages',
    label: 'De Bote, a seven-page newspaper about Teleholding, the Skene brothers and censorship, shown page by page',
    build: function (card, t, ctx) {
      function page(n) {
        return '<img src="' + IMG + 'pages/page-' + n + '.webp" width="776" height="1100" alt="" loading="lazy" decoding="async">';
      }
      // Leaves: front page | 2, 3 | 4, 5 | 6, with page 7 underneath
      var PAIRS = [[1, 2], [3, 4], [5, 6]];
      var LABEL = ['Front page', '02-03', '04-05', '06-07'];
      card.innerHTML = hd('Newspaper', 'Seven pages, as spreads') +
        '<div class="dbc-book is-closed">' +
          '<div class="dbc-shade"></div>' +
          '<div class="dbc-base">' + page(7) + '</div>' +
          PAIRS.map(function (p, k) {
            return '<div class="dbc-leaf" style="z-index:' + (10 - k) + '"><div class="dbc-face">' + page(p[0]) + '</div><div class="dbc-face is-back">' + page(p[1]) + '</div></div>';
          }).join('') +
          '<div class="dbc-spine"></div>' +
        '</div>' +
        '<div class="dbc-count"><b></b><span>/ 07</span></div>' +
        '<div class="dbc-src">Edited and laid out in InDesign</div>';
      var book = card.querySelector('.dbc-book');
      var leaves = card.querySelectorAll('.dbc-leaf');
      var num = card.querySelector('.dbc-count b');

      // The count rolls up to the next label
      function setNum(i) {
        each(num.children, function (s) {
          s.className = 'is-out';
          setTimeout(function () { s.remove(); }, 900);
        });
        var s = document.createElement('span');
        s.textContent = LABEL[i];
        s.className = 'is-down';
        num.appendChild(s);
        reflow(s);
        s.className = '';
      }
      var i = 0;
      function turn() {
        if (i < leaves.length) {
          var l = leaves[i];
          l.style.zIndex = 20 + i;
          l.classList.add('is-turned');
          if (i === 0) book.classList.remove('is-closed');
          i++;
          setNum(i);
          t.at(i === leaves.length ? 3000 + 2500 : 3000, turn);
          return;
        }
        // Close the paper again
        book.style.transition = 'opacity .6s';
        book.style.opacity = 0;
        t.at(650, function () {
          book.classList.add('is-reset');
          each(leaves, function (l, k) {
            l.classList.remove('is-turned');
            l.style.zIndex = 10 - k;
          });
          book.classList.add('is-closed');
          reflow(book);
          book.classList.remove('is-reset');
          book.style.opacity = 1;
          setTimeout(function () { book.style.transition = ''; }, 700);
          i = 0;
          setNum(0);
          t.at(2500, turn);
        });
      }
      setNum(0);
      C.holdOnHover(card.parentNode, ctx.hold);
      return {
        play: function () {
          // The pages under the front page load now, before they turn
          each(card.querySelectorAll('img'), function (im) { im.loading = 'eager'; });
          t.at(2000, turn);
        }
      };
    }
  };

  // ---------------------------------------------------------------------
  // Timeline, from the TLDR flyer (copy lightly tidied for grammar): the
  // red line runs along the years and each comes up large with its event,
  // about 3s each, a rest on 2002. The years are buttons: picking one
  // shows it and pauses the loop.
  // ---------------------------------------------------------------------
  CARDS.timeline = {
    ctl: 'timeline',
    interactive: true,
    label: 'De Bote timeline, 1986 to 2002',
    build: function (card, t, ctx) {
      var E = [
        ['1986', 'Teleholding is formed by the brothers George and Harold Skene.'],
        ['1988', 'With rising demand, Teleholding grows significantly.'],
        ['1992', 'Violence and public disturbances over rival phone lines lead to protests and calls for regulation.'],
        ['1993', 'The submarine Walrus burns. The 06 lines overload the phone network, so PTT takes their lines as punishment.'],
        ['1994', 'Menno Buch gets Teleholding on TV and talks about the incident that cost the country about 225 million guilders.'],
        ['2000', 'Technology evolves, and Teleholding declines.'],
        ['2002', 'Teleholding ceases its operations, marking the end of an era.']
      ];
      card.innerHTML = hd('Timeline', 'From the TLDR flyer') +
        '<div class="dbc-ttl">Important dates and numbers</div>' +
        '<div class="dbc-axis"><div class="dbc-line"></div><div class="dbc-prog"></div></div>' +
        '<div class="dbc-big" aria-hidden="true"></div>' +
        '<p class="dbc-txt" aria-live="polite"></p>' +
        src('Teleholding, 1986 to 2002', 'TLDR flyer, De Bote');
      var axis = card.querySelector('.dbc-axis');
      var prog = card.querySelector('.dbc-prog');
      var big = card.querySelector('.dbc-big');
      var txt = card.querySelector('.dbc-txt');
      // Evenly spaced, like the flyer
      function pos(i) { return i / (E.length - 1) * 92 + 4; }
      var years = E.map(function (e, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'dbc-yr';
        b.style.left = pos(i) + '%';
        b.innerHTML = '<i></i><b>' + e[0] + '</b>';
        b.setAttribute('aria-label', e[0] + ': ' + e[1]);
        b.addEventListener('click', function () {
          go(i);
          t.clear();
          t.at(600, step);
          ctx.pause();
        });
        axis.appendChild(b);
        return b;
      });

      var cur = -1;
      function go(i) {
        if (i === cur) return;
        years.forEach(function (b, k) {
          b.classList.toggle('is-on', k === i);
          b.classList.toggle('is-past', k < i);
        });
        prog.style.setProperty('--p', pos(i) + '%');
        var old = big.querySelector('span:not(.is-old)');
        if (old && !reduce) {
          old.classList.add('is-old');
          requestAnimationFrame(function () { old.classList.add('is-out'); });
          setTimeout(function () { old.remove(); }, 850);
        } else if (old) {
          old.remove();
        }
        var n = document.createElement('span');
        n.textContent = E[i][0];
        if (!reduce) n.className = 'is-in';
        big.appendChild(n);
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { n.classList.remove('is-in'); });
        });
        txt.classList.add('is-hide');
        setTimeout(function () {
          txt.textContent = E[i][1];
          txt.classList.remove('is-hide');
        }, reduce ? 0 : 350);
        cur = i;
      }
      function step() {
        var nx = (cur + 1) % E.length;
        go(nx);
        t.at(nx === E.length - 1 ? 3200 + 2500 : 3200, step);
      }
      go(0);
      return {
        play: function () {
          t.clear();
          t.at(3200, step);
        }
      };
    }
  };

  C.mount('dbc', CARDS);
})();
