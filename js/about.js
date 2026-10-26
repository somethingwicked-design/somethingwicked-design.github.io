// About (026, 029, 030, 033), after reference/about.dc.html and
// about-mobile.dc.html.
// Cards, desktop: a hand of five. Picking a card swings it upright, lifts
// it out and turns it face up; the others dim. Clicking it again, anywhere
// else or Escape puts it back. Ilio's card sets off catfetti.
// Cards, phone: the same five cards as a deck. Swipe the top card past
// 72px and it flies off to the back; a shorter drag snaps back. Tap: the
// first tap turns it face up, the second sends it to the back (the
// single-tap alternative to swiping, WCAG 2.5.1).
// Photos: one polaroid at a time with arrows and a counter.
// Quest log: click Ilio, she flops over and the log opens; close it and a
// white '?' and a thank-you note come back.
// Reduced motion: no catfetti, no fly-out; everything else in CSS.
// Without JS the cards stay face down, the first photo shows and the log
// stays closed.

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var phone = window.matchMedia('(max-width: 759.98px)');
  var stacked = window.matchMedia('(max-width: 1023.98px)');
  var CAT = '🐱';

  // ---------------------------------------------------------------------
  // Cards
  // ---------------------------------------------------------------------
  var deck = document.getElementById('abDeck');
  if (deck) {
    var cards = Array.prototype.slice.call(deck.querySelectorAll('.pc'));
    // Phone deck order (Ilio last), from data-deck
    var stack = cards.slice().sort(function (a, b) { return a.dataset.deck - b.dataset.deck; });
    var cat = deck.querySelector('.st-cat');
    var more = deck.querySelector('.cf-more');
    var say = document.getElementById('abDeckSay');
    var dots = document.querySelectorAll('.sd-dots i');

    // Face up or down, for screen readers too: the fact is only read out
    // once the card has turned
    var setFace = function (card, up) {
      var front = card.querySelector('.pc-front');
      card.setAttribute('aria-pressed', up ? 'true' : 'false');
      front.setAttribute('aria-hidden', up ? 'false' : 'true');
      if (up) say.textContent = front.textContent.replace(/\s+/g, ' ').trim();
    };

    // Catfetti: 28 rainbow cats out of Ilio's card
    var clearCats = function () {
      cat.querySelectorAll('.cf').forEach(function (el) { el.remove(); });
    };
    var burst = function (delay) {
      clearCats();
      if (reduce.matches) return;
      for (var k = 0; k < 28; k++) {
        var a = Math.random() * Math.PI * 2;
        var r = 110 + Math.random() * 220;
        var el = document.createElement('span');
        el.className = 'cf';
        el.setAttribute('aria-hidden', 'true');
        el.textContent = CAT;
        el.style.setProperty('--dx', (Math.cos(a) * r).toFixed(0) + 'px');
        el.style.setProperty('--dy', (Math.sin(a) * r - 90).toFixed(0) + 'px');
        el.style.setProperty('--rot', (Math.random() * 140 - 70).toFixed(0) + 'deg');
        el.style.animationDelay = (delay + Math.random() * 0.1).toFixed(2) + 's';
        el.style.fontSize = (18 + Math.random() * 22).toFixed(0) + 'px';
        el.style.filter = 'hue-rotate(' + Math.round(k * 360 / 28) + 'deg) saturate(1.6)';
        el.addEventListener('animationend', function () { this.remove(); });
        cat.appendChild(el);
      }
    };
    more.addEventListener('click', function () { burst(0); });

    // Every fact must fit its card: if one still overflows (a narrow card,
    // a bigger system font), shrink its text in steps (--fit), never clip
    var fitCards = function () {
      cards.forEach(function (card) {
        var front = card.querySelector('.pc-front');
        var fit = 1;
        front.style.setProperty('--fit', '1');
        while (fit > 0.6 && (front.scrollHeight > front.clientHeight + 1 || front.scrollWidth > front.clientWidth + 1)) {
          fit -= 0.05;
          front.style.setProperty('--fit', fit.toFixed(2));
        }
      });
    };
    var fitQueued = false;
    var queueFit = function () {
      if (fitQueued) return;
      fitQueued = true;
      requestAnimationFrame(function () { fitQueued = false; fitCards(); });
    };
    fitCards();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitCards);
    window.addEventListener('resize', queueFit);

    // --- Desktop: the hand ----------------------------------------------
    var sel = null;
    var putBack = function () {
      if (!sel) return;
      setFace(sel, false);
      sel = null;
      cards.forEach(function (c) { c.classList.remove('is-sel', 'is-dim'); });
      more.hidden = true;
      clearCats();
    };
    var pick = function (card) {
      // With a card picked, a click on any other card only puts it back
      if (sel) { putBack(); return; }
      sel = card;
      cards.forEach(function (c) {
        c.classList.toggle('is-sel', c === card);
        c.classList.toggle('is-dim', c !== card);
      });
      setFace(card, true);
      if (card === cat) {
        burst(1.0); // after it has swung in (0.6s) and turned over (0.4s + 0.7s)
        more.hidden = false;
      }
    };
    document.addEventListener('click', function (e) {
      if (sel && !phone.matches && !deck.contains(e.target)) putBack();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sel) {
        var card = sel;
        putBack();
        card.focus();
      }
    });

    // --- Phone: the deck ------------------------------------------------
    // Card at depth d (0 = on top): x, y, rotation. A little messy.
    var PEEK = [[0, 0, 0], [10, 8, 5], [-12, 14, -6], [14, 20, 8], [-8, 26, -9]];
    var top = 0;
    var flip = false;
    var touched = false;
    var dx = 0;
    var dragging = false;
    var flying = false;

    var render = function () {
      stack.forEach(function (c, i) {
        var d = (i - top + 5) % 5;
        var x = PEEK[d][0];
        var y = PEEK[d][1];
        var r = PEEK[d][2];
        if (d === 0) { x = dx; r = dx / 14; }
        c.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + r.toFixed(1) + 'deg)';
        c.style.zIndex = 10 - d;
        c.classList.toggle('is-top', d === 0);
        c.classList.toggle('is-flip', d === 0 && flip);
        c.classList.toggle('is-drag', d === 0 && dragging);
        c.classList.toggle('is-nudge', d === 0 && !touched);
        c.disabled = d !== 0;
        if (d === 0) c.removeAttribute('aria-hidden');
        else c.setAttribute('aria-hidden', 'true');
      });
      dots.forEach(function (dot, k) { dot.classList.toggle('on', k === top); });
      more.hidden = !(flip && stack[top] === cat);
    };

    // The top card flies out (left or right) and tucks in at the back
    var deckGo = function (dir) {
      if (flying) return;
      var was = stack[top];
      var hadFocus = document.activeElement === was;
      var next = function () {
        flying = false;
        setFace(was, false);
        top = (top + 1) % 5;
        flip = false;
        dx = 0;
        dragging = false;
        clearCats();
        render();
        if (hadFocus) stack[top].focus();
        say.textContent = 'Card ' + (top + 1) + ' / 5';
      };
      touched = true;
      if (reduce.matches) { next(); return; }
      flying = true;
      dx = dir * 420;
      dragging = false;
      render();
      setTimeout(next, 230);
    };

    var justDragged = false;
    var tap = function (card) {
      if (justDragged || flying || card !== stack[top]) return;
      if (flip) { deckGo(-1); return; }
      flip = true;
      touched = true;
      setFace(card, true);
      if (card === cat) burst(0.55);
      render();
    };

    var down = false;
    var drag = false;
    var sx = 0;
    var sy = 0;
    deck.addEventListener('pointerdown', function (e) {
      var card = e.target.closest('.pc');
      if (!phone.matches || card !== stack[top] || flying) return;
      down = true;
      drag = false;
      sx = e.clientX;
      sy = e.clientY;
      try { card.setPointerCapture(e.pointerId); } catch (err) { /* old browsers */ }
    });
    deck.addEventListener('pointermove', function (e) {
      if (!down) return;
      var mx = e.clientX - sx;
      var my = e.clientY - sy;
      if (!drag && Math.abs(mx) > 8 && Math.abs(mx) > Math.abs(my)) drag = true;
      if (!drag) return;
      dx = mx;
      dragging = true;
      touched = true;
      render();
    });
    var up = function () {
      if (!down) return;
      down = false;
      if (!drag) return;
      justDragged = true;
      setTimeout(function () { justDragged = false; }, 60);
      if (Math.abs(dx) > 72) {
        deckGo(dx > 0 ? 1 : -1);
      } else {
        dx = 0;
        dragging = false;
        render();
      }
    };
    deck.addEventListener('pointerup', up);
    deck.addEventListener('pointercancel', up);

    deck.addEventListener('click', function (e) {
      var card = e.target.closest('.pc');
      if (!card) return;
      if (phone.matches) tap(card);
      else pick(card);
    });

    // Switch between hand and deck when the window crosses 760px
    var setMode = function () {
      putBack();
      clearCats();
      if (phone.matches) {
        render();
        return;
      }
      flip = false;
      dx = 0;
      dragging = false;
      more.hidden = true;
      cards.forEach(function (c) {
        c.style.transform = '';
        c.style.zIndex = '';
        c.disabled = false;
        c.removeAttribute('aria-hidden');
        c.classList.remove('is-top', 'is-flip', 'is-drag', 'is-nudge');
        setFace(c, false);
      });
      say.textContent = '';
    };
    phone.addEventListener('change', setMode);
    setMode();
  }

  // ---------------------------------------------------------------------
  // Photos: one polaroid at a time
  // ---------------------------------------------------------------------
  var ph = document.querySelector('.ph');
  if (ph) {
    var figs = ph.querySelectorAll('.ph-pol');
    var count = ph.querySelector('.ph-count');
    var shown = 0;
    var show = function (i) {
      shown = (i + figs.length) % figs.length;
      figs.forEach(function (fig, k) {
        fig.hidden = k !== shown;
        var video = fig.querySelector('video');
        if (!video) return;
        if (k === shown && !reduce.matches) {
          var p = video.play();
          if (p && p.catch) p.catch(function () { /* autoplay blocked: the poster shows */ });
        } else {
          video.pause();
        }
      });
      count.textContent = (shown + 1) + ' / ' + figs.length;
    };
    ph.querySelectorAll('[data-ph]').forEach(function (btn) {
      btn.addEventListener('click', function () { show(shown + Number(btn.dataset.ph)); });
    });
    show(0);
  }

  // ---------------------------------------------------------------------
  // Ilio's quest log
  // ---------------------------------------------------------------------
  var ilio = document.getElementById('iqIlio');
  if (ilio) {
    var wrap = document.querySelector('.iq-wrap');
    var log = document.getElementById('iqLog');
    var bang = ilio.querySelector('.iq-bang');
    var mark = ilio.querySelector('.iq-bang-in');
    var note = document.querySelector('.iq-note');
    var lying = ilio.querySelector('.iq-lying');
    var open = false;
    var seen = false;

    // The curled-up pose is hidden until the flop: decode it before she
    // needs it (when the section comes near), so the flop never waits on it
    var ready = null;
    var prepare = function () {
      if (!ready) {
        ready = lying.decode ? lying.decode().catch(function () {}) : Promise.resolve();
      }
      return ready;
    };
    if ('IntersectionObserver' in window) {
      var near = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        near.disconnect();
        prepare();
      }, { rootMargin: '800px 0px' });
      near.observe(ilio);
    } else {
      prepare();
    }

    var toggle = function () {
      seen = seen || open; // seen once it has been open and closed again
      open = !open;
      ilio.classList.toggle('is-lie', open);
      ilio.setAttribute('aria-expanded', open ? 'true' : 'false');
      ilio.setAttribute('aria-label', open ? 'Ilio, close the quest log' : 'Ilio, she stole my quest log. Get it back');
      wrap.classList.toggle('is-on', open);
      bang.classList.toggle('is-seen', seen);
      bang.classList.toggle('is-taken', open);
      mark.textContent = seen ? '?' : '!';
      var thanks = seen && !open;
      note.classList.toggle('is-on', thanks);
      note.textContent = thanks ? 'Thanks for getting it back. She’ll steal it again.' : '';
      // Stacked: the log opens under her. Only if it opened entirely below
      // the screen, scroll just far enough to show its top; otherwise leave
      // the scrolling to the visitor.
      if (open && stacked.matches) {
        requestAnimationFrame(function () {
          var top = log.getBoundingClientRect().top;
          var room = window.innerHeight - 96;
          if (top > room) {
            window.scrollBy({ top: top - room, behavior: reduce.matches ? 'auto' : 'smooth' });
          }
        });
      }
    };
    // First flop: wait for the curled-up pose (at most 400ms), then go
    var busy = false;
    ilio.addEventListener('click', function () {
      if (busy) return;
      if (open) { toggle(); return; }
      busy = true;
      var go = function () {
        if (!busy) return;
        busy = false;
        toggle();
      };
      prepare().then(go);
      setTimeout(go, 400);
    });
    log.querySelector('[data-iq-close]').addEventListener('click', function () {
      toggle();
      ilio.focus();
    });
  }
})();
