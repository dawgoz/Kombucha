// ===========================
// Language Toggle
// ===========================
const langToggle = document.getElementById('langToggle');
const langOptions = langToggle.querySelectorAll('.lang-option');
let currentLang = 'en';

langToggle.addEventListener('click', (e) => {
    const clicked = e.target.closest('.lang-option');
    if (!clicked || clicked.dataset.lang === currentLang) return;

    currentLang = clicked.dataset.lang;

    langOptions.forEach(opt => opt.classList.remove('active'));
    clicked.classList.add('active');

    document.documentElement.lang = currentLang;
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
// Mobile Menu
// ===========================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navOverlay = document.getElementById('navOverlay');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navOverlay.classList.toggle('open');
});

// Close mobile menu when clicking a link
navOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navOverlay.classList.remove('open');
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

// ===========================
// Scroll Animations
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

// Add fade-in class to animatable elements
document.querySelectorAll('.feature, .flavour-card, .contact-card, .about-text p').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

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
