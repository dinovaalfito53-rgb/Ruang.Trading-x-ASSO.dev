document.addEventListener('DOMContentLoaded', () => {

  /* ── CUSTOM CURSOR ── */
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function loop() {
      rx += (mx - rx) * .13; ry += (my - ry) * .13;
      dot.style.cssText  = `left:${mx}px;top:${my}px`;
      ring.style.cssText = `left:${rx}px;top:${ry}px`;
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a,button,[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-link'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-link'));
    });
  }

  /* ── SCROLL PROGRESS BAR ── */
  const bar = document.querySelector('.scroll-bar');
  if (bar) {
    const update = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      bar.style.transform = `scaleX(${pct})`;
    };
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    revealEls.forEach(el => obs.observe(el));
  }

  /* ── ACTIVE NAV ── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  /* ── ROTATING HERO TEXT ── */
  const words = ['Landing Page.', 'Portfolio Website.', 'Web Component.'];
  const el = document.querySelector('.rotating-text');
  if (el) {
    let i = 0;
    function nextWord() {
      el.style.opacity = '0';
      el.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        i = (i + 1) % words.length;
        el.textContent = words[i];
        el.style.transition = 'opacity .4s ease, transform .4s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 400);
    }
    el.textContent = words[0];
    el.style.transition = 'opacity .4s ease, transform .4s ease';
    setInterval(nextWord, 3000);
  }

  /* ── TOAST ── */
  window.showToast = function(title, msg, type = 'green', duration = 4000) {
    const wrap = document.querySelector('.toast-wrap');
    if (!wrap) return;
    const toast = document.createElement('div');
    toast.className = `toast`;
    toast.innerHTML = `<span class="toast-icon">●</span><div class="toast-content"><div class="toast-title">${title}</div><div class="toast-msg">${msg}</div></div>`;
    wrap.appendChild(toast);
    requestAnimationFrame(() => { requestAnimationFrame(() => toast.classList.add('show')); });
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 450); }, duration);
  };

  /* ── AUTO TOASTS ── */
  if (page === 'index.html' || page === '') {
    setTimeout(() => window.showToast('System Online', 'ASSO Frontend — Siap melayani.', 'green'), 1800);
    setTimeout(() => window.showToast('Info', 'Gunakan kalkulator lot di Tools.', 'green'), 5000);
  }

  /* ── UPTIME ── */
  const uptimeEl = document.querySelector('[data-uptime]');
  if (uptimeEl) {
    let v = 99.97;
    setInterval(() => { v = Math.min(100, v + 0.001); uptimeEl.textContent = v.toFixed(2) + '%'; }, 2500);
  }

  /* ── MOBILE NAV ── */
  const ham = document.querySelector('.nav-hamburger');
  const navLinksEl = document.querySelector('.nav-links');
  if (ham && navLinksEl) {
    ham.addEventListener('click', () => {
      const open = navLinksEl.style.display === 'flex';
      navLinksEl.style.cssText = open ? '' : 'display:flex;flex-direction:column;position:absolute;top:64px;left:0;right:0;background:rgba(13,17,23,.97);border-bottom:1px solid var(--border);padding:16px 24px;gap:4px;z-index:799;';
    });
  }

  /* ── LOT CALCULATOR ── */
  const XAU_CONTRACT_SIZE = 100;
  const PIP_VALUE = XAU_CONTRACT_SIZE * 0.01;
  const calcResultEl = document.getElementById('calcResult');
  const calcBtn = document.getElementById('calcBtn');
  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      const balance = parseFloat(document.getElementById('balance').value);
      const risk = parseFloat(document.getElementById('risk').value);
      const sl = parseFloat(document.getElementById('stopLoss').value);
      if (isNaN(balance) || isNaN(risk) || isNaN(sl) || balance <= 0 || risk <= 0 || sl <= 0) {
        calcResultEl.textContent = 'Input Invalid';
        return;
      }
      const lots = (balance * (risk / 100)) / (sl * PIP_VALUE);
      calcResultEl.textContent = `${lots.toFixed(2)} lots`;
    });
  }

});