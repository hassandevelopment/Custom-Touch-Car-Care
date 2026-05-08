/* ============================================================
   CUSTOM TOUCH CAR CARE — Main JS
   - Navbar scroll state
   - Mobile menu
   - Scroll reveal (IntersectionObserver)
   - Before/after slider
   - Footer year
   ============================================================ */

'use strict';

// ── Footer year ──────────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Navbar scroll state ──────────────────────────────────────
const navbar = document.getElementById('navbar');
let lastScroll = 0;

function handleNavScroll() {
  const scrollY = window.scrollY;
  if (scrollY > 32) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = scrollY;
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // run once on load

// ── Mobile menu ──────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a, .btn') : [];
let menuOpen = false;

function openMenu() {
  menuOpen = true;
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  menuOpen = false;
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    if (menuOpen) closeMenu();
    else openMenu();
  });
}

// Close on link click
mobileLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuOpen) closeMenu();
});

// ── Scroll Reveal ────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

if (revealEls.length > 0 && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -32px 0px',
    }
  );

  revealEls.forEach(el => revealObserver.observe(el));
} else {
  // Fallback: show everything immediately
  revealEls.forEach(el => el.classList.add('in'));
}

// ── Before / After Slider ────────────────────────────────────
const baSlider = document.getElementById('ba-slider');
const baHandle = document.getElementById('ba-handle');
const baBeforeClip = document.getElementById('ba-before-clip');

if (baSlider && baHandle && baBeforeClip) {
  let isDragging = false;
  let sliderPosition = 50; // percent

  function setPosition(pct) {
    sliderPosition = Math.max(2, Math.min(98, pct));
    baBeforeClip.style.clipPath = `inset(0 ${100 - sliderPosition}% 0 0)`;
    baHandle.style.left = `${sliderPosition}%`;
  }

  function getEventX(e) {
    const touch = e.touches ? e.touches[0] : e;
    return touch.clientX;
  }

  function onMove(e) {
    if (!isDragging) return;
    const rect = baSlider.getBoundingClientRect();
    const x = getEventX(e) - rect.left;
    const pct = (x / rect.width) * 100;
    setPosition(pct);
  }

  function onUp() { isDragging = false; }
  function onDown(e) {
    isDragging = true;
    onMove(e);
  }

  baSlider.addEventListener('mousedown', onDown);
  baSlider.addEventListener('touchstart', onDown, { passive: true });
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('mouseup', onUp);
  window.addEventListener('touchend', onUp);

  // Keyboard accessibility
  baSlider.setAttribute('tabindex', '0');
  baSlider.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') setPosition(sliderPosition - 2);
    if (e.key === 'ArrowRight') setPosition(sliderPosition + 2);
  });

  // Init
  setPosition(50);
}

// ── Smooth scroll for anchor links ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar ? navbar.getBoundingClientRect().height : 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Why Us section — photo card lazy load enhancement ────────
// Ensures the workshop photo in why-us loads correctly
const whyPhoto = document.querySelector('#why-us img');
if (whyPhoto) {
  whyPhoto.addEventListener('error', () => {
    // If photo missing, show a fallback gradient placeholder
    whyPhoto.style.display = 'none';
    const parent = whyPhoto.parentElement;
    if (parent) {
      parent.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)';
      parent.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.2);font-family:var(--font-head);font-size:0.8rem;letter-spacing:0.15em;">WORKSHOP PHOTO</div>';
    }
  });
}
