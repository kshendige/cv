/**
 * animations.js — Scroll-reveal & micro-interaction logic
 */

/* ----------------------------------------
   Scroll Reveal — IntersectionObserver
---------------------------------------- */
export function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-stagger');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Only unobserve non-repeating elements
        if (!entry.target.dataset.repeat) {
          observer.unobserve(entry.target);
        }
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ----------------------------------------
   Skill Bars — animate width on reveal
---------------------------------------- */
export function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const pct = bar.dataset.pct || '0';
        bar.style.setProperty('--bar-width', pct + '%');
        bar.style.width = pct + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ----------------------------------------
   3-D Card Tilt
---------------------------------------- */
export function initCardTilt() {
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const maxRot = parseFloat(card.dataset.tiltMax) || 8;

      card.style.transform = `
        perspective(800px)
        rotateY(${dx * maxRot}deg)
        rotateX(${-dy * maxRot}deg)
        scale3d(1.02, 1.02, 1.02)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
    });
  });
}

/* ----------------------------------------
   Active Nav Link on Scroll
---------------------------------------- */
export function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

/* ----------------------------------------
   Scroll Progress Bar
---------------------------------------- */
export function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width    = pct + '%';
  }, { passive: true });
}

/* ----------------------------------------
   Navbar hide / show on scroll direction
---------------------------------------- */
export function initNavBehaviour() {
  const nav        = document.getElementById('navbar');
  if (!nav) return;
  let lastScroll   = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;

    if (current > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    if (current > lastScroll && current > 200) {
      nav.classList.add('nav--hidden');
    } else {
      nav.classList.remove('nav--hidden');
    }

    lastScroll = current <= 0 ? 0 : current;
  }, { passive: true });
}
