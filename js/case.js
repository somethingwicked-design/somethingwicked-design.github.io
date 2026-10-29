// Case study ending (024, 028, 040), after reference/case-study.dc.html and
// case-study-mobile.dc.html.
// Desktop: the case study pins when its bottom reaches the screen bottom,
// then slides left over the Next up panel while you scroll through a 1200px
// spacer, darkening to 80%. Next up's text fades in and the preview grows
// from its bottom-right corner, all scrubbed by scroll. Both are sticky in
// the same stage, so when the slide is done they unpin and scroll away
// together and the footer follows in the flow (css/case.css).
// Phone: Next up scrolls in normally; the case study above darkens from 0
// (Next up enters) to 80% (its top at 40% of the screen).
// Reduced motion (desktop) and no JS: Next up simply sits in the flow.

(function () {
  'use strict';

  var main = document.getElementById('csMain');
  var spacer = document.getElementById('csSpacer');
  var panel = document.getElementById('csNext');
  var dim = document.getElementById('csDim');
  if (!main || !spacer || !panel || !dim) return;

  var body = document.body;
  var prev = panel.querySelector('.next-prev');
  var prevIn = panel.querySelector('.next-prev-in');
  var fx = panel.querySelectorAll('.next-label, .next-title');
  var all = panel.querySelector('.next-all');

  // Focus links (048, 066; the focus comes from js/main.js): Next up goes
  // to the next project in the same focus, looping, with that project's
  // name, line and preview as on the page before it in the work order. A
  // page outside the focus keeps its own Next up. All work goes back to
  // the focus, with its count. The rip paper follows the link
  // (js/transition.js).
  var NEXT = {
    'op-jezelf': ['Op Jezelf', 'Getting teens ready to live on their own.',
      '<picture><source media="(max-width: 759.98px)" srcset="/img/cards/card-op-jezelf-small.webp" width="1800" height="1350"><img draggable="false" src="/img/op-jezelf-phones.webp" width="2000" height="1486" alt="" loading="lazy" decoding="async"></picture>'],
    'restock': ['ReStock', 'Wasting less food, one fridge at a&nbsp;time.',
      '<picture><source media="(max-width: 759.98px)" srcset="/img/cards/card-restock-small.webp" width="1800" height="1350"><img draggable="false" src="/img/restock/preview.webp" width="2400" height="1500" alt="" loading="lazy" decoding="async"></picture>'],
    'health-potion': ['Health Potion', 'My first brand identity, rebuilt two years&nbsp;later.',
      '<picture><source media="(max-width: 759.98px)" srcset="/img/cards/card-health-potion-small.webp" width="1800" height="1350"><img draggable="false" src="/img/health-potion-guide.webp" width="1800" height="1799" alt="" loading="lazy" decoding="async"></picture>'],
    'de-bote': ['De Bote', 'Hold the line: a newspaper about the 06&nbsp;numbers.',
      '<picture><source media="(max-width: 759.98px)" srcset="/img/cards/card-de-bote-small.webp" width="1800" height="1350"><img draggable="false" src="/img/de-bote/banner.webp" width="2400" height="1600" alt="" loading="lazy" decoding="async"></picture>'],
    'something-wicked': ['Something Wicked', 'My own brand, and the site you’re on right&nbsp;now.',
      '<video controlsList="nodownload" muted playsinline disablepictureinpicture preload="metadata" poster="/img/something-wicked/glitch-poster.jpg" width="1920" height="1080" aria-hidden="true"><source src="/img/something-wicked/glitch.mp4" type="video/mp4"></video>'],
    'kokoro': ['Kokoro', 'A music label, a lucky cat and a lot of&nbsp;attitude.',
      '<picture><source media="(max-width: 759.98px)" srcset="/img/cards/card-kokoro-small.webp" width="1800" height="1350"><img draggable="false" src="/img/kokoro/preview.webp" width="1600" height="1068" alt="" loading="lazy" decoding="async"></picture>']
  };
  var focus = window.SWFocus;
  var here = focus ? focus.slugs.indexOf(body.getAttribute('data-project')) : -1;
  if (here !== -1) {
    var to = focus.slugs[(here + 1) % focus.slugs.length];
    var title = panel.querySelector('.next-title');
    var href = '/work/' + to + '.html';
    if (title.getAttribute('href') !== href && NEXT[to]) {
      title.href = href;
      title.children[1].textContent = NEXT[to][0];
      title.querySelector('.next-sub').innerHTML = NEXT[to][1];
      prev.href = href;
      prev.setAttribute('aria-label', 'Next project: ' + NEXT[to][0]);
      prevIn.innerHTML = NEXT[to][2];
    }
  }
  if (focus && all) {
    var allLink = all.querySelector('a');
    var n = focus.slugs.length;
    allLink.href = '/?focus=' + focus.key + '#all-work';
    allLink.textContent = focus.label + ' work';
    allLink.setAttribute('aria-label', focus.label + ' work, ' + n + ' projects');
    all.querySelector('span').textContent = '(' + n + ')';
  }

  // A preview video (Something Wicked's glitch, 049) plays once when the
  // preview is half grown (desktop) or half in view (phone), then stays on
  // its last frame. Reduced motion keeps the poster.
  var prevVid = panel.querySelector('.next-prev video');

  var desktopMq = window.matchMedia('(min-width: 760px)');
  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');

  var STRIP = 344;    // px of the case study left showing at the end (1440 canvas)
  var MAX_DIM = 0.8;
  var mode = null;    // 'live' | 'phone' | 'static'
  var queued = false;

  function clamp(v) { return Math.max(0, Math.min(1, v)); }
  function seg(p, a, b) { return clamp((p - a) / (b - a)); }

  function reset() {
    main.style.position = '';
    main.style.top = '';
    main.style.transform = '';
    dim.style.opacity = '';
    fx.forEach(function (el) { el.style.opacity = ''; });
    all.style.opacity = '';
    prev.style.clipPath = '';
    prevIn.style.transform = '';
  }

  // Sticky with a negative top: it pins once its bottom meets the screen
  // bottom. Only ever moved with transform, never by setting its position
  // from the scroll handler (that makes it jump, 024).
  function pin() {
    main.style.position = 'sticky';
    main.style.top = Math.min(0, window.innerHeight - main.offsetHeight) + 'px';
  }

  function progress() {
    var r = spacer.getBoundingClientRect();
    return clamp((window.innerHeight - r.top) / r.height);
  }

  function tickLive() {
    var p = progress();
    var w = main.clientWidth;
    // Keep the same columns showing on screens wider than the 1440 page;
    // narrower screens (760-1439) keep the same share of the width, so the
    // strip never covers Next up's text
    var strip = Math.min(STRIP, w * STRIP / 1440) + Math.max(0, (w - 1440) / 2);
    main.style.transform = 'translate3d(' + (-(w - strip) * p).toFixed(1) + 'px, 0, 0)';
    dim.style.opacity = String(MAX_DIM * p);
    fx.forEach(function (el) { el.style.opacity = String(seg(p, 0.4, 0.9)); });
    all.style.opacity = String(seg(p, 0.6, 1));
    var ins = (89 * (1 - p)).toFixed(2) + '%';
    prev.style.clipPath = 'inset(' + ins + ' 0 0 ' + ins + ')';
    prevIn.style.transform = 'scale(' + (0.5 + 0.5 * p) + ')';
  }

  function tickPhone() {
    var vh = window.innerHeight;
    var top = panel.getBoundingClientRect().top;
    dim.style.opacity = String(MAX_DIM * clamp((vh - top) / (vh * 0.6)));
  }

  function playPrev() {
    if (!prevVid || prevVid.dataset.played || reduceMq.matches) return;
    var r = prevVid.getBoundingClientRect();
    var shown = mode === 'live' ? progress() >= 0.5 : r.top + r.height / 2 <= window.innerHeight && r.bottom - r.height / 2 >= 0;
    if (!shown) return;
    prevVid.dataset.played = '1';
    var p = prevVid.play();
    if (p && p.catch) p.catch(function () { /* autoplay blocked: the poster shows */ });
  }

  function tick() {
    queued = false;
    if (mode === 'live') tickLive();
    else if (mode === 'phone') tickPhone();
    playPrev();
  }

  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(tick);
  }

  function setMode() {
    var next = !desktopMq.matches ? 'phone' : (reduceMq.matches ? 'static' : 'live');
    if (next !== mode) {
      mode = next;
      reset();
      body.classList.toggle('next-live', mode === 'live');
    }
    if (mode === 'live') pin();
    tick();
  }

  // Keyboard: tabbing into Next up while it is still hidden under the case
  // study jumps to the end of the slide, so focus never lands on something
  // invisible.
  panel.addEventListener('focusin', function () {
    if (mode !== 'live' || progress() >= 1) return;
    var end = window.scrollY + spacer.getBoundingClientRect().bottom - window.innerHeight;
    window.scrollTo({ top: end, behavior: 'instant' });
    tick();
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', setMode);
  desktopMq.addEventListener('change', setMode);
  reduceMq.addEventListener('change', setMode);
  // Only a video marked data-once (the Something Wicked glitch, 049) plays
  // by itself: once, when half of it is in view, then it stays on its last
  // frame. Under 5s, so no pause button. Reduced motion keeps the poster.
  // Every other video waits for its own play button and shows its poster
  // until then (the Op Jezelf phones, 05).
  function play(video) {
    var p = video.play();
    if (p && p.catch) p.catch(function () { /* autoplay blocked: the poster shows */ });
  }
  document.querySelectorAll('.cs-main video[data-once]').forEach(function (video) {
    if (reduceMq.matches) return;
    if (!('IntersectionObserver' in window)) {
      play(video);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].intersectionRatio < .5) return;
      io.disconnect();
      play(video);
    }, { threshold: .5 });
    io.observe(video);
  });

  // Images and fonts change the case study's height
  window.addEventListener('load', setMode);
  setMode();
})();
