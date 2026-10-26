// Opening a project (021, 040): cross-document View Transitions.
// Loaded in <head> without defer: the pagereveal listener has to exist
// before the first render of the incoming page.
//
// Desktop ('morph', reference/transition-desktop.dc.html): the ticket's stub
//   tears off (0.34s) while the card straightens, then the card photo
//   grows into the case study hero (0.7s, position and size only) and
//   the rest of the case study rises in under it. From Next up the
//   preview grows into the next hero the same way.
// Phone ('rip', reference/transition-mobile.dc.html): the image lifts, the
//   yellow paper tears up from the bottom (0.6s), then on the new page the
//   paper tears off the top and reveals the case study (0.5s).
// Only project openings animate: every other navigation skips the
// transition. No support or reduced motion: a plain page load.
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
  // Incoming page: only run the transition when a project was opened. The
  // class picks the styles in css/motion.css and names the hero.
  // ---------------------------------------------------------------------
  window.addEventListener('pagereveal', function (e) {
    var type = takeMark(); // always consumed, also when nothing animates
    if (!e.viewTransition) return;
    // A project link to a page that doesn't exist yet lands on the 404,
    // which has its own intro: no morph or paper there
    if (!type || document.documentElement.getAttribute('data-page') === '404') {
      e.viewTransition.skipTransition();
      return;
    }
    var cls = 'is-vt-' + type;
    document.documentElement.classList.add(cls);
    e.viewTransition.finished.then(function () {
      document.documentElement.classList.remove(cls);
    });
  });

  if (!supported) return;

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
  // always the brand yellow (021), also from Next up on a case study.
  // Paths from reference/transition-mobile.dc.html.
  function rip(link, url) {
    var lift = link.classList.contains('card') ? link.querySelector('.card-img') : document.querySelector('.next-prev');
    if (lift) lift.classList.add('is-lift');
    setTimeout(function () {
      var paper = document.createElement('div');
      paper.className = 'vt-rip';
      paper.setAttribute('aria-hidden', 'true');
      paper.innerHTML = '<span class="vt-rip-fibre"></span><span class="vt-rip-paper"></span>';
      document.body.appendChild(paper);
      var left = false;
      function leave() {
        if (left) return;
        left = true;
        mark('rip');
        go(url);
      }
      paper.addEventListener('animationend', leave);
      setTimeout(leave, 700); // in case animationend never fires
    }, 180);
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var link = e.target.closest && e.target.closest('a.card, a.next-title, a.next-prev');
    if (!link || reduce.matches) return;
    var url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;
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
