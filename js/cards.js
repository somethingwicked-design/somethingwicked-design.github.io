// Moving cards in a case study, shared by every project (Op Jezelf 043-045,
// De Bote 047, Something Wicked 049, ReStock 050, Health Potion 051). A project script hands its cards to SWCards.mount(); each
// <figure class="media cs-card" data-<key>="name"> then becomes one card.
// Styles: css/cards.css, plus the project's own card styles.
//
// Each card exposes cardPlay() and cardVisible(bool) on its figure. A card
// starts just before it scrolls into view (the second card in a row 0.7s
// later), plays its run, rests, then plays again. It holds while out of view or
// paused: every moving card has a pause button (WCAG 2.2.2). With reduced
// motion every card shows its end state and nothing loops.

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function reflow(el) { return el.offsetWidth; }

  // A card's own clock. Timers, frames and animations only run while the
  // clock runs; when it holds (paused, out of view) they freeze and carry
  // on from where they were. now() is the card's own time, which stands
  // still while it holds.
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

  // Run [wait ms, fn] steps in order on the clock, then start again (the
  // prototypes' seq)
  function seq(t, steps) {
    var i = 0;
    (function next() {
      var s = steps[i];
      i = (i + 1) % steps.length;
      t.at(s[0], function () {
        s[1]();
        next();
      });
    })();
  }

  // A fixed random sequence, so the hand-drawn lines look the same on every
  // visit
  function rng(seed) {
    return function () {
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function f2(v) { return v.toFixed(2); }
  function each(list, f) { Array.prototype.forEach.call(list, f); }

  // Hand hatching (De Bote 047, Health Potion 051): rough parallel strokes
  // over the box, a little uneven in spacing, weight and pressure. A mask
  // in the card keeps them inside the shapes. Options:
  //   cls     the class of each stroke
  //   n       how many strokes across the box
  //   seg     length of one bend; without it every stroke has three
  //   jit     how far a bend wanders sideways
  //   w, op   stroke width and opacity, [min, max]
  //   dur     how long the hatching takes, first stroke to last
  //   k       dy/dx of a stroke (1.88, about 62deg)
  function hatching(r, box, o) {
    var k = o.k || 1.88;
    var op = o.op || [.6, 1];
    var c0 = box.x1 + box.y1 / k;
    var c1 = box.x2 + box.y2 / k;
    var gap = (c1 - c0) / o.n;
    var out = '';
    for (var i = 0; i < o.n; i++) {
      // Each stroke is x = c - y / k, from the bottom (or left) edge up
      var c = c0 + (i + .5 + (r() - .5) * .3) * gap;
      var yA = Math.min(box.y2, (c - box.x1) * k);
      var yB = Math.max(box.y1, (c - box.x2) * k);
      if (yA <= yB) continue;
      var n = o.seg ? Math.max(3, Math.round((yA - yB) / o.seg)) : 3;
      var p = [];
      for (var j = 0; j <= n; j++) {
        var y = yA - (yA - yB) * j / n;
        var jit = j && j < n ? (r() - .5) * 2 * o.jit : 0;
        p.push(f2(c - y / k + jit) + ' ' + f2(y));
      }
      out += '<path class="' + o.cls + '" pathLength="1" style="--d:' + f2(i / o.n * o.dur) + 's;stroke-width:' + f2(o.w[0] + r() * (o.w[1] - o.w[0])) + ';opacity:' + f2(op[0] + r() * (op[1] - op[0])) + '" d="M' + p.join(' L') + '"/>';
    }
    return out;
  }

  // The header line at the top of a card: what it shows, and on some cards
  // a second label on the right
  function hd(left, right) {
    return '<div class="cs-card-hd"><span>' + left + '</span>' + (right ? '<span>' + right + '</span>' : '') + '</div>';
  }

  // The source line at the bottom of a card, in the project's class (key:
  // 'ojc' gives .ojc-src). font marks a note on a stand-in font, which
  // stays on phones too (is-font).
  function src(key, a, b, font) {
    return '<div class="' + key + '-src"><span>' + a + '</span>' + (b ? '<span' + (font ? ' class="is-font"' : '') + '>' + b + '</span>' : '') + '</div>';
  }

  // The bottom of a card (Health Potion, Kokoro): n progress dots, the
  // level and its rule, the source line (a, b). font marks b as a note on
  // a stand-in font, which stays on phones too (is-font). Shared classes
  // (css/cards.css) next to the project's own (key: 'koc' gives .koc-foot).
  function foot(key, n, a, b, font) {
    var dots = '';
    for (var i = 0; i < n; i++) dots += '<i></i>';
    return '<div class="cs-card-foot ' + key + '-foot">' +
      '<div class="cs-card-dots ' + key + '-dots" aria-hidden="true">' + dots + '</div>' +
      '<div class="cs-card-meta ' + key + '-meta" aria-hidden="true"><div class="cs-card-lvl ' + key + '-lvl"></div><div class="cs-card-rule ' + key + '-rule"></div></div>' +
      '<div class="cs-card-src ' + key + '-src"><span>' + a + '</span><span' + (font ? ' class="is-font"' : '') + '>' + b + '</span></div>' +
    '</div>';
  }
  // The level and rule of a foot() fade out, change and fade back in on
  // the card's clock t; now() sets them straight away (the still end
  // state), hide() leaves them out
  function metaOf(card, t) {
    var meta = card.querySelector('.cs-card-meta');
    var lvl = card.querySelector('.cs-card-lvl');
    var rule = card.querySelector('.cs-card-rule');
    var dots = card.querySelectorAll('.cs-card-dots i');
    function set(m, i) {
      lvl.textContent = m[0];
      rule.textContent = m[1];
      each(dots, function (d, k) { d.classList.toggle('is-on', k === i); });
    }
    return {
      to: function (m, i) {
        meta.classList.add('is-hide');
        each(dots, function (d, k) { d.classList.toggle('is-on', k === i); });
        t.at(350, function () {
          set(m, i);
          meta.classList.remove('is-hide');
        });
      },
      now: set,
      hide: function () { meta.classList.add('is-hide'); }
    };
  }

  // The pause button on a moving card: 32px, top right. Its name stays the
  // same; aria-pressed says whether the motion is paused. set(p) changes it
  // from the card itself (a timeline year that was picked pauses it).
  var ICON_PAUSE = '<svg viewBox="0 0 14 14" aria-hidden="true" focusable="false"><rect x="2" y="1" width="3.5" height="12"/><rect x="8.5" y="1" width="3.5" height="12"/></svg>';
  var ICON_PLAY = '<svg viewBox="0 0 14 14" aria-hidden="true" focusable="false"><path d="M3 1 L13 7 L3 13 Z"/></svg>';
  function control(fig, label, paused, onToggle) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'cs-card-ctl';
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
    return {
      set: function (p) {
        if (p === paused) return;
        paused = p;
        set();
        onToggle(paused);
      }
    };
  }

  // Hover or focus inside a card holds it (personas, newspaper). Focus on
  // the pause button itself doesn't: Play must play.
  function holdOnHover(fig, over) {
    fig.addEventListener('mouseenter', function () { over(true); });
    fig.addEventListener('mouseleave', function () { over(false); });
    fig.addEventListener('focusin', function (e) {
      if (!e.target.classList.contains('cs-card-ctl')) over(true);
    });
    fig.addEventListener('focusout', function (e) {
      if (!fig.contains(e.relatedTarget)) over(false);
    });
  }

  // ---------------------------------------------------------------------
  // Build every card of a project. key is the data attribute and the class
  // prefix ('ojc': data-ojc, .ojc-card, .ojc--type). Each card definition:
  //   ctl          names the pause button; static cards have none
  //   label        what the card shows, for screen readers
  //   interactive  the card has its own controls (dots, years): the figure
  //                is named and its parts are read
  //   once         plays once on first view, under 5s, so no pause button
  //                (before/after); with reduced motion it shows still()
  //   build(card, t, ctx)  fills the card and returns
  //     play()   start the loop (on the card's clock t)
  //     still()  the complete end state, for reduced motion
  //   ctx.hold(on) holds the card (hover), ctx.pause() presses Pause
  // ---------------------------------------------------------------------
  function mount(key, CARDS) {
    var figs = [];
    document.querySelectorAll('.cs-card[data-' + key + ']').forEach(function (fig) {
      var name = fig.getAttribute('data-' + key);
      var def = CARDS[name];
      if (!def) return;
      var card = document.createElement('div');
      card.className = 'cs-card-in ' + key + '-card';
      fig.classList.add(key + '--' + name);
      fig.textContent = '';
      fig.appendChild(card);
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
      var ctl = null;
      function sync() { t.run(played && visible && !paused && !held); }
      var api = def.build(card, t, {
        hold: function (on) { held = on; sync(); },
        pause: function () { if (ctl) ctl.set(true); }
      });

      // Static, or still with reduced motion: the complete end state
      if (def.once ? reduce : !def.ctl || (reduce && !def.interactive)) {
        if (api.still) api.still();
        fig.cardPlay = fig.cardVisible = function () {};
        return;
      }
      // An interactive card only moves on Play with reduced motion
      if (def.ctl) ctl = control(fig, def.ctl, paused, function (p) { paused = p; sync(); });
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

    // A card starts once it is within 20% of the screen height of the
    // screen, so it's already moving when it scrolls in and never shows an
    // empty frame first (067); the second card in a row 0.7s after the
    // first. It holds once it's further out than that.
    if (!figs.length) return;
    if (!('IntersectionObserver' in window)) {
      figs.forEach(function (f) { f.cardVisible(true); f.cardPlay(); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var fig = e.target;
        fig.cardVisible(e.isIntersecting);
        if (!e.isIntersecting || fig.dataset.queued) return;
        fig.dataset.queued = '1';
        var prev = fig.previousElementSibling;
        setTimeout(fig.cardPlay, prev && prev.cardPlay ? 700 : 0);
      });
    }, { rootMargin: '20% 0px', threshold: 0 });
    figs.forEach(function (f) { io.observe(f); });
  }

  window.SWCards = {
    reduce: reduce,
    ease: ease,
    lerp: lerp,
    reflow: reflow,
    clock: clock,
    seq: seq,
    rng: rng,
    f2: f2,
    each: each,
    hatching: hatching,
    hd: hd,
    src: src,
    foot: foot,
    metaOf: metaOf,
    holdOnHover: holdOnHover,
    mount: mount
  };
})();
