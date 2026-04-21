// ===========================
// Language Toggle
// ===========================
const langToggle = document.getElementById('langToggle');
let currentLang = localStorage.getItem('lang') || 'lt';

langToggle.textContent = currentLang === 'en' ? 'LT' : 'EN';
document.documentElement.lang = currentLang;

langToggle.addEventListener('click', async () => {
    currentLang = currentLang === 'en' ? 'lt' : 'en';
    langToggle.textContent = currentLang === 'en' ? 'LT' : 'EN';
    document.documentElement.lang = currentLang;
    localStorage.setItem('lang', currentLang);
    await renderFlavours();
    updateLanguage();
});

function updateLanguage() {
    const elements = document.querySelectorAll('[data-en][data-lt]');
    elements.forEach(el => {
        const text = el.getAttribute(`data-${currentLang}`);
        if (text) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        }
    });
}

// ===========================
// Scroll Animations (must be before renderFlavours)
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// ===========================
// Dynamic Flavour Rendering (API-backed)
// ===========================
let cachedFlavours = [];

async function fetchFlavours() {
    try {
        const res = await fetch('/api/flavours');
        cachedFlavours = await res.json();
    } catch {
        cachedFlavours = [];
    }
    return cachedFlavours;
}

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

async function renderFlavours() {
    const grid = document.getElementById('flavourGrid');
    if (!grid) return;

    const flavours = await fetchFlavours();

    grid.innerHTML = flavours.map(f => {
        const name = currentLang === 'en' ? f.nameEn : f.nameLt;
        const desc = currentLang === 'en' ? f.descEn : f.descLt;
        const badge = currentLang === 'en' ? f.badgeEn : f.badgeLt;

        const imageHtml = f.image
            ? `<img src="${escapeHtml(f.image)}" alt="${escapeHtml(f.nameEn)} Kombucha" onerror="this.style.display='none'; this.parentElement.classList.add('placeholder');">`
            : '';
        const placeholderClass = f.image ? '' : ' placeholder';

        const badgeHtml = badge
            ? `<div class="flavour-badge" data-en="${escapeHtml(f.badgeEn)}" data-lt="${escapeHtml(f.badgeLt)}">${escapeHtml(badge)}</div>`
            : '';

        return `
        <div class="flavour-card" style="--accent: ${escapeHtml(f.accent || '#e8a87c')};">
            <div class="flavour-image${placeholderClass}">
                ${imageHtml}
                ${badgeHtml}
            </div>
            <div class="flavour-info">
                <h3 data-en="${escapeHtml(f.nameEn)}" data-lt="${escapeHtml(f.nameLt)}">${escapeHtml(name)}</h3>
                <p data-en="${escapeHtml(f.descEn)}" data-lt="${escapeHtml(f.descLt)}">${escapeHtml(desc)}</p>
            </div>
        </div>`;
    }).join('');

    // Re-observe for scroll animations
    grid.querySelectorAll('.flavour-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// ===========================
// Mobile Menu
// ===========================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navOverlay = document.getElementById('navOverlay');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navOverlay.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
});

// Close mobile menu when clicking a link
navOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navOverlay.classList.remove('open');
        document.body.classList.remove('no-scroll');
    });
});

// ===========================
// Navbar Scroll Effect
// ===========================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Add fade-in class to static animatable elements
document.querySelectorAll('.feature, .contact-card, .about-text p').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Apply default language on load
(async () => {
    await renderFlavours();
    updateLanguage();
})();

// ===========================
// Hero Image Spin on Click
// ===========================
const heroImage = document.querySelector('.hero-image');
if (heroImage) {
    heroImage.addEventListener('click', () => {
        heroImage.classList.add('spin');
    });
    heroImage.addEventListener('animationend', () => {
        heroImage.classList.remove('spin');
    });
}

heroImage.click(); // Trigger initial spin on page load
// ===========================
// Smooth Scroll for Safari
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
