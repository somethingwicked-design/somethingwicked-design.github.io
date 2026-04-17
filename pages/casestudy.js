// All shared behaviour (cursor, nav scroll, reveal) is in main.js
// This file handles case-study-specific interactions

// Fade in image placeholders sequentially
document.querySelectorAll('.cs-gallery-img').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transition = 'opacity 0.5s ease';
  setTimeout(() => { el.style.opacity = '1'; }, 300 + i * 100);
});
