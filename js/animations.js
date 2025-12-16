/**
 * TK Melati Purwakarta - Interactive Animations
 * Menambahkan scroll-triggered animations untuk lebih interactive UI
 */

// Intersection Observer untuk scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe program cards
document.querySelectorAll('.program-card').forEach((card) => {
  observer.observe(card);
});

// Observe gallery items
document.querySelectorAll('.gallery-item').forEach((item) => {
  observer.observe(item);
});

/**
 * Navbar Background Animation on Scroll
 */
const navbar = document.querySelector('.navbar');
let isScrolled = false;

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    if (!isScrolled) {
      navbar.style.background = 'rgba(19, 84, 122, 0.98)';
      navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
      isScrolled = true;
    }
  } else {
    if (isScrolled) {
      navbar.style.background = 'rgba(51, 152, 211, 0.95)';
      navbar.style.boxShadow = 'none';
      isScrolled = false;
    }
  }
});

/**
 * Smooth Scroll dengan Offset untuk Links
 */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href !== '#top') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80; // Navbar height
        const targetPosition = target.offsetTop - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});

/**
 * Hero Section Parallax Effect
 */
const heroSection = document.querySelector('.hero-section');
if (heroSection) {
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    heroSection.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
  });
}

/**
 * Button Ripple Effect
 */
document.querySelectorAll('.custom-btn').forEach((button) => {
  button.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    // Remove previous ripples
    this.querySelectorAll('.ripple').forEach((r) => r.remove());
    this.appendChild(ripple);
  });
});

/**
 * Active Navigation Link Indicator
 */
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

/**
 * Mobile Menu Close on Link Click
 */
document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('#navbarNav');

    if (navbarToggler && navbarCollapse) {
      // Tutup menu jika sedang terbuka
      if (navbarCollapse.classList.contains('show')) {
        navbarToggler.click();
      }
    }
  });
});

console.log('✨ TK Melati Purwakarta - Interactive Animations Loaded!');
