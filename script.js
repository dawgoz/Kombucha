// ===========================
// Flavour Data Config
// ===========================
// Edit this array to change flavour content and images.
// Set "image" to the path of your image, or leave empty/null for the gradient placeholder.
const flavours = [
    {
        accent: '#e8a87c',
        image: 'images/ginger-lemon.jpg',
        badge: { en: 'Classic', lt: 'Klasikinis' },
        name: { en: 'Ginger Lemon', lt: 'Imbieras ir citrina' },
        desc: {
            en: 'A zesty, warming classic. Fresh ginger root and bright lemon create a perfectly balanced, invigorating brew.',
            lt: 'Aštrus, šildantis klasikinis skonis. Šviežia imbieriaus šaknis ir ryški citrina sukuria tobulai subalansuotą, gaivų gėrimą.'
        }
    },
    {
        accent: '#d4a5e5',
        image: 'images/lavender-blueberry.jpg',
        badge: { en: 'Popular', lt: 'Populiarus' },
        name: { en: 'Lavender Blueberry', lt: 'Levanda ir mėlynės' },
        desc: {
            en: 'Floral and fruity. Calming Lithuanian lavender meets sweet, antioxidant-rich wild blueberries.',
            lt: 'Gėlėtas ir vaisingas. Raminanti lietuviška levanda susitinka su saldžiomis, antioksidantais turtingomis miško mėlynėmis.'
        }
    },
    {
        accent: '#85cdca',
        image: 'images/mint-cucumber.jpg',
        badge: { en: 'Refreshing', lt: 'Gaivus' },
        name: { en: 'Mint Cucumber', lt: 'Mėta ir agurkas' },
        desc: {
            en: 'Cool and crisp. Garden-fresh mint and cucumber make this the ultimate summer refresher.',
            lt: 'Vėsus ir gaivus. Šviežia sodo mėta ir agurkas padaro šį gėrimą idealia vasaros gaiva.'
        }
    },
    {
        accent: '#f5b971',
        image: 'images/turmeric-mango.jpg',
        badge: { en: 'Exotic', lt: 'Egzotiškas' },
        name: { en: 'Turmeric Mango', lt: 'Ciberžolė ir mangas' },
        desc: {
            en: 'Golden and tropical. Anti-inflammatory turmeric pairs beautifully with sweet, luscious mango.',
            lt: 'Auksinis ir tropinis. Priešuždegiminis ciberžolė puikiai dera su saldžiu, sultingu mangu.'
        }
    },
    {
        accent: '#f7a4a4',
        image: 'images/raspberry-rose.jpg',
        badge: { en: 'New', lt: 'Naujiena' },
        name: { en: 'Raspberry Rose', lt: 'Avietė ir rožė' },
        desc: {
            en: 'Romantic and bold. Tart raspberries and delicate rose petals create an elegant, aromatic flavour.',
            lt: 'Romantiškas ir ryškus. Rūgščios avietės ir švelnūs rožių žiedlapiai sukuria elegantišką, aromatingą skonį.'
        }
    },
    {
        accent: '#a8d5a2',
        image: 'images/apple-cinnamon.jpg',
        badge: { en: 'Seasonal', lt: 'Sezoninis' },
        name: { en: 'Apple Cinnamon', lt: 'Obuolys ir cinamonas' },
        desc: {
            en: 'Cozy and comforting. Lithuanian apples and warming cinnamon make this the perfect autumn companion.',
            lt: 'Jaukus ir šildantis. Lietuviški obuoliai ir šildantis cinamonas padaro šį gėrimą tobulu rudens palydovu.'
        }
    }
];

// Hero image — change this path to swap the hero bottle image
const heroImageSrc = 'images/image2.png';

function renderFlavours() {
    const grid = document.getElementById('flavourGrid');
    if (!grid) return;
    grid.innerHTML = flavours.map(f => {
        const hasImage = f.image;
        return `
        <div class="flavour-card" style="--accent: ${f.accent};">
            <div class="flavour-image${hasImage ? '' : ' placeholder'}">
                ${hasImage ? `<img src="${f.image}" alt="${f.name.en} Kombucha" onerror="this.style.display='none'; this.parentElement.classList.add('placeholder');">` : ''}
                <div class="flavour-badge" data-en="${f.badge.en}" data-lt="${f.badge.lt}">${f.badge[currentLang]}</div>
            </div>
            <div class="flavour-info">
                <h3 data-en="${f.name.en}" data-lt="${f.name.lt}">${f.name[currentLang]}</h3>
                <p data-en="${f.desc.en}" data-lt="${f.desc.lt}">${f.desc[currentLang]}</p>
            </div>
        </div>`;
    }).join('');

    // Re-apply scroll animations to new cards
    grid.querySelectorAll('.flavour-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// ===========================
// Language Toggle
// ===========================
const langToggle = document.getElementById('langToggle');
let currentLang = localStorage.getItem('lang') || 'lt';

langToggle.textContent = currentLang === 'en' ? 'LT' : 'EN';
document.documentElement.lang = currentLang;

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'lt' : 'en';
    langToggle.textContent = currentLang === 'en' ? 'LT' : 'EN';
    document.documentElement.lang = currentLang;
    localStorage.setItem('lang', currentLang);
    renderFlavours();
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

// Apply default language on load
updateLanguage();

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
document.querySelectorAll('.feature, .contact-card, .about-text p').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===========================
// Render Flavour Cards & Hero Image
// ===========================
renderFlavours();

const heroImage = document.querySelector('.hero-image');
if (heroImage) {
    heroImage.src = heroImageSrc;
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
