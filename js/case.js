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
    // Keep the same columns showing on screens wider than the 1440 page
    var strip = STRIP + Math.max(0, (w - 1440) / 2);
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

  function tick() {
    queued = false;
    if (mode === 'live') tickLive();
    else if (mode === 'phone') tickPhone();
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
  // Images and fonts change the case study's height
  window.addEventListener('load', setMode);
  setMode();
})();
