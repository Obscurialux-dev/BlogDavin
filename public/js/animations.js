document.addEventListener('DOMContentLoaded', function() {
    // Fungsi untuk animasi fade-in/slide-up saat scroll
    const revealElements = document.querySelectorAll('.article-card, footer, .search-container, .categories-list, h1');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1 // Munculkan saat 10% elemen terlihat
    });

    revealElements.forEach(el => {
        el.classList.add('reveal'); // Tambahkan class awal untuk disembunyikan
        revealObserver.observe(el);
    });

    // Fungsi untuk menandai link navigasi yang aktif
    const navLinks = document.querySelectorAll('nav a');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        // Hapus trailing slash jika ada, kecuali untuk homepage
        const linkPath = link.getAttribute('href') === '/' ? '/' : link.getAttribute('href').replace(/\/$/, '');
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
});
