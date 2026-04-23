// ===== PAGE SYSTEM =====
const pages = ['home', 'services', 'pricing', 'portofolio', 'tools', 'about'];
let currentPage = 'home';
let isTransitioning = false;

const hintBottom = document.getElementById('hintBottom');
const hintTop = document.getElementById('hintTop');

function goTo(pageId, direction) {
    if (pageId === currentPage || isTransitioning) return;
    isTransitioning = true;
    hideHints();

    const idx = pages.indexOf(pageId);
    const prevIdx = pages.indexOf(currentPage);
    const goingDown = direction !== undefined ? direction === 'down' : idx > prevIdx;

    const prevEl = document.getElementById('page-' + currentPage);
    const nextEl = document.getElementById('page-' + pageId);

    nextEl.style.transform = goingDown ? 'translate3d(0, 56px, 0)' : 'translate3d(0, -56px, 0)';
    nextEl.style.opacity = '0';
    nextEl.getBoundingClientRect();

    prevEl.classList.remove('active');
    prevEl.classList.add(goingDown ? 'exit-up' : 'exit-down');

    setTimeout(() => {
        nextEl.style.transform = '';
        nextEl.style.opacity = '';
        nextEl.classList.add('active');
        nextEl.scrollTop = 0;

        setTimeout(() => {
            prevEl.classList.remove('exit-up', 'exit-down');
            prevEl.style.transform = '';
            prevEl.style.opacity = '';
            currentPage = pageId;
            updateNav();
            updateDots();
            isTransitioning = false;
        }, 650);
    }, 60);
}

function updateNav() {
    document.querySelectorAll('nav a[data-page]').forEach(a => {
        a.classList.toggle('active', a.dataset.page === currentPage);
    });
}

function updateDots() {
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
    const activeDot = document.querySelector(`.dot[data-page="${currentPage}"]`);
    if (activeDot) activeDot.classList.add('active');
}

function showHint(el, progress) {
    el.style.opacity = Math.min(progress * 1.8, 1).toString();
    el.style.transform = `translateX(-50%) scaleX(${Math.min(progress * 1.5, 1)})`;
}
function hideHints() {
    [hintBottom, hintTop].forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(-50%) scaleX(0)';
    });
}

// === Keyboard ===
document.addEventListener('keydown', e => {
    const idx = pages.indexOf(currentPage);
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        if (idx < pages.length - 1) goTo(pages[idx + 1], 'down');
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (idx > 0) goTo(pages[idx - 1], 'up');
    }
});

// === Wheel (desktop) ===
let wheelAccum = 0;
let wheelTimer = null;
const WHEEL_THRESHOLD = 220;

document.addEventListener('wheel', e => {
    if (isTransitioning) return;
    const activeEl = document.getElementById('page-' + currentPage);
    const atBottom = activeEl.scrollHeight - activeEl.scrollTop <= activeEl.clientHeight + 4;
    const atTop = activeEl.scrollTop <= 2;
    const idx = pages.indexOf(currentPage);
    const goingDown = e.deltaY > 0;

    if ((goingDown && atBottom && idx < pages.length - 1) || (!goingDown && atTop && idx > 0)) {
        wheelAccum += Math.abs(e.deltaY);
        const progress = Math.min(wheelAccum / WHEEL_THRESHOLD, 1);
        if (goingDown) showHint(hintBottom, progress);
        else showHint(hintTop, progress);

        if (wheelAccum >= WHEEL_THRESHOLD) {
            wheelAccum = 0;
            if (goingDown) goTo(pages[idx + 1], 'down');
            else goTo(pages[idx - 1], 'up');
        }

        clearTimeout(wheelTimer);
        wheelTimer = setTimeout(() => {
            wheelAccum = 0;
            hideHints();
        }, 350);
    }
}, { passive: true });

// === Touch / Swipe ===
let touchStartY = 0, touchStartScrollTop = 0, touchDelta = 0;
let edgeArmed = false, edgeDir = null;
let edgeHoldTimer = null;
const SWIPE_THRESHOLD = 90;
const HOLD_DELAY = 280;
let lastTouchY = 0, lastTouchT = 0;

document.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
    lastTouchY = touchStartY;
    lastTouchT = Date.now();
    touchDelta = 0;
    edgeArmed = false;
    edgeDir = null;
    clearTimeout(edgeHoldTimer);
    hideHints();
    const activeEl = document.getElementById('page-' + currentPage);
    touchStartScrollTop = activeEl.scrollTop;
}, { passive: true });

document.addEventListener('touchmove', e => {
    if (isTransitioning) return;
    const y = e.touches[0].clientY;
    touchDelta = touchStartY - y;
    const now = Date.now();
    const velocity = Math.abs(y - lastTouchY) / Math.max(now - lastTouchT, 1);
    lastTouchY = y;
    lastTouchT = now;

    const activeEl = document.getElementById('page-' + currentPage);
    const atBottom = activeEl.scrollHeight - activeEl.scrollTop <= activeEl.clientHeight + 6;
    const atTop = activeEl.scrollTop <= 2;
    const idx = pages.indexOf(currentPage);
    const tryDown = touchDelta > 0 && atBottom && idx < pages.length - 1;
    const tryUp = touchDelta < 0 && atTop && idx > 0;

    if (tryDown || tryUp) {
        const dir = tryDown ? 'down' : 'up';
        if (!edgeArmed && edgeDir !== dir) {
            edgeDir = dir;
            clearTimeout(edgeHoldTimer);
            edgeHoldTimer = setTimeout(() => { edgeArmed = true; }, HOLD_DELAY);
        }
        if (edgeArmed) {
            const progress = Math.min(Math.abs(touchDelta) / SWIPE_THRESHOLD, 1);
            if (tryDown) showHint(hintBottom, progress);
            else showHint(hintTop, progress);
        }
    } else {
        edgeDir = null;
        edgeArmed = false;
        clearTimeout(edgeHoldTimer);
        hideHints();
    }
}, { passive: true });

document.addEventListener('touchend', e => {
    clearTimeout(edgeHoldTimer);
    if (isTransitioning) { hideHints(); return; }

    const endY = e.changedTouches[0].clientY;
    const absDelta = Math.abs(touchStartY - endY);
    const elapsed = Date.now() - lastTouchT;
    const velocity = absDelta / Math.max(elapsed, 1);
    const idx = pages.indexOf(currentPage);
    const activeEl = document.getElementById('page-' + currentPage);
    const atBottom = activeEl.scrollHeight - touchStartScrollTop <= activeEl.clientHeight + 6;
    const atTop = touchStartScrollTop <= 2;
    const goingDown = touchDelta > 0;
    const fastFlick = velocity > 0.3 && absDelta > 40;

    if (edgeArmed || fastFlick) {
        if (goingDown && atBottom && idx < pages.length - 1 && absDelta > 40) {
            goTo(pages[idx + 1], 'down');
            return;
        }
        if (!goingDown && atTop && idx > 0 && absDelta > 40) {
            goTo(pages[idx - 1], 'up');
            return;
        }
    }
    hideHints();
}, { passive: true });

// ===== LOT SIZE CALCULATOR =====
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
    let timeout;
    ['balance','risk','stopLoss'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => calcBtn.click(), 400);
        });
    });
}

// Dummy latency
const latencyEl = document.getElementById('latency');
if (latencyEl) latencyEl.textContent = `${Math.floor(Math.random() * 80 + 10)} ms`;

// Init
updateDots();
