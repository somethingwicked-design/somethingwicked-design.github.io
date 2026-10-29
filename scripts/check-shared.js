// The parts every page repeats (no build step) must stay the same on every
// page: the shared <head> lines, the header with the phone menu, and the
// footer. Compares each page with index.html and fails on a difference.
// Also checks that the rip paper in js/transition.js (056) has the same
// colours as each case study's <body> (--accent, --on-accent).
// Run from anywhere: node scripts/check-shared.js
//
// Allowed differences:
//   - 404.html has no footer, so its Contact links go to /#contact
//   - anything between <!-- page-only: … --> and <!-- /page-only -->: the
//     About quest line (030) and Something Wicked's Ilio (058)

'use strict';

var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var pages = ['index.html', 'about.html', '404.html'].concat(
  fs.readdirSync(path.join(root, 'work'))
    .filter(function (f) { return f.endsWith('.html'); })
    .sort()
    .map(function (f) { return 'work/' + f; })
);

// Each part: where it starts and where it ends (both included)
var PARTS = {
  head: ['<!-- head: keep in sync -->', '<!-- /head -->'],
  header: ['<header class="site-header">', '<!-- /header -->'],
  footer: ['<footer class="site-footer"', '</footer>']
};

function part(html, name) {
  var a = html.indexOf(PARTS[name][0]);
  if (a < 0) return null;
  var b = html.indexOf(PARTS[name][1], a);
  if (b < 0) return null;
  return html.slice(a, b + PARTS[name][1].length)
    .replace(/\n[ \t]*<!-- page-only:[\s\S]*?<!-- \/page-only -->/g, '');
}

function allowed(page, name, text) {
  if (page === '404.html' && name === 'header') return text.split('href="/#contact"').join('href="#contact"');
  return text;
}

var failed = 0;
var ref = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
pages.forEach(function (page) {
  var html = fs.readFileSync(path.join(root, page), 'utf8');
  Object.keys(PARTS).forEach(function (name) {
    var want = part(ref, name);
    var got = part(html, name);
    if (got === null) {
      if (page === '404.html' && name === 'footer') return;
      failed++;
      console.log('✗ ' + page + ': no ' + name);
      return;
    }
    got = allowed(page, name, got);
    if (got === want) return;
    failed++;
    var w = want.split('\n');
    var g = got.split('\n');
    var i = 0;
    while (w[i] === g[i]) i++;
    console.log('✗ ' + page + ': ' + name + ' differs from index.html, line ' + (i + 1) + ' of the ' + name);
    console.log('    index.html: ' + (w[i] === undefined ? '(ends)' : w[i].trim()));
    console.log('    ' + page + ': ' + (g[i] === undefined ? '(ends)' : g[i].trim()));
  });
});

// The rip paper's colours (js/transition.js PAPER) against each case
// study's <body>. A project without an entry gets the yellow paper, so its
// accent must be the yellow (Something Wicked). No --on-accent is ink.
var YELLOW = ['#E8C547', '#0B0B0B'];
var js = fs.readFileSync(path.join(root, 'js/transition.js'), 'utf8');
var paper = {};
var block = /var PAPER = \{([\s\S]*?)\};/.exec(js);
if (block) {
  block[1].replace(/'([a-z-]+)': \['(#[0-9A-Fa-f]{6})', '(#[0-9A-Fa-f]{6})'\]/g, function (m, slug, bg, fg) {
    paper[slug] = [bg, fg];
  });
}
pages.filter(function (p) { return p.indexOf('work/') === 0; }).forEach(function (page) {
  var slug = page.slice(5, -5);
  var body = /<body[^>]*style="([^"]*)"/.exec(fs.readFileSync(path.join(root, page), 'utf8'));
  var style = body ? body[1] : '';
  function prop(name, fallback) {
    var m = new RegExp(name + ':\\s*(#[0-9A-Fa-f]{6})').exec(style);
    return (m ? m[1] : fallback).toUpperCase();
  }
  var page2 = [prop('--accent', ''), prop('--on-accent', '#0B0B0B')];
  var rip = (paper[slug] || YELLOW).map(function (c) { return c.toUpperCase(); });
  if (page2[0] !== rip[0] || page2[1] !== rip[1]) {
    failed++;
    console.log('✗ ' + page + ': <body> has ' + page2.join(' / ') + ', the rip paper in js/transition.js ' + rip.join(' / '));
  }
  if (paper[slug] && !fs.existsSync(path.join(root, 'img/paper/' + slug + '.webp'))) {
    failed++;
    console.log('✗ ' + page + ': no img/paper/' + slug + '.webp for the rip paper');
  }
});
Object.keys(paper).forEach(function (slug) {
  if (pages.indexOf('work/' + slug + '.html') < 0) {
    failed++;
    console.log('✗ js/transition.js: rip paper for ' + slug + ', which has no page');
  }
});

if (failed) {
  console.log(failed + ' difference' + (failed > 1 ? 's' : ''));
  process.exit(1);
}
console.log('✓ head, header and footer match on ' + pages.length + ' pages; rip paper colours match the case studies');
