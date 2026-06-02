/* =============================================
   50 Prompts de IA — script.js
   ============================================= */

'use strict';

/* ── NAV SCROLL EFFECT ── */
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ── SCROLL REVEAL ── */
(function () {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);

        setTimeout(() => {
          el.classList.add('visible');
        }, delay);

        observer.unobserve(el);
      });
    },
    { threshold: 0.12 }
  );

  els.forEach((el) => observer.observe(el));
})();


/* ── SMOOTH ANCHOR SCROLL ── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navH = document.getElementById('nav')?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── FORM VALIDATION & SUBMISSION ── */
(function () {
  const form = document.getElementById('leadForm');
  const successEl = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const btnArrow = document.getElementById('btnArrow');
  const btnSpinner = document.getElementById('btnSpinner');

  if (!form) return;

  /* Helpers */
  function setFieldError(inputId, errorId, msg) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (!input || !error) return;
    input.classList.toggle('error', !!msg);
    error.textContent = msg || '';
  }

  function clearErrors() {
    setFieldError('name', 'nameError', '');
    setFieldError('email', 'emailError', '');
  }

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    btnText.textContent = loading ? 'ENVIANDO…' : 'BAIXAR AGORA';
    btnArrow.classList.toggle('hidden', loading);
    btnSpinner.classList.toggle('hidden', !loading);
  }

  function showSuccess() {
    form.classList.add('hidden');
    successEl.classList.remove('hidden');

    // Animate success icon
    const icon = successEl.querySelector('.success-icon');
    if (icon) {
      icon.style.transform = 'scale(0.6)';
      icon.style.opacity = '0';
      requestAnimationFrame(() => {
        icon.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.4s';
        icon.style.transform = 'scale(1)';
        icon.style.opacity = '1';
      });
    }
  }

  /* Validate on blur */
  document.getElementById('name')?.addEventListener('blur', function () {
    if (!this.value.trim()) {
      setFieldError('name', 'nameError', 'Por favor, insira seu nome.');
    } else {
      setFieldError('name', 'nameError', '');
    }
  });

  document.getElementById('email')?.addEventListener('blur', function () {
    if (!this.value.trim()) {
      setFieldError('email', 'emailError', 'Por favor, insira seu e-mail.');
    } else if (!isValidEmail(this.value)) {
      setFieldError('email', 'emailError', 'E-mail inválido.');
    } else {
      setFieldError('email', 'emailError', '');
    }
  });

  /* Submit */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();

    let valid = true;

    if (!name) {
      setFieldError('name', 'nameError', 'Por favor, insira seu nome.');
      valid = false;
    }

    if (!email) {
      setFieldError('email', 'emailError', 'Por favor, insira seu e-mail.');
      valid = false;
    } else if (!isValidEmail(email)) {
      setFieldError('email', 'emailError', 'E-mail inválido. Verifique e tente novamente.');
      valid = false;
    }

    if (!valid) return;

    setLoading(true);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });

      if (response.ok) {
        showSuccess();
      } else {
        const data = await response.json().catch(() => ({}));
        const msg = data?.errors?.[0]?.message || 'Ocorreu um erro. Tente novamente.';
        alert(msg);
        setLoading(false);
      }
    } catch (_err) {
      alert('Sem conexão. Verifique sua internet e tente novamente.');
      setLoading(false);
    }
  });
})();


/* ── CARD HOVER GLOW (mouse tracking) ── */
(function () {
  const cards = document.querySelectorAll('.card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });
})();


/* ── AUDIENCE ITEMS HOVER ── */
(function () {
  const items = document.querySelectorAll('.audience-item');

  items.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const num = item.querySelector('.item-num');
      if (num) num.style.opacity = '1';
    });

    item.addEventListener('mouseleave', () => {
      const num = item.querySelector('.item-num');
      if (num) num.style.opacity = '0.7';
    });
  });
})();
