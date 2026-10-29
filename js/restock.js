// ReStock cards (050), rebuilt from the prototypes in the vault
// (reference/restock-*.html). Every <figure class="media cs-card rsc"
// data-rsc="…"> in the case study becomes one card, so swapping a card is
// changing that attribute. Motion, timing, layout and text follow the
// prototypes. New Spirit Bold is licensed, so Fraunces Black Soft stands in
// for it, and every card that shows it says so in its source line.
// Styles: css/restock.css. Frame, header, pause button, clock,
// the loop and when a card plays are shared with the other case studies:
// js/cards.js.

(function () {
  'use strict';

  var C = window.SWCards;
  var hd = C.hd;
  var seq = C.seq;

  var each = C.each;
  // A note on a stand-in font ('Shown in …') stays on phones too
  function src(a, b) { return C.src('rsc', a, b, /^Shown in/.test(b)); }

  var CARDS = {};

  // ---------------------------------------------------------------------
  // Typography: New Spirit Bold and Figtree as big 'Aa', then both in a
  // real Kitchen row
  // ---------------------------------------------------------------------
  CARDS.type = {
    ctl: 'typography animation',
    label: 'ReStock typography: New Spirit Bold for the wordmark and headlines, Figtree for the interface and body text, shown together in the Kitchen screen. New Spirit is shown in Fraunces, a close match',
    build: function (card, t) {
      card.innerHTML = hd('Typography', 'Two typefaces') +
        '<div aria-hidden="true">' +
          '<div class="rsc-spec">' +
            '<div class="rsc-sp"><span class="rsc-aa rsc-fr"><span>Aa</span></span><div class="rsc-nm">New Spirit Bold</div><div class="rsc-ro">Wordmark and headlines</div></div>' +
            '<div class="rsc-sp rsc-sp--figtree"><span class="rsc-aa"><span>Aa</span></span><div class="rsc-nm">Figtree</div><div class="rsc-ro">Everything you tap and read</div></div>' +
          '</div>' +
          '<div class="rsc-use">' +
            '<div class="rsc-kt rsc-fr"><span>Your kitchen</span></div>' +
            '<div class="rsc-row"><span class="rsc-av"><i></i></span><span class="rsc-it"><b>Strawberries</b><span>1× box</span></span><span class="rsc-pill">Worth a look</span></div>' +
          '</div>' +
        '</div>' +
        src('Chunky and grounded, like the icons', 'Shown in Fraunces, a close match');
      function add(c) { return function () { card.classList.add(c); }; }
      return {
        still: function () { card.classList.add('is-v', 'is-u'); },
        play: function () {
          seq(t, [
            [300, add('is-v')],
            [1500, add('is-u')],
            [3400 + 2500, function () { card.classList.remove('is-u'); }],
            [900, function () { card.classList.remove('is-v'); }],
            [1000, function () {}]
          ]);
        }
      };
    }
  };

  // ---------------------------------------------------------------------
  // Colour: the palette on charcoal as three rings turning against each
  // other. Inner ring the deep shades, middle the base colours, outer the
  // light and pale tints; on each ring the dots are spaced evenly and
  // ordered by family. Each family steps forward, then all 25. Sizes so
  // the outlines never touch (050): dots 5cqw, rings at 13/24/35%.
  // ---------------------------------------------------------------------
  // [radius %, turn time, direction, [[colour, family], …]]
  var RINGS = [
    [13, 40, 'normal', [['#803720', 0], ['#A87A22', 1], ['#C98A1F', 1], ['#556240', 2], ['#5C6B3E', 2], ['#5C4358', 3], ['#2B2620', 4]]],
    [24, 56, 'reverse', [['#B24E2E', 0], ['#E0785A', 0], ['#E0A83E', 1], ['#7C8F5E', 2], ['#6FA89A', 2], ['#83617A', 3], ['#7C93A0', 3], ['#9A9080', 4]]],
    [35, 72, 'normal', [['#E8A67E', 0], ['#F3DED4', 0], ['#F0C670', 1], ['#F7E9CB', 1], ['#B9CBA0', 2], ['#E7ECDF', 2], ['#B98FAE', 3], ['#EBE0E8', 3], ['#D8D0C0', 4], ['#FFFCF7', 4]]]
  ];
  var FAMILIES = [
    ['Terracotta', 5, 'The wordmark, the anchor'],
    ['Buttery yellow', 5, 'Grains &amp; pulses, Use soon'],
    ['Sage', 6, 'Vegetables &amp; fruit'],
    ['Plum', 5, 'Snacks &amp; drinks, Today'],
    ['Neutrals', 4, 'Text, lines and cards']
  ];
  CARDS.colour = {
    ctl: 'colour animation',
    label: 'ReStock palette: five colour families, each from deep to pale: terracotta for the wordmark, sage for vegetables and fruit, buttery yellow for grains and pulses and Use soon, plum for snacks and drinks and Today, and neutrals for text, lines and cards; plus seafoam, dusty blue, mustard gold, moss, coral, stone, warm grey and soft white for illustrations',
    build: function (card, t) {
      var rings = RINGS.map(function (r, ri) {
        var n = r[3].length;
        // The dots pop in one after another, each ring .18s after the last
        var dl = ri * .18;
        return '<div class="rsc-rg"><i class="rsc-orbit" style="width:' + 2 * r[0] + '%;height:' + 2 * r[0] + '%"></i>' +
          r[3].map(function (d, k) {
            var a = -Math.PI / 2 + k * 2 * Math.PI / n;
            var html = '<i class="rsc-d' + (d[0] === '#2B2620' ? ' rsc-d--rim' : '') + '" data-f="' + d[1] + '" style="left:' + (50 + r[0] * Math.cos(a)).toFixed(2) + '%;top:' + (50 + r[0] * Math.sin(a)).toFixed(2) + '%;--c:' + d[0] + ';--dl:' + dl.toFixed(2) + 's"></i>';
            dl += .03;
            return html;
          }).join('') + '</div>';
      }).join('');
      card.innerHTML = hd('Colour', 'The full palette') +
        '<div class="rsc-fl" aria-hidden="true">' + rings +
          '<i class="rsc-d rsc-d--core" style="left:50%;top:50%;--c:#F7F3EC;--dl:0s"></i>' +
        '</div>' +
        '<div class="rsc-cap" aria-hidden="true"><span class="rsc-capnm rsc-fr"></span><span class="rsc-caprl"></span></div>' +
        src('Six carry meaning, the rest are for illustration', 'ReStock');
      var D = card.querySelectorAll('.rsc-d');
      var cap = card.querySelector('.rsc-cap');
      var nm = card.querySelector('.rsc-capnm');
      var rl = card.querySelector('.rsc-caprl');
      function text(a, b, c) {
        nm.textContent = a;
        rl.innerHTML = '<b>' + b + '</b>' + c;
      }
      function say(a, b, c) {
        cap.classList.add('is-hide');
        t.at(350, function () {
          text(a, b, c);
          cap.classList.remove('is-hide');
        });
      }
      function fam(k) {
        return function () {
          card.classList.add('is-fo');
          each(D, function (d) { d.classList.toggle('is-hl', +d.getAttribute('data-f') === k); });
          say(FAMILIES[k][0], FAMILIES[k][1] + ' colours', FAMILIES[k][2]);
        };
      }
      function all() {
        card.classList.remove('is-fo');
        each(D, function (d) { d.classList.remove('is-hl'); });
        say('25 colours', '5 groups', 'Deep inside, light outside');
      }
      text('25 colours', '5 groups', 'Deep inside, light outside');
      // The rings turn on the card's clock, so Pause and leaving the
      // screen stop them too
      var spinning = false;
      function spin() {
        card.classList.add('is-on');
        if (spinning) return;
        spinning = true;
        each(card.querySelectorAll('.rsc-rg'), function (rg, i) {
          t.anim(rg.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], {
            duration: RINGS[i][1] * 1000,
            iterations: Infinity,
            direction: RINGS[i][2]
          }));
        });
      }
      return {
        still: function () { card.classList.add('is-on'); },
        play: function () {
          seq(t, [
            [300, spin],
            [2600, fam(0)], [2600, fam(1)], [2600, fam(2)], [2600, fam(3)], [2600, fam(4)],
            [2600, all],
            [3000 + 2500, function () { card.classList.remove('is-on'); }],
            [1300, function () {}]
          ]);
        }
      };
    }
  };

  // ---------------------------------------------------------------------
  // What the first test changed: three findings, one at a time (about 5s
  // each), each with the change it led to
  // ---------------------------------------------------------------------
  var FINDINGS = [
    ['4 of 4', 'didn’t know what <b>Produce</b> meant on the full list', 'So the category became <b>Vegetables &amp; fruit</b>.'],
    ['5 of 6', 'found what to use first with the <b>Use soon</b> chip', 'So the Kitchen now opens on <b>Needs attention</b>.'],
    ['1 of 7', 'tapped a category chip without being asked', 'So search, sort and filter became <b>one calm bar</b>.']
  ];
  CARDS.findings = {
    ctl: 'findings animation',
    label: 'What the first ReStock test changed: 4 of 4 people did not know what Produce meant, so the category became Vegetables and fruit; 5 of 6 found what to use first with the Use soon chip, so the Kitchen opens on Needs attention; 1 of 7 tapped a category chip, so search, sort and filter became one bar',
    build: function (card, t) {
      card.innerHTML = hd('Research', 'What the first test changed') +
        '<div class="rsc-dots" aria-hidden="true"><i></i><i></i><i></i></div>' +
        '<div aria-hidden="true">' + FINDINGS.map(function (f) {
          return '<div class="rsc-sl">' +
            '<div class="rsc-num rsc-fr"><span>' + f[0] + '</span></div>' +
            '<p class="rsc-fd">' + f[1] + '</p>' +
            '<div class="rsc-ch"><span class="rsc-ar">&rarr;</span><p>' + f[2] + '</p></div>' +
          '</div>';
        }).join('') + '</div>' +
        src('7 think-aloud sessions, 28-29 Sept 2026', 'Shown in Fraunces, a close match');
      var S = card.querySelectorAll('.rsc-sl');
      var Dt = card.querySelectorAll('.rsc-dots i');
      var cur = -1;
      function go(i) {
        var n = S[i];
        if (cur >= 0) {
          var p = S[cur];
          p.classList.remove('is-a');
          p.classList.add('is-o');
          t.at(600, function () { p.classList.remove('is-o'); });
          t.at(520, function () { n.classList.add('is-a'); });
        } else {
          n.classList.add('is-a');
        }
        each(Dt, function (d, k) { d.classList.toggle('is-on', k === i); });
        cur = i;
      }
      return {
        still: function () { go(0); },
        play: function () {
          // Long enough to read; rest on the last one
          seq(t, [
            [300, function () { go(0); }],
            [5200, function () { go(1); }],
            [5200, function () { go(2); }],
            [5200 + 2500, function () {}]
          ]);
        }
      };
    }
  };

  // ---------------------------------------------------------------------
  // Where it is now: the project in Shape Up cycles. A marker runs along
  // and stops on the current cycle. Wide on desktop, top to bottom on
  // phones.
  // ---------------------------------------------------------------------
  var STAGES = [
    ['done', 'Before', 'The original app', 'Made last semester: a pantry list, a scan flow and a shopping list.'],
    ['done', 'Cycle 1', 'Kitchen list rebuild', 'Filter, sort and a needs-attention banner. Tested with 7 people.'],
    ['done', 'Cycle 2', 'Hi-fi Kitchen screen', 'Four directions, one pick. Reviewed by 6 designers.'],
    ['now', 'Cycle 3', 'Quick, honest add', 'Adding food fast, and a real ‘Don’t add’ for duplicates.'],
    ['later', 'Later', 'Impact, export, recipes', 'Money saved, lists to Bring!, recipes from what needs using.']
  ];
  CARDS.process = {
    ctl: 'process animation',
    label: 'ReStock process in Shape Up cycles: before, the original app; cycle 1, Kitchen list rebuild, tested with 7 people; cycle 2, hi-fi Kitchen screen, reviewed by 6 designers; cycle 3, quick and honest add, in progress now; later, impact, export and recipes',
    build: function (card, t) {
      card.innerHTML = hd('Process', 'Shape Up, one cycle at a time') +
        '<div class="rsc-ttl rsc-fr" aria-hidden="true">Where ReStock is now</div>' +
        '<div aria-hidden="true"><div class="rsc-ax"></div><div class="rsc-pr"></div>' +
          STAGES.map(function (s, i) {
            return '<div class="rsc-st rsc-st--' + s[0] + '" style="--f:' + (i * .2).toFixed(1) + '"><i></i><b>' + s[1] + '</b>' +
              '<span class="rsc-t rsc-fr">' + s[2] + '</span>' +
              (s[0] === 'now' ? '<span class="rsc-tag">In progress</span>' : '') +
              '<p>' + s[3] + '</p></div>';
          }).join('') +
        '</div>' +
        src('Worked on between client projects at Framna', 'Shown in Fraunces, a close match');
      var S = card.querySelectorAll('.rsc-st');
      function show(i) { return function () { S[i].classList.add('is-v'); }; }
      return {
        still: function () {
          card.classList.add('is-on');
          each(S, function (s) { s.classList.add('is-v'); });
        },
        play: function () {
          seq(t, [
            [300, function () { card.classList.add('is-on'); }],
            [100, show(0)], [450, show(1)], [450, show(2)], [450, show(3)], [700, show(4)],
            [3200 + 2500, function () {
              card.classList.remove('is-on');
              each(S, function (s) { s.classList.remove('is-v'); });
            }],
            [1200, function () {}]
          ]);
        }
      };
    }
  };

  C.mount('rsc', CARDS);
})();
