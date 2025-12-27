document.addEventListener('DOMContentLoaded', () => {
  // ─── Theme Toggle ───────────────────────────────────────────
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    // Initialize aria-pressed on load
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.dataset.theme = savedTheme;
    themeBtn.setAttribute('aria-pressed', savedTheme === 'dark' ? 'true' : 'false');

    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.dataset.theme;
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = newTheme;
      localStorage.setItem('theme', newTheme);
      themeBtn.setAttribute('aria-pressed', newTheme === 'dark' ? 'true' : 'false');
    });
  } else {
    // If no themeBtn on page, still load saved theme to prevent flash
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.dataset.theme = savedTheme;
    }
  }

  // ─── Mobile Nav Toggle ──────────────────────────────────────
  const navList = document.querySelector('.nav-list');
  const navToggle = document.querySelector('.nav-toggle');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      navList.classList.toggle('open');
    });
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navList.classList.contains('open')) {
          navList.classList.remove('open');
        }
      });
    });
  }

  // ─── Typing Effect ──────────────────────────────────────────
  const typingEl = document.querySelector('.typing');
  if (typingEl) {
    let strings = [];
    try {
      strings = JSON.parse(typingEl.dataset.strings);
    } catch (e) {
      console.error('Typing strings JSON parse error', e);
    }
    let si = 0, ci = 0, forward = true;
    const typeSpeed = 100, pauseBetween = 1500;

    function type() {
      const text = strings[si] || '';
      typingEl.textContent = text.slice(0, ci);
      if (forward) {
        if (ci < text.length) {
          ci++;
          setTimeout(type, typeSpeed);
        } else {
          forward = false;
          setTimeout(type, pauseBetween);
        }
      } else {
        if (ci > 0) {
          ci--;
          setTimeout(type, typeSpeed / 2);
        } else {
          forward = true;
          si = (si + 1) % strings.length;
          setTimeout(type, typeSpeed);
        }
      }
    }
    if (strings.length) type();
  }

  // ─── Intersection Observer for Reveals & Progress Bars ────
  const revealEls = document.querySelectorAll('.reveal-fade, .reveal-slide, .reveal-stagger');
  const progressItems = document.querySelectorAll('.progress-item');
  const releasesSection = document.getElementById('releases');
  const releasesContainer = document.getElementById('releases-container');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.classList.contains('reveal-fade') || el.classList.contains('reveal-slide')) {
          el.classList.add('visible');
        }
        if (el.classList.contains('reveal-stagger')) {
          el.classList.add('visible');
          Array.from(el.children).forEach((child, i) => {
            child.style.transitionDelay = `${i * 100}ms`;
          });
        }
        if (el.classList.contains('progress-item')) {
          const pct = el.dataset.pct;
          el.style.setProperty('--pct', pct);
          el.classList.add('visible');
        }
        if (el === releasesSection) {
          loadReleases();
          obs.unobserve(releasesSection);
        }
      }
    });
  }, { threshold: 0.2 });

  revealEls.forEach(el => observer.observe(el));
  progressItems.forEach(el => observer.observe(el));
  if (releasesSection) observer.observe(releasesSection);

  // ─── Load Releases ──────────────────────────────────────────
  function loadReleases() {
    if (!releasesContainer) return;
    const data = [
      { name: 'PRE_ALPHA-NADIC.X9.ACTI', date: 'June 5 2025', notes: 'First Execution Module For Athena' },
      { name: 'PRE_ALPHA-NADIC.X8.PLAN', date: 'May 30 2025', notes: 'First Planning Module For Athena' },
      { name: 'PRE_ALPHA-NADIC.X7.REAS', date: 'May 27 2025', notes: 'First Reasoning Module For Athena' },
      { name: 'PRE_ALPHA-NADIC.X6.STAGE.S1', date: 'May 27 2025', notes: 'Fourth Athena module operational.' },
      { name: 'PRE_ALPHA-NADIC.X5.LEAR',      date: 'May 22 2025', notes: 'Structured output interface.' },
      { name: 'PRE_ALPHA-NADIC.X4.PERC',      date: 'May 22 2025', notes: 'Perception module live.' },
      { name: 'PRE_ALPHA-NADIC.X3.MEM_H1',    date: 'May 22 2025', notes: 'Memory module initial release.' },
      { name: 'PRE_ALPHA-PRAXON.1.X2',        date: 'May 14 2025', notes: 'Early autonomic services.' },
      { name: 'PRE_ALPHA-CORE.1.X1_0001',     date: 'May 9 2025',  notes: 'First functional kernel.' }
    ];

    data.forEach(r => {
      const div = document.createElement('div');
      div.className = 'release';
      div.innerHTML = `
        <h3>${r.name} <span class="date">${r.date}</span></h3>
        <p>${r.notes}</p>
      `;
      releasesContainer.appendChild(div);
    });
  }

  // ─── Accordion FAQ ─────────────────────────────────────────
  document.querySelectorAll('.accordion-item').forEach(item => {
    const header = item.querySelector('.accordion-header');
    const body = item.querySelector('.accordion-body');
    if (header && body) {
      header.addEventListener('click', () => {
        const open = body.style.maxHeight;
        document.querySelectorAll('.accordion-body').forEach(b => b.style.maxHeight = null);
        if (!open) {
          body.style.maxHeight = `${body.scrollHeight}px`;
        }
      });
    }
  });

  // ─── Contact Form Stub ─────────────────────────────────────
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('Thank you! Your message has been sent.');
      contactForm.reset();
    });
  }
});
