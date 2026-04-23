// Reveal animations on scroll (still works inside snap container)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Active nav link highlight based on scroll position
const sections = document.querySelectorAll('.full-section');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Lot Size Calculator (unchanged)
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

// Dummy latency
const latencyEl = document.getElementById('latency');
if (latencyEl) {
    latencyEl.textContent = `${Math.floor(Math.random() * 80 + 10)} ms`;
}
