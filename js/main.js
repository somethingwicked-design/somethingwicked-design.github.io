const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', function(e) {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button').forEach(function(el) {
  el.addEventListener('mouseenter', function() {
    cursor.style.width = '28px';
    cursor.style.height = '28px';
    cursor.style.opacity = '0.6';
  });
  el.addEventListener('mouseleave', function() {
    cursor.style.width = '6px';
    cursor.style.height = '6px';
    cursor.style.opacity = '1';
  });
});

var nav = document.getElementById('nav');
window.addEventListener('scroll', function() {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

var reveals = document.querySelectorAll('.reveal');
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });
reveals.forEach(function(el) { observer.observe(el); });
