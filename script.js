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
    const title   = form.title.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message || !title) {
      showFeedback('> ERROR: All required fields must be filled.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFeedback('> ERROR: Invalid email address.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '> Sending...';

    try{

    await emailjs.send(
    "service_y08osiy",  //service id 
    "template_ulxzhq3",  // templet id
    {
        name,
        email,
        title,
        message
    }
);

    showFeedback('> MESSAGE_SENT: Response incoming within 24h.', 'success');
    form.reset();
    }
  catch(error){
    console.error("EmailJs error: ",error);
    showFeedback("> ERROR: Failed to send message.", "error");
}
finally{
  submitBtn.disabled=false;
  submitBtn.innerHTML =
         '<span class ="mono">&gt;_</span> Send Message';
}
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
    const modal = document.getElementById('certificate-modal');
    if (modal) modal.classList.remove('active');
  }
});

/* ── 16. CERTIFICATES SYSTEM ── */
const certificateData = [
  {
    id: 'java-dev-1',
    title: 'Java Backend dvelopment with Ai',
    issuer: 'GeeksforGeeks',
    date: '2026-06-15',
    image: 'gfg.png',
    icon: 'school',
    category: 'java',
    verifyUrl: 'https://media.geeksforgeeks.org/courses/certificates/397ad5db16c045e284e2bd4b556a3a9a.pdf'
  },
  {
    id: 'Ai',
    title: 'Automate (n8n)',
    issuer: 'LinkedIn',
    date: '2026-05-23',
    image: 'n8n.png',
    icon: 'military_tech',
    category: 'Ai',
    verifyUrl: 'https://www.linkedin.com/learning/certificates/18c0b39b5458f1b5e25950e8e217ef9170644503b3b79b11815b9711c8a36001'
  },
  {
    id: 'Logics',
    title: 'Data Structure and Algoritm',
    issuer: 'Physics Wallah',
    date: '2024-06-04',
    image: 'dsa.png',
    icon: 'cloud_circle',
    category: 'Logics',
    verifyUrl: 'https://pwskills.com/learn/certicate/36d3c5b3-012a-401d-91a3-a990c349af40'
  },
  {
    id: 'Ai',
    title: 'Generative Ai',
    issuer: 'Cousera',
    date: '2024-09-01',
    image: 'generativeAi.png',
    icon: 'code',
    category: 'Ai',
    verifyUrl: 'https://coursera.org/verify/YOOPMONB2GI3'
  },
  {
    id: 'Ai',
    title: 'Responsible AI: Applying AI Principles with Google cloud ',
    issuer: 'Cousera',
    date: '2024-09-08',
    image: 'google7.png',
    icon: 'architecture',
    category: 'Ai',
    verifyUrl: 'https://coursera.org/verify/H6Z13XTGGFS9'
  },
  {
    id: 'Frontend',
    title: 'HTML-CSS',
    issuer: 'Cousera',
    date: '2024-09-06',
    image: 'htmlcss.png',
    icon: 'star',
    category: 'Frontend',
    verifyUrl: 'https://coursera.org/verify/M3UL1G42995O'
  },
  {
    id: 'Ai',
    title: 'Introduction to Responsible AI',
    issuer: 'Cousera',
    date: '2024-09-08',
    image: 'ResponsibleAi.png',
    icon: 'star',
    category: 'Ai',
    verifyUrl: 'https://coursera.org/verify/M3UL1G42995O'
  },
  {
    id: 'other-1',
    title: 'Get Started with Spreadsheet Applications: Excel',
    issuer: 'SkillUp EdTech',
    date: '2024-09-09',
    image: 'excel.png',
    icon: 'star',
    category: 'other',
    verifyUrl: 'https://coursera.org/verify/HU9VP9RG817V'
  }
];

// Initialize certificates
function initCertificates() {
  const grid = document.getElementById('certificate-grid');
  const modal = document.getElementById('certificate-modal');
  const modalClose = document.getElementById('modal-close');
  const modalOverlay = document.getElementById('modal-overlay');
  const searchInput = document.getElementById('cert-search');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const seeAllBtn = document.getElementById('see-all-btn');

  if (!grid) return;

  let currentFilter = 'all';
  let isExpanded = false;

  // Render certificates
  function renderCertificates(filter = 'all', search = '') {
    grid.innerHTML = '';
    const filtered = certificateData.filter(cert => {
      const matchFilter = filter === 'all' || cert.category === filter;
      const matchSearch = cert.title.toLowerCase().includes(search.toLowerCase()) ||
                         cert.issuer.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });

    filtered.forEach((cert, index) => {
      const card = document.createElement('div');
      card.className = 'certificate-card reveal';
      card.innerHTML = `
        <div class="certificate-icon-wrapper">
          <img src="assets/certificates/${cert.image}" alt="${cert.title}" class="certificate-floating-image" />
        </div>
        <div class="certificate-content">
          <h3 class="certificate-title">${cert.title}</h3>
          <p class="certificate-issuer">${cert.issuer}</p>
          <p class="certificate-date">${new Date(cert.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
          <div class="certificate-actions">
            <button class="cert-btn" data-id="${cert.id}" data-action="view" title="View full certificate">
              <span class="material-symbols-outlined">image</span> View
            </button>
            <button class="cert-btn verify" data-url="${cert.verifyUrl}" data-action="verify" title="Verify certificate authenticity">
              <span class="material-symbols-outlined">check_circle</span> Verify
            </button>
          </div>
        </div>
      `;
      grid.appendChild(card);

      // View button handler
      card.querySelector('[data-action="view"]').addEventListener('click', () => {
        showModal(cert);
      });

      // Verify button handler
      card.querySelector('[data-action="verify"]').addEventListener('click', (e) => {
        window.open(cert.verifyUrl, '_blank', 'noopener,noreferrer');
      });
    });

    // Update reveal animation for new cards
    document.querySelectorAll('.certificate-card.reveal').forEach(el => {
      revealObserver.observe(el);
    });

    updateSeeAllButton(filtered.length);
  }

  // Show modal with certificate details
  function showModal(cert) {
    document.getElementById('modal-image').src = 'assets/certificates/' + cert.image;
    document.getElementById('modal-image').alt = cert.title;
    document.getElementById('modal-title').textContent = cert.title;
    document.getElementById('modal-issuer').textContent = `${cert.issuer} • ${new Date(cert.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close modal handler
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Update see all button visibility
  function updateSeeAllButton(totalCerts) {
    const hiddenCards = grid.querySelectorAll('.certificate-card.hidden').length;
    const visibleCards = grid.querySelectorAll('.certificate-card:not(.hidden)').length;
    
    if (isExpanded || visibleCards <= 3) {
      seeAllBtn.classList.add('hidden');
    } else {
      seeAllBtn.classList.remove('hidden');
    }
  }

  // Search handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const search = e.target.value.trim();
      renderCertificates(currentFilter, search);
    });
  }

  // Filter buttons handler
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      searchInput.value = '';
      renderCertificates(currentFilter, '');
      isExpanded = false;
      grid.classList.remove('expanded');
      seeAllBtn.classList.remove('expanded');
    });
  });

  // See all button handler
  if (seeAllBtn) {
    seeAllBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      if (isExpanded) {
        grid.classList.add('expanded');
        seeAllBtn.classList.add('expanded');
      } else {
        grid.classList.remove('expanded');
        seeAllBtn.classList.remove('expanded');
      }
    });
  }

  // Modal close handlers
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
  }

  // Initial render
  renderCertificates();
}

// Call when DOM is ready
document.addEventListener('DOMContentLoaded', initCertificates);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCertificates);
} else {
  initCertificates();
}
