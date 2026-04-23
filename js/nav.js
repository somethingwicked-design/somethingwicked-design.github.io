(function () {
  var inPages = window.location.pathname.replace(/\\/g, '/').indexOf('/pages/') !== -1;
  var base    = inPages ? '../' : '';
  var aboutHref = inPages ? 'about.html' : 'pages/about.html';
  var isAbout   = window.location.pathname.replace(/\\/g, '/').endsWith('/about.html');

  var nav = document.getElementById('nav');
  if (!nav) return;

  nav.innerHTML =
    '<a href="' + base + 'index.html" class="nav-name">' +
      '<span class="nav-something">Something</span>' +
      '<span class="nav-wicked">Wicked</span>' +
    '</a>' +
    '<div class="nav-right">' +
      '<ul class="nav-links">' +
        '<li><a href="' + base + 'index.html#work" data-i18n="nav.work">Work</a></li>' +
        '<li><a href="' + aboutHref + '"' + (isAbout ? ' class="nav-active"' : '') + ' data-i18n="nav.about">About</a></li>' +
        '<li><a href="' + base + 'index.html#contact" data-i18n="nav.contact">Contact</a></li>' +
      '</ul>' +
      '<button id="lang-toggle" class="nav-lang-toggle">' +
        '<span data-lang="en">EN</span>' +
        '<span class="lang-sep"> | </span>' +
        '<span data-lang="nl">NL</span>' +
      '</button>' +
    '</div>';
}());
