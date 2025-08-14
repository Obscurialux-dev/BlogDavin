document.addEventListener('DOMContentLoaded', function() {
    // === LOGIKA HAMBURGER MENU (BARU) ===
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', function() {
            navMenu.classList.toggle('open');
        });
    }

    // === FUNGSI ANIMASI SCROLL ===
    const revealElements = document.querySelectorAll('.article-card, footer, .search-container, .categories-list, h1');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // === FUNGSI NAVIGASI AKTIF ===
    const navLinks = document.querySelectorAll('nav a');
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href') === '/' ? '/' : link.getAttribute('href').replace(/\/$/, '');
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
});
