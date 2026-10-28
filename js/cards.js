// Moving cards in a case study, shared by every project (Op Jezelf 043-045,
// De Bote 047, Something Wicked 049). A project script hands its cards to SWCards.mount(); each
// <figure class="media cs-card" data-<key>="name"> then becomes one card.
// Styles: css/cards.css, plus the project's own card styles.
//
// Each card exposes cardPlay() and cardVisible(bool) on its figure. A card
// starts when half of it is in view (the second card in a row 0.7s later),
// plays its run, rests, then plays again. It holds while out of view or
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

  // The header line at the top of a card: what it shows, and on some cards
  // a second label on the right
  function hd(left, right) {
    return '<div class="cs-card-hd"><span>' + left + '</span>' + (right ? '<span>' + right + '</span>' : '') + '</div>';
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

    // A card starts when half of it is in view; the second card in a row
    // 0.7s after the first. It holds while out of view.
    if (!figs.length) return;
    if (!('IntersectionObserver' in window)) {
      figs.forEach(function (f) { f.cardVisible(true); f.cardPlay(); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var fig = e.target;
        fig.cardVisible(e.isIntersecting);
        if (e.intersectionRatio < .5 || fig.dataset.queued) return;
        fig.dataset.queued = '1';
        var prev = fig.previousElementSibling;
        setTimeout(fig.cardPlay, prev && prev.cardPlay ? 700 : 0);
      });
    }, { threshold: [0, .5] });
    figs.forEach(function (f) { io.observe(f); });
  }

  window.SWCards = {
    reduce: reduce,
    ease: ease,
    lerp: lerp,
    reflow: reflow,
    clock: clock,
    seq: seq,
    hd: hd,
    holdOnHover: holdOnHover,
    mount: mount
  };
})();
