// Small things only: nav state and the dev grid overlay.
// Marquee pause arrives with the homepage (step 2).

(function () {
  'use strict';

  // ---------------------------------------------------------------------
  // Nav state: the header is identical on every page, so mark the
  // current section here instead of in the markup.
  // ---------------------------------------------------------------------
  var path = window.location.pathname;
  var section = null;
  if (path.indexOf('/work/') === 0) section = 'work';
  else if (path === '/about.html' || path === '/about') section = 'about';

  if (section) {
    var link = document.querySelector('.nav [data-nav="' + section + '"]');
    if (link) link.setAttribute('aria-current', 'page');
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
