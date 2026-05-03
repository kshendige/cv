/**
 * main.js — Portfolio interactions (no ES modules, works with file://)
 */

/* ─── TYPEWRITER ────────────────────────── */
class Typewriter {
  constructor(el, opts = {}) {
    this.el          = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;
    this.words       = opts.words       || ['Developer'];
    this.typeSpeed   = opts.typeSpeed   || 80;
    this.deleteSpeed = opts.deleteSpeed || 45;
    this.pauseAfter  = opts.pauseAfter  || 2000;
    this.pauseBefore = opts.pauseBefore || 400;
    this.wordIndex = 0; this.charIndex = 0; this.deleting = false;
    this._tick();
  }
  _tick() {
    const word = this.words[this.wordIndex % this.words.length];
    this.deleting ? this.charIndex-- : this.charIndex++;
    this.el.textContent = word.substring(0, this.charIndex);
    let delay = this.deleting ? this.deleteSpeed : this.typeSpeed;
    if (!this.deleting && this.charIndex === word.length) {
      delay = this.pauseAfter; this.deleting = true;
    } else if (this.deleting && this.charIndex === 0) {
      this.deleting = false; this.wordIndex++; delay = this.pauseBefore;
    }
    setTimeout(() => this._tick(), delay);
  }
}

/* ─── SCROLL REVEAL ─────────────────────── */
function initScrollReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        if (!e.target.dataset.repeat) io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));
}

/* ─── SKILL BARS ────────────────────────── */
function initSkillBars() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = (e.target.dataset.pct || 0) + '%';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-bar-fill').forEach(b => io.observe(b));
}

/* ─── CARD TILT ─────────────────────────── */
function initCardTilt() {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    const max = parseFloat(card.dataset.tiltMax) || 8;
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
      const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
      card.style.transform = `perspective(900px) rotateY(${dx*max}deg) rotateX(${-dy*max}deg) scale3d(1.025,1.025,1.025)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
      card.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    });
    card.addEventListener('mouseenter', () => { card.style.transition = 'none'; });
  });
}

/* ─── ACTIVE NAV ─────────────────────────── */
function initActiveNav() {
  const links = document.querySelectorAll('.nav__link');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav__link[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: 0.35 });
  document.querySelectorAll('section[id]').forEach(s => io.observe(s));
}

/* ─── SCROLL PROGRESS ───────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const update = () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
}

/* ─── NAVBAR BEHAVIOUR ──────────────────── */
function initNavBehaviour() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  let last = 0;
  window.addEventListener('scroll', () => {
    const cur = window.scrollY;
    nav.classList.toggle('scrolled', cur > 60);
    nav.classList.toggle('nav--hidden', cur > last && cur > 220);
    last = cur <= 0 ? 0 : cur;
  }, { passive: true });
}

/* ─── CUSTOM CURSOR ─────────────────────── */
function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });

  (function loop() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });

  document.querySelectorAll('a, button, [data-tilt]').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hovering'));
  });

  document.addEventListener('mousedown', () => ring.classList.add('is-clicking'));
  document.addEventListener('mouseup',   () => ring.classList.remove('is-clicking'));
}

/* ─── MOBILE NAV ────────────────────────── */
function initMobileNav() {
  const btn    = document.getElementById('hamburger');
  const drawer = document.getElementById('nav-drawer');
  if (!btn || !drawer) return;
  btn.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  drawer.querySelectorAll('.nav__link').forEach(l => {
    l.addEventListener('click', () => {
      drawer.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ─── CONTACT FORM ──────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = form.querySelector('#f-name').value.trim();
    const email   = form.querySelector('#f-email').value.trim();
    const subject = form.querySelector('#f-subject').value.trim() || 'Portfolio Enquiry';
    const msg     = form.querySelector('#f-message').value.trim();
    if (!name || !email || !msg) { showToast('⚠️ Please fill in all required fields.'); return; }
    window.location.href = `mailto:kshendige@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Hi Karthik,\n\n' + msg + '\n\n— ' + name + ' (' + email + ')')}`;
    form.reset();
    showToast('✅ Opening your email client…');
  });
}

/* ─── COPY EMAIL ─────────────────────────── */
function initCopyEmail() {
  const btn = document.getElementById('copy-email');
  if (!btn) return;
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText('kshendige@gmail.com').then(() => {
      showToast('📋 Email copied to clipboard!');
    }).catch(() => showToast('❌ Could not copy email.'));
  });
}

/* ─── TOAST ─────────────────────────────── */
function showToast(msg, duration = 3000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span class="toast__icon">${msg.split(' ')[0]}</span><span>${msg.split(' ').slice(1).join(' ')}</span>`;
  document.body.appendChild(t);
  setTimeout(() => {
    t.classList.add('toast--out');
    setTimeout(() => t.remove(), 300);
  }, duration);
}

/* ─── ANIMATED COUNTERS ─────────────────── */
function initCounters() {
  const nums = document.querySelectorAll('.stat__num[data-count]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseFloat(el.dataset.count);
      const suf = el.dataset.suffix || '';
      const dur = 1800;
      const step = 16;
      const inc  = end / (dur / step);
      let val = 0;
      const timer = setInterval(() => {
        val = Math.min(val + inc, end);
        el.textContent = (Number.isInteger(end) ? Math.floor(val) : val.toFixed(1)) + suf;
        if (val >= end) clearInterval(timer);
      }, step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => io.observe(n));
}

/* ─── SMOOTH SCROLL ─────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = document.getElementById('navbar')?.offsetHeight || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ─── INIT ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initScrollProgress();
  initNavBehaviour();
  initScrollReveal();
  initSkillBars();
  initCardTilt();
  initActiveNav();
  initMobileNav();
  initContactForm();
  initCopyEmail();
  initCounters();
  initSmoothScroll();

  const typed = document.getElementById('typed-text');
  if (typed) {
    new Typewriter(typed, {
      words: ['Business Analyst', 'Lean Consultant', 'Strategic Advisor', 'Process Optimizer', 'Strategy Partner', 'Problem Solver'],
      typeSpeed: 75, deleteSpeed: 42, pauseAfter: 2200
    });
  }
});
