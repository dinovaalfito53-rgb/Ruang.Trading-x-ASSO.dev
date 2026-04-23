// ===== Reveal animations on scroll =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== FAQ Accordion =====
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    });
});

// ===== Lot Size Calculator =====
const XAU_CONTRACT_SIZE = 100;
const PIP_VALUE = XAU_CONTRACT_SIZE * 0.01;

const calcResultEl = document.getElementById('calcResult');
const calcBtn = document.getElementById('calcBtn');
if (calcBtn) {
    calcBtn.addEventListener('click', () => {
        const balance = parseFloat(document.getElementById('balance').value);
        const riskPercent = parseFloat(document.getElementById('risk').value);
        const stopLossPips = parseFloat(document.getElementById('stopLoss').value);

        if (isNaN(balance) || isNaN(riskPercent) || isNaN(stopLossPips) || balance <= 0 || riskPercent <= 0 || stopLossPips <= 0) {
            calcResultEl.textContent = 'Input Invalid';
            return;
        }
        const riskAmount = balance * (riskPercent / 100);
        const lots = riskAmount / (stopLossPips * PIP_VALUE);
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

// ===== Dummy latency =====
const latencyEl = document.getElementById('latency');
if (latencyEl) {
    latencyEl.textContent = `${Math.floor(Math.random() * 80 + 10)} ms`;
}