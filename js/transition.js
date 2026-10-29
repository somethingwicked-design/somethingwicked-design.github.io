// Opening a project (021, 040).
// Loaded in <head> without defer: the incoming page has to set itself up
// before its first render.
//
// Desktop ('morph', reference/transition-desktop.dc.html): the ticket's stub
//   tears off (0.34s) while the card straightens, then the card photo
//   grows into the case study hero (0.7s, position and size only) and
//   the rest of the case study rises in under it. From Next up the
//   preview grows into the next hero the same way.
//   A cross-document View Transition: where the browser has none (Firefox
//   for now), a plain page load.
// Phone ('rip', reference/transition-mobile.dc.html): the image lifts, the
//   paper tears up from the bottom (0.6s), then on the new page the
//   paper shows how far the case study's first screen has loaded and only
//   tears off at 100% (0.5s). No View Transition: plain CSS and a little
//   script on both pages, so it works in every browser. The paper is the
//   project you're going to (056): its accent, with its --on-accent text.
// Only project openings animate: every other navigation skips the
// transition. Reduced motion: a plain page load.
// The styles and keyframes are in css/motion.css.

(function () {
  'use strict';

  var KEY = 'sw-vt';
  var supported = 'onpagereveal' in window;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var phone = window.matchMedia('(max-width: 759.98px)');
  var busy = false;

  function mark(type) {
    try { sessionStorage.setItem(KEY, JSON.stringify({ type: type, t: Date.now() })); } catch (e) { /* private mode */ }
  }
  function takeMark() {
    try {
      var v = JSON.parse(sessionStorage.getItem(KEY));
      sessionStorage.removeItem(KEY);
      // A mark left behind by a failed navigation (a 404) must not animate
      // some later, unrelated page load
      return v && Date.now() - v.t < 5000 ? v.type : null;
    } catch (e) { return null; }
  }

  // ---------------------------------------------------------------------
  // Incoming page: only animate when a project was opened. A project link
  // to a page that doesn't exist yet lands on the 404, which has its own
  // intro: no morph or paper there.
  // ---------------------------------------------------------------------
  var html = document.documentElement;
  html.classList.add('js'); // CSS can wait for scripts that will run (About's deal)
  var type = takeMark(); // always consumed, also when nothing animates
  if (reduce.matches || html.getAttribute('data-page') === '404') type = null;

  // The paper takes the destination project's colour (056): its accent and
  // --on-accent, as on its <body>. Each colour has a paint tile in
  // img/paper/ like the yellow, so Samsung Internet's forced dark mode
  // (which recolours colours, not images) leaves it alone. Anything that
  // isn't a project keeps the yellow, as does Something Wicked (its accent
  // is the yellow). scripts/check-shared.js checks these against the pages.
  var PAPER = {
    'op-jezelf': ['#C4DCA4', '#0B0B0B'],
    'restock': ['#E8A67E', '#2B2620'],
    'health-potion': ['#8A6B7D', '#FFFFFF'],
    'de-bote': ['#C8102E', '#F2EEE6'],
    'kokoro': ['#F0E4AC', '#0B0B0B']
  };
  function slugOf(path) {
    var m = /^\/work\/([a-z-]+)(\.html)?$/.exec(path);
    return m ? m[1] : null;
  }

  // The paper, with 'Loading' and the percentage on it (021)
  function paper(path) {
    var el = document.createElement('div');
    el.className = 'vt-rip';
    el.setAttribute('aria-hidden', 'true');
    var slug = slugOf(path);
    var c = PAPER[slug];
    if (c) {
      el.style.setProperty('--rip-bg', c[0]);
      el.style.setProperty('--rip-fg', c[1]);
      el.style.setProperty('--rip-paint', "url('/img/paper/" + slug + ".webp')");
    }
    el.innerHTML = '<span class="vt-rip-fibre"></span><span class="vt-rip-paper"></span>' +
      '<span class="vt-rip-load"><span class="vt-rip-label">Loading</span><span class="vt-rip-pct">0%</span></span>';
    return el;
  }

  // Phone: the paper covers the page from its first paint (this script
  // runs before it, so it goes straight into <html>) and counts what the
  // first screen needs: the stylesheets (done: this script waits for them),
  // the page itself, the fonts and every image in the first screen. The
  // number eases towards the share that's done, never goes back and holds
  // at 99 until everything is in. At 100 the paper tears off: at the
  // earliest 0.4s after it went up, at the latest after 4s.
  if (type === 'rip') ripIn();

  function ripIn() {
    var el = paper(window.location.pathname);
    el.classList.add('is-in');
    html.appendChild(el);
    var pctEl = el.querySelector('.vt-rip-pct');
    var start = Date.now();
    var total = 4;   // stylesheets, page, fonts, at least one image (a guess until the page is read)
    var done = 1;    // the stylesheets
    var target = 0;  // never goes down
    var shown = 0;
    var complete = false;
    var off = false;
    var live = document.createElement('p');
    live.className = 'visually-hidden';
    live.setAttribute('aria-live', 'polite');

    function step() {
      if (off) return;
      target = Math.max(target, complete ? 100 : Math.min(99, done / total * 100));
      // While loading: ease gently towards the share that's done. Once
      // everything is in: race to 100 (about 0.15s), so a fast page is
      // never kept waiting by the counter
      var gap = target - shown;
      var rate = complete ? 0.35 : 0.12;
      var least = complete ? 4 : 0.5;
      shown = gap < least ? target : shown + Math.max(gap * rate, least);
      pctEl.textContent = Math.floor(shown) + '%';
      if (complete && shown >= 100 && Date.now() - start >= 400) { tearOff(); return; }
      requestAnimationFrame(step);
    }
    function tick() {
      done++;
      if (done >= total) complete = true;
    }
    function tearOff() {
      off = true;
      el.classList.add('is-off');
      live.textContent = 'Loaded';
      var gone = function () {
        el.remove();
        setTimeout(function () { live.remove(); }, 2000);
      };
      el.addEventListener('animationend', gone);
      setTimeout(gone, 900); // in case animationend never fires
    }

    document.addEventListener('DOMContentLoaded', function () {
      // Screen readers: 'Loading' once now, 'Loaded' at the end, no numbers
      document.body.appendChild(live);
      live.textContent = 'Loading';
      // The images in the first screen (the hero first of all)
      var imgs = Array.prototype.filter.call(document.images, function (img) {
        var r = img.getBoundingClientRect();
        return r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
      });
      total = 3 + imgs.length; // stylesheets, page, fonts, images
      tick(); // the page
      var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
      fonts.then(tick, tick);
      imgs.forEach(function (img) {
        var loaded = img.complete ? Promise.resolve() : new Promise(function (res) {
          img.addEventListener('load', res);
          img.addEventListener('error', res);
        });
        loaded.then(function () { return img.decode ? img.decode().catch(function () {}) : null; }).then(tick);
      });
    });
    // At most 4s: then it's done, whatever is still loading
    setTimeout(function () { complete = true; }, 4000);
    requestAnimationFrame(step);
  }

  // Desktop: the morph, as a View Transition. Every other navigation in a
  // browser that has them (and the rip) skips it.
  var morphIn = type === 'morph';
  window.addEventListener('pagereveal', function (e) {
    var morph = morphIn;
    morphIn = false; // once: not again when coming back from the bfcache
    if (!e.viewTransition) return;
    if (!morph) {
      // Skipping rejects these promises: expected, not an error
      var quiet = function () {};
      e.viewTransition.ready.catch(quiet);
      e.viewTransition.finished.catch(quiet);
      e.viewTransition.skipTransition();
      return;
    }
    html.classList.add('is-vt-morph');
    e.viewTransition.finished.then(function () {
      html.classList.remove('is-vt-morph');
    });
  });

  // ---------------------------------------------------------------------
  // Outgoing page
  // ---------------------------------------------------------------------
  function go(url) {
    window.location.href = url;
  }

  // Desktop: tear the stub, then name the photo and the header and leave
  function morph(link, url) {
    var isCard = link.classList.contains('card');
    var photo = isCard ? link.querySelector('.card-img') : document.querySelector('.next-prev');
    var ticket = null;
    var tilted = false;
    if (isCard) {
      if (link.classList.contains('is-hover')) ticket = link.querySelector('.ticket--pointer');
      else if (link.matches(':focus-visible')) ticket = link.querySelector('.ticket--focus');
      // Hover tilt still on? matrix(a, b, ...): b is 0 unless rotated
      var m = getComputedStyle(photo).transform.match(/^matrix\(([^,]+),\s*([^,]+)/);
      tilted = !!m && Math.abs(parseFloat(m[2])) > 1e-4;
      // Keeps the card lifted and the ticket still, and straightens the
      // card (0.2s) so the View Transition captures it at 0deg
      link.classList.add('is-opening');
    }
    if (ticket) ticket.classList.add('is-torn');
    setTimeout(function () {
      if (photo) photo.style.viewTransitionName = 'cs-hero';
      var head = document.querySelector('.site-header');
      if (head) head.style.viewTransitionName = 'site-header';
      mark('morph');
      go(url);
    }, ticket ? 340 : tilted ? 200 : 0);
  }

  // Phone: lift, tear the paper up over the page, then leave. The paper is
  // the colour of the project it opens (056), from a card or Next up.
  // Paths from reference/transition-mobile.dc.html.
  function rip(link, url) {
    var lift = link.classList.contains('card') ? link.querySelector('.card-img') : document.querySelector('.next-prev');
    if (lift) lift.classList.add('is-lift');
    setTimeout(function () {
      var el = paper(new URL(url).pathname); // shows 0% while it tears up
      document.body.appendChild(el);
      var left = false;
      function leave() {
        if (left) return;
        left = true;
        mark('rip');
        go(url);
      }
      el.addEventListener('animationend', leave);
      setTimeout(leave, 700); // in case animationend never fires
    }, 180);
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var link = e.target.closest && e.target.closest('a.card, a.next-title, a.next-prev');
    if (!link || reduce.matches) return;
    var url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    // Desktop without View Transitions: a plain page load
    if (!phone.matches && !supported) return;
    e.preventDefault();
    if (busy) return;
    busy = true;
    if (phone.matches) rip(link, url.href);
    else morph(link, url.href);
  });

  // Back to a page from the back/forward cache: undo the outgoing state
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    busy = false;
    document.querySelectorAll('.is-opening, .is-torn, .is-lift').forEach(function (el) {
      el.classList.remove('is-opening', 'is-torn', 'is-lift');
    });
    document.querySelectorAll('.card-img, .next-prev, .site-header').forEach(function (el) {
      el.style.viewTransitionName = '';
    });
    document.querySelectorAll('.vt-rip').forEach(function (el) { el.remove(); });
  });
})();
