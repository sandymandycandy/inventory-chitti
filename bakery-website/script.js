// ====================================
// BAKERY DELIGHT - INTERACTIVE FUNCTIONALITY
// ====================================

// === MOBILE MENU ===
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// === NAVBAR SCROLL EFFECT ===
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.08)';
    } else {
        navbar.style.boxShadow = '0 2px 16px rgba(0, 0, 0, 0.04)';
    }

    lastScroll = currentScroll;
});

// === ACTIVE NAVIGATION LINK ===
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// === SMOOTH SCROLL ===
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// === CONTACT FORM HANDLING ===
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value
        };

        // Show success message
        alert('Thank you for your message! We\'ll get back to you soon.');

        // Reset form
        contactForm.reset();

        // In production, you would send this to your backend:
        // fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });
    });
}

// === SCROLL ANIMATIONS ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
const animatedElements = document.querySelectorAll(
    '.service-card, .product-card, .about-content, .contact-card'
);

animatedElements.forEach(el => observer.observe(el));

// === GENERATE PLACEHOLDER IMAGES ===
// This creates colored placeholders for images during development
// Replace with actual images in production

function createPlaceholderImage(elementId, width, height, color, text) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);

    const img = document.getElementById(elementId);
    if (img) {
        img.src = canvas.toDataURL();
    }
}

// Generate placeholder images
window.addEventListener('DOMContentLoaded', () => {
    // Hero product
    createPlaceholderImage('heroProductImg', 500, 500, '#E8A87C', '🍩 Donuts');

    // Service icons
    createPlaceholderImage('cakeIcon', 300, 300, '#D97850', '🎂 Cake');
    createPlaceholderImage('cupcakeIcon', 300, 300, '#E8A87C', '🧁 Cupcake');
    createPlaceholderImage('donutIcon', 300, 300, '#F4E285', '🍩 Donut');
    createPlaceholderImage('biscuitIcon', 300, 300, '#A8D5BA', '🍪 Biscuits');

    // Cookies
    for (let i = 1; i <= 6; i++) {
        createPlaceholderImage(`cookie${i}`, 300, 300, '#C4A57B', '🍪');
    }

    // About image
    createPlaceholderImage('aboutImg', 600, 800, '#E8DFD0', '🏪 Bakery');
});

// === BOOK NOW BUTTON ===
const bookNowButtons = document.querySelectorAll('.btn-primary, .btn-dark');
bookNowButtons.forEach(button => {
    if (button.textContent.includes('Book')) {
        button.addEventListener('click', () => {
            // Scroll to contact section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

// === NEWSLETTER FORM ===
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;

        alert(`Thank you for subscribing! We'll send updates to ${email}`);
        newsletterForm.reset();

        // In production, send to backend:
        // fetch('/api/newsletter', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email })
        // });
    });
}

// === LOADING ANIMATION ===
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

console.log('🍰 Bakery Delight website loaded successfully!');
