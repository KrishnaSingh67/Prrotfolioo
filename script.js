/* ============================================================
   script.js — Portfolio Interactions
   ============================================================ */

'use strict';

/* ── 1. LOADER ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hidden'), 1800);
});

/* ── 2. THEME TOGGLE ── */
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const savedTheme = localStorage.getItem('portfolio-theme') || 'dark-mode';
body.className = savedTheme;

themeToggle.addEventListener('click', () => {
  const isDark = body.classList.contains('dark-mode');
  body.classList.toggle('dark-mode', !isDark);
  body.classList.toggle('light-mode', isDark);
  localStorage.setItem('portfolio-theme', isDark ? 'light-mode' : 'dark-mode');
});

/* ── 3. NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── 4. MOBILE MENU ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── 5. ACTIVE NAV LINK (Intersection Observer) ── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ── 6. SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 7. SKILL BAR ANIMATION ── */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        const w = bar.dataset.width;
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-grid').forEach(g => skillObserver.observe(g));

/* ── 8. TYPED TEXT EFFECT ── */
const phrases = ['Java Developer', 'Backend Architect', 'Spring Boot Expert', 'API Engineer'];
const typedEl = document.getElementById('typed-text');
let phraseIdx = 0, charIdx = 0, deleting = false;

function typeLoop() {
  if (!typedEl) return;
  const current = phrases[phraseIdx];

  if (!deleting) {
    typedEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 2000);
      return;
    }
    setTimeout(typeLoop, 95);
  } else {
    typedEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, 45);
  }
}

// Start after loader
setTimeout(typeLoop, 2000);

/* ── 9. HERO EYEBROW TYPING ── */
const eyebrow = document.getElementById('hero-eyebrow');
if (eyebrow) {
  const text = eyebrow.textContent;
  eyebrow.textContent = '';
  let i = 0;
  const typeEyebrow = () => {
    if (i < text.length) {
      eyebrow.textContent += text[i++];
      setTimeout(typeEyebrow, 38);
    }
  };
  setTimeout(typeEyebrow, 1900);
}

/* ── 10. 3D TILT EFFECT ── */
const TILT_INTENSITY = 8;

document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * TILT_INTENSITY}deg) rotateX(${-y * TILT_INTENSITY}deg) translateZ(6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(700px) rotateY(0) rotateX(0) translateZ(0)';
  });
});

/* ── 11. CONTACT FORM ── */
const form     = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');
const submitBtn = document.getElementById('form-submit');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showFeedback('> ERROR: All required fields must be filled.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFeedback('> ERROR: Invalid email address.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '> Sending...';

    // Simulate async send
    await new Promise(r => setTimeout(r, 1500));

    showFeedback('> MESSAGE_SENT: Response incoming within 24h.', 'success');
    form.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span class="mono">&gt;_</span> Send Message';
  });
}

function showFeedback(msg, type) {
  if (!feedback) return;
  feedback.textContent = msg;
  feedback.style.color = type === 'success'
    ? 'var(--secondary)'
    : '#ff5f57';
  setTimeout(() => { feedback.textContent = ''; }, 5000);
}

/* ── 12. SMOOTH SCROLL (for older browsers) ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── 13. SCROLL-TO-TOP BUTTON ── */
const scrollTop = document.getElementById('scroll-top');
if (scrollTop) {
  window.addEventListener('scroll', () => {
    scrollTop.style.opacity = window.scrollY > 400 ? '1' : '0';
  }, { passive: true });
}

/* ── 14. PARALLAX ORBS (subtle) ── */
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const orbs = document.querySelectorAll('.orb');
  orbs.forEach((orb, i) => {
    const speed = 0.04 + i * 0.02;
    orb.style.transform = `translateY(${y * speed}px)`;
  });
}, { passive: true });

/* ── 15. KEYBOARD ACCESSIBILITY ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});
