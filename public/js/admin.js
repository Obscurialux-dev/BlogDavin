document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi TinyMCE
    tinymce.init({
        selector: '#content',
        plugins: 'autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
        toolbar: 'undo redo | blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
        skin: (document.body.classList.contains('dark-theme') ? 'oxide-dark' : 'oxide'),
        content_css: (document.body.classList.contains('dark-theme') ? 'dark' : 'default')
    });

    const form = document.getElementById('article-form');
    const messageEl = document.getElementById('response-message');
    const themeToggle = document.getElementById('theme-toggle');
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
                    content: tinymce.get('content').getContent(),
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
                    tinymce.get('content').setContent('');
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
                    });
            } else {
                submitArticleData('');
            }
        });
    }
});