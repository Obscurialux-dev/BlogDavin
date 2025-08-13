document.addEventListener('DOMContentLoaded', function() {
    const articleContent = document.getElementById('article-content');
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');

    function loadArticle() {
        if (!articleId || !articleContent) return;

        fetch(`/api/articles/${articleId}`)
            .then(function(response) { return response.json(); })
            .then(function(result) {
                if (result.data) {
                    const article = result.data;
                    document.title = article.title;

                    const imageHtml = article.imageUrl ? `<img src="${article.imageUrl}" alt="" class="cover-image">` : '';

                    // --- PERUBAHAN UTAMA DI SINI ---
                    // 1. Buat converter Showdown
                    const converter = new showdown.Converter();
                    // 2. Ambil konten mentah (Markdown) dari database
                    const rawContent = article.content;
                    // 3. Ubah Markdown menjadi HTML
                    const formattedContent = converter.makeHtml(rawContent);
                    // --- AKHIR PERUBAHAN ---

                    articleContent.innerHTML = `
                        <h1>${article.title}</h1>
                        <p class="meta">Oleh ${article.author} &bull; ${new Date(article.createdAt).toLocaleString('id-ID')}</p>
                        ${imageHtml}
                        <div class="article-body">
                            ${formattedContent}
                        </div>
                    `;
                } else {
                    articleContent.innerHTML = '<h1>Artikel tidak ditemukan.</h1>';
                }
            })
            .catch(function(error) {
                articleContent.innerHTML = '<h1>Gagal memuat artikel.</h1>';
            });
    }

    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        let theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });

    loadArticle();
});
