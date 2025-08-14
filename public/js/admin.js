document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('article-form');
    const messageEl = document.getElementById('response-message');
    // ... (kode tema & hamburger tetap sama) ...
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') { document.body.classList.add('dark-theme'); }
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        let theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', function() {
            navMenu.classList.toggle('open');
        });
    }


    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            messageEl.textContent = 'Memproses...';
            messageEl.style.color = 'var(--meta-text-color)';

            const imageFile = e.target.elements.imageFile.files[0];

            const submitArticleData = (finalImageUrl) => {
                const data = {
                    title: e.target.elements.title.value,
                    content: e.target.elements.content.value,
                    author: e.target.elements.author.value,
                    category: e.target.elements.category.value,
                    imageUrl: finalImageUrl
                };

                fetch('/api/articles', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                })
                .then(res => res.json())
                .then(result => {
                    if (result.error) throw new Error(result.error);
                    messageEl.textContent = 'Artikel berhasil dipublikasikan!';
                    messageEl.style.color = 'green';
                    form.reset();
                })
                .catch(err => {
                    messageEl.textContent = `Gagal: ${err.message}`;
                    messageEl.style.color = 'red';
                });
            };

            if (imageFile) {
                messageEl.textContent = 'Meng-upload gambar...';
                const formData = new FormData();
                formData.append('imageFile', imageFile);

                fetch('/api/upload', { method: 'POST', body: formData })
                    .then(res => res.json())
                    .then(uploadResult => {
                        if (uploadResult.error) throw new Error(uploadResult.error);
                        submitArticleData(uploadResult.imageUrl);
                    })
                    .catch(err => {
                        messageEl.textContent = `Gagal upload gambar: ${err.message}`;
                        messageEl.style.color = 'red';
                    });
            } else {
                submitArticleData(''); // Kirim string kosong jika tidak ada gambar
            }
        });
    }
});