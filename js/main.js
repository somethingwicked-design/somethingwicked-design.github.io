// Small things only: nav state, header on scroll, phone menu, marquee pause,
// the work list (Load more, #all-work, Just seen, View case ticket) and the
// dev grid overlay.

(function () {
  'use strict';

  // ---------------------------------------------------------------------
  // Nav state: the header is identical on every page, so mark the
  // current section here instead of in the markup (025). The homepage
  // has no current item.
  // ---------------------------------------------------------------------
  var path = window.location.pathname;
  var section = null;
  if (path.indexOf('/work/') === 0) section = 'work';
  else if (path === '/about.html' || path === '/about') section = 'about';

  if (section) {
    document.querySelectorAll('[data-nav="' + section + '"]').forEach(function (link) {
      link.setAttribute('aria-current', 'page');
    });
  }

  // ---------------------------------------------------------------------
  // Header (032): dark bar once scrolled, hides while scrolling down past
  // 120px, folds back in as soon as you scroll up. Reduced motion: the
  // slide is switched off in CSS, it simply appears and disappears.
  // ---------------------------------------------------------------------
  var head = document.querySelector('.site-header');
  if (head) {
    var lastY = window.scrollY;
    var onScroll = function () {
      var y = window.scrollY;
      head.classList.toggle('is-solid', y > 8);
      if (y > lastY && y > 120) head.classList.add('is-hidden');
      else if (y < lastY) head.classList.remove('is-hidden');
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------------------------------------------------------------------
  // Phone menu (020): the MENU box opens a full-screen <dialog>. Focus
  // stays inside, Escape closes it and focus returns to the MENU box.
  // ---------------------------------------------------------------------
  var menu = document.getElementById('menu');
  var menuOpenBtn = document.querySelector('[aria-controls="menu"]');
  if (menu && menuOpenBtn && typeof menu.showModal === 'function') {
    menuOpenBtn.addEventListener('click', function () {
      menu.showModal();
      menuOpenBtn.setAttribute('aria-expanded', 'true');
    });
    menu.addEventListener('close', function () {
      menuOpenBtn.setAttribute('aria-expanded', 'false');
    });
    menu.querySelectorAll('[data-menu-close], a').forEach(function (el) {
      el.addEventListener('click', function () { menu.close(); });
    });
    // The menu is for phones: close it once the window is 760px or wider
    window.matchMedia('(min-width: 760px)').addEventListener('change', function (e) {
      if (e.matches && menu.open) menu.close();
    });
  }

  // ---------------------------------------------------------------------
  // Marquee: pause on hover and while off screen (saves work, and stops
  // motion nobody is looking at). Reduced motion is handled in CSS.
  // ---------------------------------------------------------------------
  document.querySelectorAll('[data-marquee]').forEach(function (band) {
    var hovered = false;
    var visible = true;
    function update() {
      band.classList.toggle('is-paused', hovered || !visible);
    }
    band.addEventListener('pointerenter', function () { hovered = true; update(); });
    band.addEventListener('pointerleave', function () { hovered = false; update(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        update();
      }).observe(band);
    }
  });

  // ---------------------------------------------------------------------
  // Just seen (021): a case study page adds its slug (body[data-project])
  // to this visit's list; the homepage dims those cards.
  // ---------------------------------------------------------------------
  var SEEN_KEY = 'sw-seen';
  function readSeen() {
    try { return JSON.parse(sessionStorage.getItem(SEEN_KEY)) || []; } catch (e) { return []; }
  }
  var project = document.body.getAttribute('data-project');
  if (project) {
    var seenList = readSeen();
    if (seenList.indexOf(project) === -1) {
      seenList.push(project);
      try { sessionStorage.setItem(SEEN_KEY, JSON.stringify(seenList)); } catch (e) { /* private mode */ }
    }
  }

  // ---------------------------------------------------------------------
  // Selected work (019, 036, 040)
  // ---------------------------------------------------------------------
  var work = document.getElementById('work');
  if (work) {
    var cards = work.querySelectorAll('.card');
    var moreCards = work.querySelectorAll('.card[data-more]');
    var more = work.querySelector('.more');
    var moreBtn = more && more.querySelector('button');

    readSeen().forEach(function (slug) {
      var badge = work.querySelector('.card[data-slug="' + slug + '"] .seen');
      if (badge) badge.hidden = false;
    });

    function showAll() {
      moreCards.forEach(function (card) { card.classList.add('is-shown'); });
      if (more) more.hidden = true;
    }

    // Load more: reveal the rest, move focus to the first new card
    if (more && moreCards.length) {
      more.hidden = false;
      moreBtn.addEventListener('click', function () {
        showAll();
        moreCards[0].focus();
      });
    }

    // '/#all-work' (from 'All work' on a case study) lands on Selected
    // work with every project loaded. A plain '#work' keeps Load more.
    // Arriving from another page it jumps (smooth scrolling gets cut off
    // while fonts and images settle), and once more on load to be sure.
    function onAllWork(e) {
      if (window.location.hash !== '#all-work') return;
      showAll();
      work.scrollIntoView({ block: 'start', behavior: e && e.type === 'hashchange' ? 'smooth' : 'instant' });
    }
    onAllWork();
    window.addEventListener('hashchange', onAllWork);
    if (document.readyState !== 'complete') window.addEventListener('load', onAllWork);

    // View case ticket: follows a fine pointer over the image. Not on
    // touch. Keyboard focus uses the parked ticket (CSS only).
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (finePointer.matches) {
      work.classList.add('has-ticket');
      cards.forEach(function (card) {
        var img = card.querySelector('.card-img');
        var ticket = card.querySelector('.ticket--pointer');
        if (!img || !ticket) return;
        img.addEventListener('pointermove', function (e) {
          if (e.pointerType === 'touch') return;
          var r = card.getBoundingClientRect();
          ticket.style.left = (e.clientX - r.left) + 'px';
          ticket.style.top = (e.clientY - r.top) + 'px';
          card.classList.add('is-hover');
        });
        img.addEventListener('pointerleave', function () {
          card.classList.remove('is-hover');
        });
      });
    }
  }

  // ---------------------------------------------------------------------
  // Dev-only grid overlay: add ?grid to the URL or press G.
  // Off by default and never visible to visitors.
  // ---------------------------------------------------------------------
  var overlay = null;

  function buildOverlay() {
    var el = document.createElement('div');
    el.className = 'dev-grid';
    el.setAttribute('aria-hidden', 'true');
    var cols = '';
    for (var i = 0; i < 12; i++) cols += '<span></span>';
    el.innerHTML = '<div class="wrap"><div class="g12">' + cols + '</div></div>';
    return el;
  }

  function toggleGrid(force) {
    var show = typeof force === 'boolean' ? force : !overlay;
    if (show && !overlay) {
      overlay = buildOverlay();
      document.body.appendChild(overlay);
    } else if (!show && overlay) {
      overlay.remove();
      overlay = null;
    }
  }

  var gridParam = new URLSearchParams(window.location.search).has('grid');
  var isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname) ||
    window.location.protocol === 'file:';

  if (gridParam) toggleGrid(true);

  // The G shortcut only listens locally or after ?grid, so a visitor
  // typing G on the live site never sees it.
  if (!gridParam && !isLocal) return;

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'g' && e.key !== 'G') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target;
    if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    toggleGrid();
  });
})();
