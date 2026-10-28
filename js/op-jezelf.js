// Op Jezelf cards (043, 044, 045) and the app videos, rebuilt from the
// prototypes in the vault (reference/op-jezelf-*.html). Every <figure
// class="media ojc" data-ojc="…"> in the case study becomes one card, so
// swapping a card is changing that attribute. Motion, timing, colours,
// layout and text follow the prototypes. Styles: css/op-jezelf.css.
//
// Each card exposes cardPlay() and cardVisible(bool) on its figure. A card
// starts when half of it is in view (the second card in a row 0.7s later),
// plays its run, rests, then plays again. It holds while out of view or
// paused: every moving card has a pause button (WCAG 2.2.2). With reduced
// motion every card shows its end state and nothing loops.

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IMG = '/img/op-jezelf/cards/';

  // Poppins A and a, Regular to Bold, made point-compatible (043): per
  // weight, contours of [start, [[cx, cy, x, y, onCurve], …]]
  var GLYPHS = {"400":{"A":[[[489,155],[[337,155,185,155,1],[157,78,129,0,1],[81,0,33,0,1],[159,346,285,693,1],[338,693,390,693,1],[516,346,641,0,1],[593,0,545,0,1],[517,78,489,155,1]]],[[463,229],[[400,405,337,581,1],[274,405,211,229,1],[337,229,463,229,1]]]],"a":[[[303,557],[[375,557,428,526,0],[481,495,507,448,1],[507,498,507,548,1],[553,548,599,548,1],[599,274,599,0,1],[553,0,507,0,1],[507,51,507,102,1],[480,54,426,22,0],[373,-9,302,-9,1],[229,-9,170,27,0],[111,63,77,128,0],[43,193,43,276,1],[43,360,77,424,0],[111,487,170,522,0],[230,557,303,557,1]]],[[321,478],[[270,478,228,454,0],[186,430,161,384,0],[136,338,136,276,1],[136,213,161,166,0],[186,120,228,96,0],[270,71,321,71,1],[372,71,414,96,0],[457,120,482,166,0],[507,213,507,275,1],[507,337,482,383,0],[457,429,414,454,0],[372,478,321,478,1]]]]},"500":{"A":[[[494,142],[[348,142,203,142,1],[178,71,153,0,1],[94,0,34,0,1],[158,348,283,696,1],[349,696,415,696,1],[540,348,664,0,1],[604,0,544,0,1],[519,71,494,142,1]]],[[462,235],[[406,396,349,558,1],[292,396,235,235,1],[348,235,462,235,1]]]],"a":[[[297,560],[[362,560,410,534,0],[459,509,488,471,1],[488,511,488,551,1],[546,551,603,551,1],[603,276,603,0,1],[546,0,488,0,1],[488,41,488,82,1],[459,43,409,17,0],[359,-9,295,-9,1],[224,-9,165,28,0],[106,64,72,130,0],[37,195,37,278,1],[37,361,72,425,0],[106,489,166,524,0],[225,560,297,560,1]]],[[321,461],[[277,461,239,440,0],[201,418,178,376,0],[154,335,154,278,1],[154,221,178,178,0],[201,135,240,112,0],[278,90,321,90,1],[365,90,403,112,0],[441,134,464,176,0],[488,219,488,276,1],[488,333,464,375,0],[441,417,403,439,0],[365,461,321,461,1]]]]},"600":{"A":[[[497,133],[[358,133,219,133,1],[196,66,173,0,1],[100,0,26,0,1],[152,350,277,699,1],[358,699,440,699,1],[566,350,691,0,1],[617,0,543,0,1],[520,66,497,133,1]]],[[459,245],[[408,391,358,537,1],[308,391,257,245,1],[358,245,459,245,1]]]],"a":[[[286,563],[[348,563,394,538,0],[441,513,469,475,1],[469,514,469,554,1],[540,554,610,554,1],[610,277,610,0,1],[540,0,469,0,1],[469,40,469,81,1],[442,42,394,16,0],[347,-9,285,-9,1],[215,-9,158,27,0],[100,63,66,128,0],[33,194,33,279,1],[33,363,66,428,0],[100,493,158,528,0],[215,563,286,563,1]]],[[322,440],[[283,440,250,421,0],[217,402,196,366,0],[176,329,176,279,1],[176,229,196,192,0],[217,154,250,134,0],[284,114,322,114,1],[361,114,395,134,0],[429,153,449,190,0],[469,226,469,277,1],[469,328,449,364,0],[429,401,395,420,0],[361,440,322,440,1]]]]},"700":{"A":[[[499,124],[[368,124,237,124,1],[216,62,195,0,1],[106,0,16,0,1],[143,351,270,702,1],[369,702,468,702,1],[595,351,722,0,1],[632,0,541,0,1],[520,62,499,124,1]]],[[455,256],[[412,384,368,513,1],[325,384,282,256,1],[368,256,455,256,1]]]],"a":[[[274,566],[[333,566,378,542,0],[422,518,446,479,1],[446,518,446,558,1],[532,558,617,558,1],[617,279,617,0,1],[532,0,446,0,1],[446,40,446,79,1],[421,40,376,16,0],[332,-8,273,-8,1],[205,-8,149,28,0],[93,63,60,128,0],[28,194,28,280,1],[28,366,60,431,0],[93,496,149,531,0],[205,566,274,566,1]]],[[324,417],[[273,417,238,380,0],[220,362,211,337,0],[202,312,202,280,1],[202,248,211,223,0],[220,197,238,178,0],[273,141,324,141,1],[375,141,410,178,0],[428,196,437,222,0],[446,247,446,279,1],[446,311,437,336,0],[428,362,410,380,0],[375,417,324,417,1]]]]}};

  var NS = 'http://www.w3.org/2000/svg';

  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function reflow(el) { return el.offsetWidth; }

  // A card's own clock. Timers, frames and drop animations only run while
  // the clock runs; when it holds (paused, out of view) they freeze and
  // carry on from where they were. now() is the card's own time, which
  // stands still while it holds.
  function clock() {
    var running = false;
    var heldAt = performance.now();
    var heldFor = 0;
    var tasks = [];
    var frames = [];
    var anims = [];
    function arm(k) {
      k.t0 = performance.now();
      k.id = setTimeout(function () {
        tasks.splice(tasks.indexOf(k), 1);
        k.f();
      }, k.left);
    }
    var t = {
      now: function () { return (running ? performance.now() : heldAt) - heldFor; },
      at: function (ms, f) {
        var k = { f: f, left: ms };
        tasks.push(k);
        if (running) arm(k);
      },
      frame: function (f) {
        if (!running) { frames.push(f); return; }
        requestAnimationFrame(function () {
          if (running) f(t.now());
          else frames.push(f);
        });
      },
      anim: function (a) {
        anims.push(a);
        a.addEventListener('finish', function () { anims.splice(anims.indexOf(a), 1); });
        if (!running) a.pause();
      },
      clear: function () {
        tasks.forEach(function (k) { clearTimeout(k.id); });
        tasks = [];
        frames = [];
      },
      run: function (on) {
        if (on === running) return;
        running = on;
        if (on) {
          heldFor += performance.now() - heldAt;
          tasks.forEach(arm);
          frames.splice(0).forEach(t.frame);
          anims.forEach(function (a) { a.play(); });
        } else {
          heldAt = performance.now();
          tasks.forEach(function (k) {
            clearTimeout(k.id);
            k.left = Math.max(0, k.left - (heldAt - k.t0));
          });
          anims.forEach(function (a) { a.pause(); });
        }
      }
    };
    return t;
  }

  // ---------------------------------------------------------------------
  // Shared parts
  // ---------------------------------------------------------------------
  function hd(left) {
    return '<div class="ojc-hd"><span>' + left + '</span></div>';
  }
  function src(a, b) {
    return '<div class="ojc-src"><span>' + a + '</span>' + (b ? '<span>' + b + '</span>' : '') + '</div>';
  }

  // Panels that slide over each other from the right (colour, personas)
  function slider(panels, onGo, ms) {
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
        }, ms + 100);
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

  // The pause button on a moving card: 32px, top right. Its name stays the
  // same; aria-pressed says whether the motion is paused.
  var ICON_PAUSE = '<svg viewBox="0 0 14 14" aria-hidden="true" focusable="false"><rect x="2" y="1" width="3.5" height="12"/><rect x="8.5" y="1" width="3.5" height="12"/></svg>';
  var ICON_PLAY = '<svg viewBox="0 0 14 14" aria-hidden="true" focusable="false"><path d="M3 1 L13 7 L3 13 Z"/></svg>';
  function control(fig, label, paused, onToggle) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'ojc-ctl';
    b.setAttribute('aria-label', 'Pause the ' + label);
    function set() {
      b.innerHTML = paused ? ICON_PLAY : ICON_PAUSE;
      b.setAttribute('aria-pressed', String(paused));
    }
    b.addEventListener('click', function () {
      paused = !paused;
      set();
      onToggle(paused);
    });
    set();
    fig.appendChild(b);
  }

  // ---------------------------------------------------------------------
  // The cards. build(card, t) fills the card and returns:
  //   play()   start the loop (on the card's clock t)
  //   still()  the complete end state, for reduced motion
  // ctl names the pause button; static cards have none.
  // ---------------------------------------------------------------------
  var CARDS = {};

  // Typeface (043): 'Poppins / Op Jezelf' in Bold, the weight word next to
  // it, and the big Aa outline blending between the weights
  CARDS.type = {
    ctl: 'typeface animation',
    label: 'Poppins, the Op Jezelf typeface: Op Jezelf in Bold, next to the weight in use as it changes from Regular to Medium, SemiBold and Bold, over a big outlined Aa that shifts weight with it',
    build: function (card, t) {
      var WS = [400, 500, 600, 700];
      var NAMES = { 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold' };
      var MOVE = 1200;
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

      // Regular, Medium, SemiBold, Bold: each step 1.2s with a short rest,
      // a longer rest on Bold, then back to Regular and round again
      function step() {
        idx = (idx + 1) % WS.length;
        var from = cur;
        var to = WS[idx];
        roll(box, NAMES[to], to, 1600);
        var t0 = t.now();
        t.frame(function f(n) {
          var k = Math.min(1, (n - t0) / MOVE);
          cur = from + (to - from) * ease(k);
          render(cur);
          if (k < 1) t.frame(f);
          else t.at(to === 700 ? 2500 : to === 400 ? 800 : 500, step);
        });
      }
      return {
        still: function () {
          render(700);
          rollStill(box, NAMES[700], 700);
        },
        play: function () { t.at(300, step); }
      };
    }
  };

  // Colour (044): each colour slides over the card in turn, the marker
  // slides along the swatches
  CARDS.colour = {
    ctl: 'colour animation',
    label: 'The four Op Jezelf colours, each filling the card in turn with its HEX, RGB and CMYK values: cream #FFFBE6, leaf #C1EBA6, forest #357929 and orange #FF8400',
    build: function (card, t) {
      // Sampled from the app. The names are placeholders (todo.md).
      var C = [
        { hex: '#FFFBE6', name: 'Cream', fg: '#3D4621', accent: '#357929' },
        { hex: '#C1EBA6', name: 'Leaf', fg: '#3D4621', accent: '#357929' },
        { hex: '#357929', name: 'Forest', fg: '#FFFBE6', accent: '#C1EBA6' },
        { hex: '#FF8400', name: 'Orange', fg: '#22300F', accent: '#22300F' }
      ];
      var SLIDE = 1200;
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
      var s = slider(panels, mark, SLIDE);
      // Each colour slides over the last (1.2s slide, 0.5s rest), a longer
      // rest on the last one, then round again
      function next() {
        s.go((s.index() + 1) % C.length);
        t.at(s.index() === C.length - 1 ? 3700 : 1700, next);
      }
      return {
        play: function () { t.at(300, next); }
      };
    }
  };

  // How living alone feels (045): bands that grow to their share
  CARDS.feelings = {
    ctl: 'chart animation',
    label: 'How living alone feels, from 10 interviews: overwhelmed 26.7%, curious 20%, anxious 20%, lonely 13.3%, confident 13.3%, proud 6.7%',
    build: function (card, t) {
      // Shares are multiples of 1/15. One green family, darkest = most named.
      var F = [
        { w: 'Overwhelmed', p: 26.7, c: '#357929', fg: '#FFFBE6' },
        { w: 'Curious', p: 20.0, c: '#447E33', fg: '#FFFBE6' },
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
      // The bands grow, rest, fold away and grow again
      function on() {
        card.classList.add('is-on');
        t.at(3200 + 2500, off);
      }
      function off() {
        card.classList.remove('is-on');
        t.at(1900, on);
      }
      return {
        still: function () { card.classList.add('is-on'); },
        play: on
      };
    }
  };

  // What teens knew, and what they didn't (045): quiz of 23 May 2025
  CARDS.quiz = {
    ctl: 'quiz animation',
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
        var t0 = t.now();
        t.frame(function f(n) {
          var k = Math.min(1, (n - t0) / 1600);
          show(el, Math.round(to * ease(k)));
          if (k < 1) t.frame(f);
        });
      }
      // One run: the numbers count up and the bars fill; it rests, folds
      // away and plays again
      function play() {
        card.classList.remove('is-on');
        nums.forEach(function (n) { show(n, 0); });
        reflow(card);
        t.at(200, function () {
          card.classList.add('is-on');
          nums.forEach(function (n, i) { t.at(700 + i * 250, function () { count(n); }); });
        });
        t.at(3600 + 2500, function () {
          card.classList.remove('is-on');
          t.at(1300, play);
        });
      }
      nums.forEach(function (n) { show(n, 0); });
      return {
        still: function () {
          card.classList.add('is-on');
          nums.forEach(function (n) { show(n, n.dataset.to); });
        },
        play: play
      };
    }
  };

  // The characters (045): they rise in once, stay, and take turns saying hi
  CARDS.characters = {
    ctl: 'characters animation',
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
      function hi() {
        var k = SEQ[j++ % SEQ.length];
        faces[k].classList.add('is-hi');
        t.at(650, function () { faces[k].classList.remove('is-hi'); });
        t.at(900, hi);
      }
      return {
        still: function () { card.classList.add('is-on'); },
        play: function () {
          card.classList.add('is-on');
          t.at(1800, hi);
        }
      };
    }
  };

  // The weekly shop (045): food drops into the Groceries bag, four at a
  // time, then a rest
  CARDS.shop = {
    ctl: 'shopping animation',
    label: 'My food illustrations from Op Jezelf dropping one at a time into my grocery bag illustration: an apple, a banana, broccoli, a carrot, a tomato, a strawberry, an orange, eggs, a mango and frozen vegetables',
    build: function (card, t) {
      // Real-life proportions: a strawberry is smaller than a head of broccoli
      var ITEMS = [
        { n: 'apple', s: .85 }, { n: 'banana', s: 1.1 }, { n: 'broccoli', s: 1 },
        { n: 'carrot', s: 1.05 }, { n: 'tomato', s: .8 }, { n: 'strawberry', s: .5 },
        { n: 'orange', s: .8 }, { n: 'eggs', s: 1.05 }, { n: 'mango', s: .85 },
        { n: 'frozen-veggies', s: 1 }
      ];
      card.innerHTML = hd('Illustration') +
        '<div class="ojc-t">The weekly<br><em>shop</em></div>' +
        '<div class="ojc-shadow"></div>' +
        '<img class="ojc-bag" src="' + IMG + 'groceries-bag.webp" width="520" height="718" alt="" loading="lazy" decoding="async">' +
        '<div class="ojc-src">Groceries, from the app’s shop</div>';
      var bag = card.querySelector('.ojc-bag');
      var k = 0;
      function dropOne() {
        var it = ITEMS[k++ % ITEMS.length];
        var size = card.clientWidth * .15 * it.s;
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
        t.anim(a);
        a.addEventListener('finish', function () {
          img.remove();
          bag.classList.remove('is-thud');
          reflow(bag);
          bag.classList.add('is-thud');
        });
      }
      function round() {
        [0, 1000, 2000, 3000].forEach(function (ms) { t.at(ms, dropOne); });
        t.at(4000 + 2500, round);
      }
      return {
        play: function () {
          ITEMS.forEach(function (it) { new Image().src = IMG + 'food-' + it.n + '.webp'; });
          t.at(300, round);
        }
      };
    }
  };

  // The personas (045): slow enough to read, pause on hover or focus, with
  // the pause button and clickable dots on the card
  CARDS.personas = {
    ctl: 'persona slideshow',
    interactive: true,
    label: 'The three Op Jezelf personas: the Cautious Planner, the Winging-it Warrior and the Overwhelmed Optimist',
    build: function (card, t, hold) {
      // Traits written from the report's findings, approved by Luna (045)
      var P = [
        { img: 'alice', w: 524, h: 760, name: 'The Cautious Planner', bg: '#C1EBA6', fg: '#3D4621',
          traits: ['Wants to get it right first&nbsp;time', 'Worries about doing things wrong or forgetting a&nbsp;bill', 'Helped by simple money guidance and a daily&nbsp;plan'] },
        { img: 'marc', w: 510, h: 760, name: 'The Winging‑it Warrior', bg: '#357929', fg: '#FFFBE6',
          traits: ['Dreams big about their first&nbsp;place', 'Underestimates costs and gets caught out by&nbsp;surprises', 'Helped by real prices and seeing the&nbsp;consequences'] },
        { img: 'susan', w: 575, h: 760, name: 'The Overwhelmed Optimist', bg: '#FFFBE6', fg: '#3D4621',
          traits: ['Excited about the&nbsp;freedom', 'Gets tired juggling cleaning, cooking and&nbsp;work', 'Helped by small tasks and stories from older&nbsp;teens'] }
      ];
      var HOLD = 6000;
      var panels = P.map(function (p, i) {
        var d = document.createElement('div');
        d.className = 'ojc-panel';
        d.style.cssText = '--bg:' + p.bg + ';--fg:' + p.fg;
        d.innerHTML = '<div class="ojc-hd" aria-hidden="true"><span>Research</span></div>' +
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
      function schedule() {
        t.clear();
        t.at(HOLD, function () { s.go((s.index() + 1) % P.length); });
      }
      var s = slider(panels, function (n) {
        var hadFocus = card.contains(document.activeElement) && document.activeElement.classList.contains('ojc-dot');
        panels.forEach(function (p, k) { p.inert = k !== n; });
        if (hadFocus) panels[n].querySelectorAll('.ojc-dot')[n].focus({ preventScroll: true });
        schedule();
      }, 1600);

      // Hover or focus holds the slideshow; leaving gives the persona on
      // show its full time again
      var fig = card.parentNode;
      function over(on) {
        hold(on);
        if (!on) schedule();
      }
      fig.addEventListener('mouseenter', function () { over(true); });
      fig.addEventListener('mouseleave', function () { over(false); });
      // Focus on the pause button itself doesn't hold it: Play must play
      fig.addEventListener('focusin', function (e) {
        if (!e.target.classList.contains('ojc-ctl')) over(true);
      });
      fig.addEventListener('focusout', function (e) {
        if (!fig.contains(e.relatedTarget)) over(false);
      });
      card.addEventListener('click', function (e) {
        var dot = e.target.closest('.ojc-dot');
        if (!dot) return;
        s.go(Array.prototype.indexOf.call(dot.parentNode.children, dot));
      });
      return { play: schedule };
    }
  };

  // Your first flat (045): each room slides from messy to clean while the
  // checklist under the flat ticks it off
  CARDS.flat = {
    ctl: 'flat animation',
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
      // A room a second, each ticked off as it turns clean; 'After', a
      // rest, then messy again
      function clean() {
        rooms.forEach(function (im, k) {
          t.at(k * 1000, function () {
            im.classList.add('is-on');
            t.at(700, function () { items[k].classList.add('is-done'); });
          });
        });
        t.at(R.length * 1000 + 300, function () { roll(state, 'After', 0, 1000); });
        t.at(R.length * 1000 + 300 + 2500, mess);
      }
      function mess() {
        rooms.forEach(function (i) { i.classList.remove('is-on'); });
        items.forEach(function (i) { i.classList.remove('is-done'); });
        roll(state, 'Before', 0, 1000);
        t.at(2000, clean);
      }
      rollStill(state, 'Before');
      return {
        still: function () {
          rooms.forEach(function (i) { i.classList.add('is-on'); });
          items.forEach(function (i) { i.classList.add('is-done'); });
          rollStill(state, 'After');
        },
        play: function () { t.at(400, clean); }
      };
    }
  };

  // What testing changed: what we saw, what we changed. Static.
  CARDS.testing = {
    label: 'What testing changed: teens got lost in the guidance, so we made onboarding clearer; they missed what to do next, so we tightened the task structure; they asked how to pay without an income, so we gave more honest feedback in the decision flow. From usability tests with 3 teens and the classroom pilot.',
    build: function (card) {
      var ARROW = '<svg class="ojc-arrow" viewBox="0 0 60 12" focusable="false"><path d="M1 6 H58 M52 1 L58 6 L52 11"/></svg>';
      var ROWS = [
        ['got lost in the&nbsp;guidance', 'made onboarding&nbsp;clearer'],
        ['missed what to do&nbsp;next', 'tightened the task&nbsp;structure'],
        ['asked how to pay without an&nbsp;income', 'gave more honest feedback in the decision&nbsp;flow']
      ];
      card.innerHTML = hd('Testing') +
        '<div class="ojc-t">What we saw,<br><em>what we changed</em></div>' +
        '<div class="ojc-cols"><span>Teens in testing</span><span>So we</span></div>' +
        '<div class="ojc-rows">' + ROWS.map(function (r) {
          return '<div class="ojc-row"><div class="ojc-saw">' + r[0] + '</div>' + ARROW + '<div class="ojc-did">' + r[1] + '</div></div>';
        }).join('') + '</div>' +
        src('Usability tests (n=3) and the classroom pilot', 'Figma prototype');
      return {};
    }
  };

  // ---------------------------------------------------------------------
  // Build every card
  // ---------------------------------------------------------------------
  var figs = [];
  document.querySelectorAll('.ojc[data-ojc]').forEach(function (fig) {
    var def = CARDS[fig.dataset.ojc];
    if (!def) return;
    var card = document.createElement('div');
    card.className = 'ojc-card';
    fig.classList.add('ojc--' + fig.dataset.ojc);
    fig.textContent = '';
    fig.appendChild(card);
    // The personas can be used (dots, pause), so the figure is named and
    // its parts are read; every other card reads as one image
    if (def.interactive) {
      fig.setAttribute('aria-label', def.label);
    } else {
      card.setAttribute('role', 'img');
      card.setAttribute('aria-label', def.label);
    }

    var t = clock();
    var played = false;
    var visible = false;
    var paused = reduce;
    var held = false;
    function sync() { t.run(played && visible && !paused && !held); }
    var api = def.build(card, t, function (on) { held = on; sync(); });

    // Static, or still with reduced motion: the complete end state
    if (!def.ctl || (reduce && !def.interactive)) {
      if (api.still) api.still();
      fig.cardPlay = fig.cardVisible = function () {};
      return;
    }
    // The personas only move on Play with reduced motion
    control(fig, def.ctl, paused, function (p) { paused = p; sync(); });
    fig.cardPlay = function () {
      if (played) return;
      played = true;
      api.play();
      sync();
    };
    fig.cardVisible = function (v) {
      visible = v;
      sync();
    };
    figs.push(fig);
  });

  // A card starts when half of it is in view; the second card in a row
  // 0.7s after the first. It holds while out of view.
  if (figs.length) {
    if (!('IntersectionObserver' in window)) {
      figs.forEach(function (f) { f.cardVisible(true); f.cardPlay(); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var fig = e.target;
          fig.cardVisible(e.isIntersecting);
          if (e.intersectionRatio < .5 || fig.dataset.queued) return;
          fig.dataset.queued = '1';
          var prev = fig.previousElementSibling;
          setTimeout(fig.cardPlay, prev && prev.classList.contains('ojc') ? 700 : 0);
        });
      }, { threshold: [0, .5] });
      figs.forEach(function (f) { io.observe(f); });
    }
  }

  // ---------------------------------------------------------------------
  // The app videos (05): no autoplay. Each phone has its own play/pause
  // button; a video stops when it leaves the screen.
  // ---------------------------------------------------------------------
  document.querySelectorAll('.oj-vids').forEach(function (fig) {
    var vids = [];
    fig.querySelectorAll('.oj-vid').forEach(function (box) {
      var v = box.querySelector('video');
      var b = box.querySelector('.oj-vid-btn');
      if (!v || !b) return;
      vids.push(v);
      function set(on) {
        b.setAttribute('aria-pressed', String(on));
        box.classList.toggle('is-playing', on);
      }
      b.addEventListener('click', function () {
        if (v.paused) {
          var p = v.play();
          if (p && p.catch) p.catch(function () { set(false); });
        } else {
          v.pause();
        }
      });
      v.addEventListener('play', function () { set(true); });
      v.addEventListener('pause', function () { set(false); });
    });
    if (!vids.length || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) return;
      vids.forEach(function (v) { if (!v.paused) v.pause(); });
    }).observe(fig);
  });
})();
