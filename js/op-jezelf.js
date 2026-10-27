// Op Jezelf cards (043, 044, 045), rebuilt from the prototypes in the vault
// (reference/op-jezelf-*.html). Every <figure class="media ojc"
// data-ojc="…"> in the case study becomes one card, so swapping a card is
// changing that attribute. Motion, timing, colours, layout and text follow
// the prototypes. Cards only move while on screen (start when a fifth is in
// view, stop once fully out) and stand still and complete with reduced
// motion. Styles: css/op-jezelf.css.

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IMG = '/img/op-jezelf/cards/';

  // Poppins A and a, Regular to Bold, made point-compatible (043): per
  // weight, contours of [start, [[cx, cy, x, y, onCurve], …]]
  var GLYPHS = {"400":{"A":[[[489,155],[[337,155,185,155,1],[157,78,129,0,1],[81,0,33,0,1],[159,346,285,693,1],[338,693,390,693,1],[516,346,641,0,1],[593,0,545,0,1],[517,78,489,155,1]]],[[463,229],[[400,405,337,581,1],[274,405,211,229,1],[337,229,463,229,1]]]],"a":[[[303,557],[[375,557,428,526,0],[481,495,507,448,1],[507,498,507,548,1],[553,548,599,548,1],[599,274,599,0,1],[553,0,507,0,1],[507,51,507,102,1],[480,54,426,22,0],[373,-9,302,-9,1],[229,-9,170,27,0],[111,63,77,128,0],[43,193,43,276,1],[43,360,77,424,0],[111,487,170,522,0],[230,557,303,557,1]]],[[321,478],[[270,478,228,454,0],[186,430,161,384,0],[136,338,136,276,1],[136,213,161,166,0],[186,120,228,96,0],[270,71,321,71,1],[372,71,414,96,0],[457,120,482,166,0],[507,213,507,275,1],[507,337,482,383,0],[457,429,414,454,0],[372,478,321,478,1]]]]},"500":{"A":[[[494,142],[[348,142,203,142,1],[178,71,153,0,1],[94,0,34,0,1],[158,348,283,696,1],[349,696,415,696,1],[540,348,664,0,1],[604,0,544,0,1],[519,71,494,142,1]]],[[462,235],[[406,396,349,558,1],[292,396,235,235,1],[348,235,462,235,1]]]],"a":[[[297,560],[[362,560,410,534,0],[459,509,488,471,1],[488,511,488,551,1],[546,551,603,551,1],[603,276,603,0,1],[546,0,488,0,1],[488,41,488,82,1],[459,43,409,17,0],[359,-9,295,-9,1],[224,-9,165,28,0],[106,64,72,130,0],[37,195,37,278,1],[37,361,72,425,0],[106,489,166,524,0],[225,560,297,560,1]]],[[321,461],[[277,461,239,440,0],[201,418,178,376,0],[154,335,154,278,1],[154,221,178,178,0],[201,135,240,112,0],[278,90,321,90,1],[365,90,403,112,0],[441,134,464,176,0],[488,219,488,276,1],[488,333,464,375,0],[441,417,403,439,0],[365,461,321,461,1]]]]},"600":{"A":[[[497,133],[[358,133,219,133,1],[196,66,173,0,1],[100,0,26,0,1],[152,350,277,699,1],[358,699,440,699,1],[566,350,691,0,1],[617,0,543,0,1],[520,66,497,133,1]]],[[459,245],[[408,391,358,537,1],[308,391,257,245,1],[358,245,459,245,1]]]],"a":[[[286,563],[[348,563,394,538,0],[441,513,469,475,1],[469,514,469,554,1],[540,554,610,554,1],[610,277,610,0,1],[540,0,469,0,1],[469,40,469,81,1],[442,42,394,16,0],[347,-9,285,-9,1],[215,-9,158,27,0],[100,63,66,128,0],[33,194,33,279,1],[33,363,66,428,0],[100,493,158,528,0],[215,563,286,563,1]]],[[322,440],[[283,440,250,421,0],[217,402,196,366,0],[176,329,176,279,1],[176,229,196,192,0],[217,154,250,134,0],[284,114,322,114,1],[361,114,395,134,0],[429,153,449,190,0],[469,226,469,277,1],[469,328,449,364,0],[429,401,395,420,0],[361,440,322,440,1]]]]},"700":{"A":[[[499,124],[[368,124,237,124,1],[216,62,195,0,1],[106,0,16,0,1],[143,351,270,702,1],[369,702,468,702,1],[595,351,722,0,1],[632,0,541,0,1],[520,62,499,124,1]]],[[455,256],[[412,384,368,513,1],[325,384,282,256,1],[368,256,455,256,1]]]],"a":[[[274,566],[[333,566,378,542,0],[422,518,446,479,1],[446,518,446,558,1],[532,558,617,558,1],[617,279,617,0,1],[532,0,446,0,1],[446,40,446,79,1],[421,40,376,16,0],[332,-8,273,-8,1],[205,-8,149,28,0],[93,63,60,128,0],[28,194,28,280,1],[28,366,60,431,0],[93,496,149,531,0],[205,566,274,566,1]]],[[324,417],[[273,417,238,380,0],[220,362,211,337,0],[202,312,202,280,1],[202,248,211,223,0],[220,197,238,178,0],[273,141,324,141,1],[375,141,410,178,0],[428,196,437,222,0],[446,247,446,279,1],[446,311,437,336,0],[428,362,410,380,0],[375,417,324,417,1]]]]}};

  var NS = 'http://www.w3.org/2000/svg';
  var SLIDE = 1600; // the shared rhythm: 1.6s move, 1.6s rest

  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function reflow(el) { return el.offsetWidth; }

  // Timers and frames that all stop at once when the card leaves the screen
  function clock() {
    var gen = 0;
    var ids = [];
    return {
      at: function (ms, f) {
        var g = gen;
        ids.push(setTimeout(function () { if (g === gen) f(); }, ms));
      },
      frame: function (f) {
        var g = gen;
        requestAnimationFrame(function (n) { if (g === gen) f(n); });
      },
      stop: function () {
        gen++;
        ids.forEach(clearTimeout);
        ids = [];
      }
    };
  }

  // ---------------------------------------------------------------------
  // Shared parts
  // ---------------------------------------------------------------------
  function hd(left) {
    return '<div class="ojc-hd"><span>' + left + '</span><span>Op Jezelf</span></div>';
  }
  function src(a, b) {
    return '<div class="ojc-src"><span>' + a + '</span>' + (b ? '<span>' + b + '</span>' : '') + '</div>';
  }

  // Panels that slide over each other from the right (colour, personas)
  function slider(panels, onGo) {
    var z = 1;
    var i = 0;
    panels[0].style.zIndex = z;
    panels[0].classList.add('is-show');
    return {
      index: function () { return i; },
      go: function (n) {
        if (n === i) return;
        var prev = panels[i];
        i = n;
        var p = panels[n];
        p.classList.remove('is-slide', 'is-show');
        p.style.zIndex = ++z;
        reflow(p);
        p.classList.add('is-slide', 'is-show');
        setTimeout(function () {
          if (prev !== panels[i]) prev.classList.remove('is-slide', 'is-show');
        }, SLIDE + 100);
        if (onGo) onGo(n);
      }
    };
  }

  // A word that changes in place (type weight, Before/After)
  function roll(box, text, weight, gone) {
    Array.prototype.forEach.call(box.children, function (s) {
      s.className = 'is-out';
      setTimeout(function () { s.remove(); }, gone);
    });
    var s = document.createElement('span');
    s.textContent = text;
    if (weight) s.style.fontWeight = weight;
    s.className = 'is-down';
    box.appendChild(s);
    reflow(s);
    s.className = 'is-in';
  }
  function rollStill(box, text, weight) {
    box.innerHTML = '';
    var s = document.createElement('span');
    s.textContent = text;
    if (weight) s.style.fontWeight = weight;
    s.className = 'is-in';
    box.appendChild(s);
  }

  // Back to the first frame without animating (off screen only)
  function snap(card, f) {
    card.classList.add('is-snap');
    f();
    reflow(card);
    card.classList.remove('is-snap');
  }

  // ---------------------------------------------------------------------
  // The cards. build(card, t) fills the card and returns start (and
  // optionally stop); under reduced motion start is never called.
  // ---------------------------------------------------------------------
  var CARDS = {};

  // Typeface (043): 'Poppins / Op Jezelf' in Bold, the weight word next to
  // it, and the big Aa outline blending between the weights
  CARDS.type = {
    label: 'Poppins, the Op Jezelf typeface: Op Jezelf in Bold, next to the weight in use as it changes from Regular to Medium, SemiBold and Bold, over a big outlined Aa that shifts weight with it',
    build: function (card, t) {
      var WS = [400, 500, 600, 700];
      var NAMES = { 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold' };
      var SEQ = [400, 500, 600, 700, 600, 500];
      // Luna's settings from the sliders (043), in a 1000-unit card
      var AA = { x: -106, y: 983, size: 1.07, aRatio: .61, gap: 34 };

      card.innerHTML = hd('Typeface') +
        '<div class="ojc-name"><div>Poppins</div><div class="ojc-l2"><span>Op Jezelf</span><span class="ojc-roll"></span></div></div>' +
        '<svg viewBox="0 0 1000 1000" focusable="false"><g></g></svg>';
      var box = card.querySelector('.ojc-roll');
      var aa = card.querySelector('g');

      function bracket(w) {
        w = Math.max(400, Math.min(700, w));
        var i = Math.min(2, Math.floor((w - 400) / 100));
        return [String(WS[i]), String(WS[i + 1]), (w - WS[i]) / 100];
      }
      // The outline of one glyph at any weight, plus its on-curve points
      function glyph(ch, w) {
        var b = bracket(w);
        var c0 = GLYPHS[b[0]][ch];
        var c1 = GLYPHS[b[1]][ch];
        var k = b[2];
        var d = '';
        var pts = [];
        var minX = 1e9;
        var maxX = -1e9;
        c0.forEach(function (ct, n) {
          var s = [lerp(ct[0][0], c1[n][0][0], k), lerp(ct[0][1], c1[n][0][1], k)];
          d += 'M' + s[0].toFixed(1) + ' ' + (-s[1]).toFixed(1);
          pts.push(s);
          ct[1].forEach(function (sg, i) {
            var o = c1[n][1][i];
            var q = [0, 1, 2, 3].map(function (j) { return lerp(sg[j], o[j], k); });
            minX = Math.min(minX, q[0], q[2]);
            maxX = Math.max(maxX, q[0], q[2]);
            d += 'Q' + q[0].toFixed(1) + ' ' + (-q[1]).toFixed(1) + ' ' + q[2].toFixed(1) + ' ' + (-q[3]).toFixed(1);
            if (sg[4] && o[4]) pts.push([q[2], q[3]]);
          });
          d += 'Z';
        });
        return { d: d, pts: pts, minX: minX, maxX: maxX };
      }

      var parts = ['A', 'a'].map(function () {
        var g = document.createElementNS(NS, 'g');
        var p = document.createElementNS(NS, 'path');
        p.setAttribute('class', 'ojc-outline');
        g.appendChild(p);
        aa.appendChild(g);
        return { g: g, p: p, r: [] };
      });
      // The A and a move as one pair, with a fixed gap at every weight
      function render(w) {
        var gA = glyph('A', w);
        var ga = glyph('a', w);
        var sA = AA.size;
        var sa = AA.size * AA.aRatio;
        var xA = AA.x;
        var xa = xA + gA.maxX * sA + AA.gap - ga.minX * sa;
        [[gA, xA, sA], [ga, xa, sa]].forEach(function (set, i) {
          var gl = set[0];
          var P = parts[i];
          P.p.setAttribute('d', gl.d);
          P.g.setAttribute('transform', 'translate(' + set[1] + ',' + AA.y + ') scale(' + set[2] + ')');
          while (P.r.length < gl.pts.length) {
            var r = document.createElementNS(NS, 'rect');
            r.setAttribute('class', 'ojc-anchor');
            r.setAttribute('width', 16);
            r.setAttribute('height', 16);
            P.g.appendChild(r);
            P.r.push(r);
          }
          P.r.forEach(function (r, n) {
            var q = gl.pts[n];
            r.setAttribute('x', q[0] - 8);
            r.setAttribute('y', -q[1] - 8);
          });
        });
      }

      var cur = 400;
      var idx = 0;
      render(400);
      rollStill(box, NAMES[400], 400);

      // Regular, Medium, SemiBold, Bold and back: each step eases over
      // 1.6s, then rests 1.6s
      function step() {
        var from = cur;
        var to = SEQ[(++idx) % SEQ.length];
        roll(box, NAMES[to], to, SLIDE);
        var t0 = performance.now();
        t.frame(function f(n) {
          var k = Math.min(1, (n - t0) / SLIDE);
          cur = from + (to - from) * ease(k);
          render(cur);
          if (k < 1) t.frame(f);
          else t.at(SLIDE, step);
        });
      }
      return {
        start: function () { t.at(SLIDE, step); }
      };
    }
  };

  // Colour (044): each colour slides over the card in turn, the marker
  // slides along the swatches
  CARDS.colour = {
    label: 'The four Op Jezelf colours, each filling the card in turn with its HEX, RGB and CMYK values: cream #FFFBE6, leaf #C1EBA6, forest #357929 and orange #FF8400',
    build: function (card, t) {
      // Sampled from the app. The names are placeholders (todo.md).
      var C = [
        { hex: '#FFFBE6', name: 'Cream', fg: '#3D4621', accent: '#357929' },
        { hex: '#C1EBA6', name: 'Leaf', fg: '#3D4621', accent: '#357929' },
        { hex: '#357929', name: 'Forest', fg: '#FFFBE6', accent: '#C1EBA6' },
        { hex: '#FF8400', name: 'Orange', fg: '#3D4621', accent: '#FFFBE6' }
      ];
      function rgb(h) { return [1, 3, 5].map(function (i) { return parseInt(h.slice(i, i + 2), 16); }); }
      function cmyk(h) {
        var v = rgb(h).map(function (x) { return x / 255; });
        var k = 1 - Math.max(v[0], v[1], v[2]);
        return v.map(function (x) { return Math.round((1 - x - k) / (1 - k) * 100); }).concat(Math.round(k * 100)).join(' ');
      }
      var chips = C.map(function (d) { return '<div class="ojc-chip" style="--c:' + d.hex + '"></div>'; }).join('');
      var panels = C.map(function (c) {
        var p = document.createElement('div');
        p.className = 'ojc-panel';
        p.style.cssText = '--bg:' + c.hex + ';--fg:' + c.fg + ';--accent:' + c.accent;
        p.innerHTML = hd('Colour') +
          '<div class="ojc-name">Palette<br>Op Jezelf <em>' + c.name + '</em></div>' +
          '<div class="ojc-chips">' + chips + '</div>' +
          '<dl class="ojc-specs"><dt>HEX</dt><dd>' + c.hex + '</dd><dt>RGB</dt><dd>' + rgb(c.hex).join(' ') + '</dd><dt>CMYK</dt><dd>' + cmyk(c.hex) + '</dd></dl>' +
          '<div class="ojc-hex">' + c.hex + '</div>';
        card.appendChild(p);
        return p;
      });
      var marker = document.createElement('div');
      marker.className = 'ojc-marker';
      card.appendChild(marker);
      function mark(i) {
        marker.style.setProperty('--i', i);
        marker.style.setProperty('--m', C[i].fg);
      }
      mark(0);
      var s = slider(panels, mark);
      function next() {
        s.go((s.index() + 1) % C.length);
        t.at(SLIDE * 2, next);
      }
      return {
        start: function () { t.at(SLIDE * 2, next); }
      };
    }
  };

  // How living alone feels (045): bands that grow to their share
  CARDS.feelings = {
    label: 'How living alone feels, from 10 interviews: overwhelmed 26.7%, curious 20%, anxious 20%, lonely 13.3%, confident 13.3%, proud 6.7%',
    build: function (card, t) {
      // Shares are multiples of 1/15. One green family, darkest = most named.
      var F = [
        { w: 'Overwhelmed', p: 26.7, c: '#357929', fg: '#FFFBE6' },
        { w: 'Curious', p: 20.0, c: '#5A9247', fg: '#FFFBE6' },
        { w: 'Anxious', p: 20.0, c: '#7FAE68', fg: '#22300F' },
        { w: 'Lonely', p: 13.3, c: '#A3CB8A', fg: '#22300F' },
        { w: 'Confident', p: 13.3, c: '#C1EBA6', fg: '#22300F' },
        { w: 'Proud', p: 6.7, c: '#DDF0CC', fg: '#22300F' }
      ];
      card.innerHTML = hd('Research') +
        '<div class="ojc-t">How living alone<br><em>feels</em></div>' +
        '<div class="ojc-bands">' + F.map(function (f, i) {
          var d = (i * .15).toFixed(2) + 's';
          return '<div class="ojc-band" style="--c:' + f.c + ';--fg:' + f.fg + ';--g:' + (f.p + 7).toFixed(1) +
            ';--d:' + d + ';--fs:' + (2.6 + f.p * .17).toFixed(1) + 'cqw;transition-delay:' + d + '">' +
            '<div class="ojc-band-in"><b>' + f.w + '</b><i>' + f.p.toFixed(1) + '%</i></div></div>';
        }).join('') + '</div>' +
        src('Qualitative interviews, n=10', 'Share of feelings named');
      function play() {
        card.classList.remove('is-on');
        reflow(card);
        t.at(200, function () { card.classList.add('is-on'); });
        t.at(8500, function () { card.classList.remove('is-on'); });
        t.at(10600, play);
      }
      return {
        still: function () { card.classList.add('is-on'); },
        start: play,
        stop: function () { snap(card, function () { card.classList.remove('is-on'); }); }
      };
    }
  };

  // What teens knew, and what they didn't (045): quiz of 23 May 2025
  CARDS.quiz = {
    label: 'Quiz with 7 teens aged 14 to 15: 100% knew where to buy second-hand furniture and 86% what basic health insurance costs, but 0% knew which taxes don’t exist or when income tax applies to part-time pay',
    build: function (card, t) {
      card.innerHTML = hd('Research') +
        '<div class="ojc-t" style="--t-top:13.5%;--t-size:5.8cqw">What teens knew,<br><em>and what they didn’t</em></div>' +
        '<div class="ojc-qs">' +
          '<div class="ojc-grp" style="--d:0s">They knew</div>' +
          '<div class="ojc-q" style="--d:.1s;--w:100%"><div class="ojc-num" data-to="100">100<small>%</small></div><div class="ojc-txt">where to buy second&#8209;hand&nbsp;furniture</div><div class="ojc-meter"><i></i></div></div>' +
          '<div class="ojc-q" style="--d:.35s;--w:86%"><div class="ojc-num" data-to="86">86<small>%</small></div><div class="ojc-txt">what basic health insurance&nbsp;costs</div><div class="ojc-meter"><i></i></div></div>' +
          '<div class="ojc-grp is-gap" style="--d:1.2s">They didn’t</div>' +
          '<div class="ojc-q" style="--d:1.3s;--w:0%"><div class="ojc-num is-zero">0<small>%</small></div><div class="ojc-txt">which taxes don’t&nbsp;exist</div><div class="ojc-meter"><i></i></div></div>' +
          '<div class="ojc-q" style="--d:1.55s;--w:0%"><div class="ojc-num is-zero">0<small>%</small></div><div class="ojc-txt">when income tax applies to part&#8209;time&nbsp;pay</div><div class="ojc-meter"><i></i></div></div>' +
        '</div>' +
        src('Quiz, 7 teens aged 14 to 15', 'Share of correct answers');
      var nums = Array.prototype.slice.call(card.querySelectorAll('[data-to]'));
      function show(el, v) { el.innerHTML = v + '<small>%</small>'; }
      function count(el) {
        var to = +el.dataset.to;
        var t0 = performance.now();
        t.frame(function f(n) {
          var k = Math.min(1, (n - t0) / SLIDE);
          show(el, Math.round(to * ease(k)));
          if (k < 1) t.frame(f);
        });
      }
      function reset() {
        card.classList.remove('is-on');
        nums.forEach(function (n) { show(n, 0); });
      }
      function play() {
        reset();
        reflow(card);
        t.at(200, function () {
          card.classList.add('is-on');
          nums.forEach(function (n, i) { t.at(700 + i * 250, function () { count(n); }); });
        });
        t.at(9200, function () { card.classList.remove('is-on'); });
        t.at(10800, play);
      }
      reset();
      return {
        still: function () {
          card.classList.add('is-on');
          nums.forEach(function (n) { show(n, n.dataset.to); });
        },
        start: play,
        stop: function () { snap(card, reset); }
      };
    }
  };

  // The characters (045): they rise in once, stay, and take turns saying hi
  CARDS.characters = {
    label: 'Ten of the job characters I illustrated for Op Jezelf, each in a white circle on forest green, taking turns to say hi',
    build: function (card, t) {
      card.innerHTML = hd('Illustration') +
        '<div class="ojc-t">The characters,<br><em>illustrated by me</em></div>' +
        '<div class="ojc-cast"></div>' +
        src('The job characters from the app', 'Flat vector illustration');
      var cast = card.querySelector('.ojc-cast');
      // Rise in from the middle outwards, row by row
      var order = [2, 1, 3, 0, 4];
      // Mixed so similar haircuts, hard hats and glasses never sit side by side
      var MIX = [0, 5, 2, 4, 6, 1, 9, 7, 3, 8];
      var faces = MIX.map(function (m, i) {
        var slot = document.createElement('div');
        slot.className = 'ojc-slot';
        var d = (order.indexOf(i % 5) * .12 + Math.floor(i / 5) * .25).toFixed(2);
        var n = m + 1 < 10 ? '0' + (m + 1) : String(m + 1);
        slot.innerHTML = '<div class="ojc-face" style="--d:' + d + 's"><img src="' + IMG + 'character-' + n + '.webp" width="320" height="320" alt="" loading="lazy" decoding="async"></div>';
        cast.appendChild(slot);
        return slot.firstChild;
      });
      var SEQ = [0, 6, 3, 8, 1, 9, 4, 5, 2, 7];
      var j = 0;
      var risen = false;
      function hi() {
        var k = SEQ[j % SEQ.length];
        faces[k].classList.add('is-hi');
        setTimeout(function () { faces[k].classList.remove('is-hi'); }, 650);
        j++;
        t.at(900, hi);
      }
      return {
        still: function () { card.classList.add('is-on'); },
        start: function () {
          if (risen) {
            t.at(900, hi);
            return;
          }
          risen = true;
          t.at(200, function () { card.classList.add('is-on'); });
          t.at(2600, hi);
        }
      };
    }
  };

  // The weekly shop (045): food drops into the Groceries bag, one at a time
  CARDS.shop = {
    label: 'My food illustrations from Op Jezelf dropping one at a time into my grocery bag illustration: an apple, a banana, broccoli, a carrot, a tomato, a strawberry, an orange, eggs, a mango and frozen vegetables',
    build: function (card, t) {
      // Real-life proportions: a strawberry is smaller than a head of broccoli
      var ITEMS = [
        { n: 'apple', s: .85, r: 217 / 260 }, { n: 'banana', s: 1.1, r: 260 / 239 },
        { n: 'broccoli', s: 1, r: 246 / 260 }, { n: 'carrot', s: 1.05, r: 260 / 189 },
        { n: 'tomato', s: .8, r: 239 / 260 }, { n: 'strawberry', s: .5, r: 223 / 260 },
        { n: 'orange', s: .8, r: 205 / 260 }, { n: 'eggs', s: 1.05, r: 260 / 149 },
        { n: 'mango', s: .85, r: 239 / 260 }, { n: 'frozen-veggies', s: 1, r: 234 / 260 }
      ];
      card.innerHTML = hd('Illustration') +
        '<div class="ojc-t">The weekly shop,<br><em>illustrated by me</em></div>' +
        '<div class="ojc-shadow"></div>' +
        '<img class="ojc-bag" src="' + IMG + 'groceries-bag.webp" width="520" height="718" alt="" loading="lazy" decoding="async">' +
        '<div class="ojc-src">Groceries, from the app’s shop</div>';
      var bag = card.querySelector('.ojc-bag');
      var k = 0;
      var loaded = false;
      function dropOne() {
        var it = ITEMS[k++ % ITEMS.length];
        var W = card.clientWidth;
        var size = W * .15 * it.s;
        var img = document.createElement('img');
        img.className = 'ojc-drop';
        img.src = IMG + 'food-' + it.n + '.webp';
        img.alt = '';
        img.style.width = size + 'px';
        card.appendChild(img);
        var br = bag.getBoundingClientRect();
        var cr = card.getBoundingClientRect();
        var cx = br.left - cr.left + br.width / 2;
        // A little below the bag's top edge: hidden behind its front
        var mouthY = br.top - cr.top + br.height * .22;
        var x = (Math.random() - .5) * br.width * .35;
        var r0 = (Math.random() - .5) * 40;
        var r1 = r0 + (Math.random() > .5 ? 1 : -1) * (40 + Math.random() * 50);
        var a = img.animate([
          { transform: 'translate(' + (cx - size / 2 + x * .6) + 'px, ' + (-size * 1.2) + 'px) rotate(' + r0 + 'deg)' },
          { transform: 'translate(' + (cx - size / 2 + x) + 'px, ' + mouthY + 'px) rotate(' + r1 + 'deg)' }
        ], { duration: 900, easing: 'cubic-bezier(.55,0,.85,.4)', fill: 'forwards' });
        a.onfinish = function () {
          img.remove();
          bag.classList.remove('is-thud');
          reflow(bag);
          bag.classList.add('is-thud');
        };
      }
      function loop() {
        dropOne();
        t.at(k % ITEMS.length === 0 ? 2600 : 1100, loop);
      }
      return {
        start: function () {
          if (!loaded) {
            loaded = true;
            ITEMS.forEach(function (it) { new Image().src = IMG + 'food-' + it.n + '.webp'; });
          }
          t.at(600, loop);
        }
      };
    }
  };

  // The personas (045): slow enough to read, pause on hover or focus, with
  // Pause/Play and clickable dots on the card
  CARDS.personas = {
    label: 'The three Op Jezelf personas: the Cautious Planner, the Winging-it Warrior and the Overwhelmed Optimist',
    interactive: true,
    build: function (card, t) {
      // Traits written from the report's findings, approved by Luna (045)
      var P = [
        { img: 'alice', w: 524, h: 760, name: 'The Cautious Planner', bg: '#C1EBA6', fg: '#3D4621',
          traits: ['Wants to get it right first&nbsp;time', 'Worries about doing things wrong or forgetting a&nbsp;bill', 'Helped by simple money guidance and a daily&nbsp;plan'] },
        { img: 'marc', w: 510, h: 760, name: 'The Winging‑it Warrior', bg: '#357929', fg: '#FFFBE6',
          traits: ['Dreams big about their first&nbsp;place', 'Underestimates costs and gets caught out by&nbsp;surprises', 'Helped by real prices and seeing the&nbsp;consequences'] },
        { img: 'susan', w: 575, h: 760, name: 'The Overwhelmed Optimist', bg: '#FFFBE6', fg: '#3D4621',
          traits: ['Excited about the&nbsp;freedom', 'Gets tired juggling cleaning, cooking and&nbsp;work', 'Helped by small tasks and stories from older&nbsp;teens'] }
      ];
      var HOLD = 9000;
      var panels = P.map(function (p, i) {
        var d = document.createElement('div');
        d.className = 'ojc-panel';
        d.style.cssText = '--bg:' + p.bg + ';--fg:' + p.fg;
        d.innerHTML = '<div class="ojc-hd" aria-hidden="true"><span>Research</span><span>Op Jezelf</span></div>' +
          '<div class="ojc-k">Persona 0' + (i + 1) + ' / 03</div>' +
          '<h3 class="ojc-nm">' + p.name + '</h3>' +
          '<ul class="ojc-tr">' + p.traits.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' +
          '<div class="ojc-src">From interviews and the diary study</div>' +
          '<div class="ojc-dots">' + P.map(function (q, k) {
            return '<button type="button" class="ojc-dot' + (k === i ? ' is-on' : '') + '" aria-label="Show persona ' + (k + 1) + ', ' + q.name.replace('‑', '-') + '"' + (k === i ? ' aria-current="true"' : '') + '></button>';
          }).join('') + '</div>' +
          '<img class="ojc-pic" src="' + IMG + 'persona-' + p.img + '.webp" width="' + p.w + '" height="' + p.h + '" alt="" loading="lazy" decoding="async">';
        if (i) d.inert = true;
        card.appendChild(d);
        return d;
      });
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ojc-pause';
      card.appendChild(btn);

      var paused = reduce;
      var hover = false;
      var visible = false;
      function label() {
        btn.innerHTML = paused
          ? '<svg viewBox="0 0 8 9" aria-hidden="true" focusable="false"><path d="M0 0 L8 4.5 L0 9 Z"/></svg>Play'
          : '<svg viewBox="0 0 8 9" aria-hidden="true" focusable="false"><path d="M0 0 H3 V9 H0 Z M5 0 H8 V9 H5 Z"/></svg>Pause';
        btn.setAttribute('aria-label', paused ? 'Play the personas' : 'Pause the personas');
      }
      function schedule() {
        t.stop();
        if (!paused && !hover && visible) t.at(HOLD, function () { s.go((s.index() + 1) % P.length); });
      }
      var s = slider(panels, function (n) {
        var hadFocus = card.contains(document.activeElement) && document.activeElement.classList.contains('ojc-dot');
        panels.forEach(function (p, k) { p.inert = k !== n; });
        card.style.setProperty('--pfg', P[n].fg);
        if (hadFocus) panels[n].querySelectorAll('.ojc-dot')[n].focus({ preventScroll: true });
        schedule();
      });
      card.style.setProperty('--pfg', P[0].fg);
      label();

      card.addEventListener('mouseenter', function () { hover = true; schedule(); });
      card.addEventListener('mouseleave', function () { hover = false; schedule(); });
      card.addEventListener('focusin', function () { hover = true; schedule(); });
      card.addEventListener('focusout', function (e) {
        if (card.contains(e.relatedTarget)) return;
        hover = false;
        schedule();
      });
      card.addEventListener('click', function (e) {
        var dot = e.target.closest('.ojc-dot');
        if (!dot) return;
        s.go(Array.prototype.indexOf.call(dot.parentNode.children, dot));
      });
      btn.addEventListener('click', function () {
        paused = !paused;
        label();
        schedule();
      });
      return {
        start: function () { visible = true; schedule(); },
        stop: function () { visible = false; }
      };
    }
  };

  // Your first flat (045): each room slides from messy to clean while the
  // checklist under the flat ticks it off
  CARDS.flat = {
    label: 'My floorplan illustration of a first flat, going from messy to clean room by room as the bedroom, kitchen, bathroom and living room are ticked off',
    build: function (card, t) {
      // Each room's box on the plan, in % of the plan
      var R = [
        { name: 'Bedroom', x1: 5.902, x2: 54.079, y1: 2.591, y2: 59.645 },
        { name: 'Kitchen', x1: 50.384, x2: 98.225, y1: 0.144, y2: 44.434 },
        { name: 'Bathroom', x1: 7.294, x2: 37.380, y1: 60.988, y2: 96.977 },
        { name: 'Living room', x1: 37.716, x2: 93.666, y1: 45.825, y2: 97.313 }
      ];
      card.innerHTML = hd('Illustration') +
        '<div class="ojc-t">Your first flat,<br><em>before and after</em></div>' +
        '<div class="ojc-plan"><img src="' + IMG + 'flat-before.webp" width="1100" height="1100" alt="" loading="lazy" decoding="async"></div>' +
        '<ul class="ojc-list"></ul>' +
        '<div class="ojc-roll"></div>';
      var plan = card.querySelector('.ojc-plan');
      var list = card.querySelector('.ojc-list');
      var state = card.querySelector('.ojc-roll');
      function pc(v) { return v.toFixed(2) + '%'; }
      var rooms = R.map(function (r) {
        var im = document.createElement('img');
        im.className = 'ojc-room';
        im.src = IMG + 'flat-after.webp';
        im.alt = '';
        im.loading = 'lazy';
        im.decoding = 'async';
        im.style.cssText = '--t:' + pc(r.y1) + ';--b:' + pc(100 - r.y2) + ';--r:' + pc(100 - r.x2) + ';--l:' + pc(r.x1) + ';--x2:' + pc(r.x2);
        plan.appendChild(im);
        return im;
      });
      var items = R.map(function (r) {
        var li = document.createElement('li');
        li.innerHTML = '<i></i>' + r.name;
        list.appendChild(li);
        return li;
      });
      function reset() {
        rooms.forEach(function (i) { i.classList.remove('is-on'); });
        items.forEach(function (i) { i.classList.remove('is-done'); });
      }
      function play() {
        reset();
        if (state.textContent !== 'Before') roll(state, 'Before', 0, 1000);
        R.forEach(function (_, k) {
          t.at(2200 + k * 2000, function () {
            rooms[k].classList.add('is-on');
            setTimeout(function () { items[k].classList.add('is-done'); }, 900);
          });
        });
        var end = 2200 + R.length * 2000;
        t.at(end, function () { roll(state, 'After', 0, 1000); });
        t.at(end + 4000, play);
      }
      rollStill(state, 'Before');
      return {
        still: function () {
          rooms.forEach(function (i) { i.classList.add('is-on'); });
          items.forEach(function (i) { i.classList.add('is-done'); });
          rollStill(state, 'After');
        },
        start: play,
        stop: function () { snap(card, function () { reset(); rollStill(state, 'Before'); }); }
      };
    }
  };

  // ---------------------------------------------------------------------
  // Build every card, then run each one only while it is on screen
  // ---------------------------------------------------------------------
  var live = [];
  document.querySelectorAll('.ojc[data-ojc]').forEach(function (fig) {
    var def = CARDS[fig.dataset.ojc];
    if (!def) return;
    var card = document.createElement('div');
    card.className = 'ojc-card ojc--' + fig.dataset.ojc;
    if (def.interactive) {
      fig.setAttribute('aria-label', def.label);
    } else {
      fig.setAttribute('role', 'img');
      fig.setAttribute('aria-label', def.label);
      card.setAttribute('aria-hidden', 'true');
    }
    fig.textContent = '';
    fig.appendChild(card);
    var t = clock();
    var api = def.build(card, t);
    if (api.still && reduce) api.still();
    // With reduced motion only the personas run, and only on Play
    if (reduce && !def.interactive) return;
    live.push({ fig: fig, api: api, t: t, on: false });
  });

  function run(c, on) {
    if (on === c.on) return;
    c.on = on;
    if (on) {
      c.api.start();
    } else {
      c.t.stop();
      if (c.api.stop) c.api.stop();
    }
  }

  if (!live.length) return;
  if (!('IntersectionObserver' in window)) {
    live.forEach(function (c) { run(c, true); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var c = live.filter(function (x) { return x.fig === e.target; })[0];
      if (e.intersectionRatio >= .2) run(c, true);
      else if (!e.isIntersecting) run(c, false);
    });
  }, { threshold: [0, .2] });
  live.forEach(function (c) { io.observe(c.fig); });
})();
