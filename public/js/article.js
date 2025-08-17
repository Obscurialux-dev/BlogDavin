document.addEventListener('DOMContentLoaded', function() {
    const articleContainer = document.getElementById('article-container');
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');

    if (!articleId) {
        articleContainer.innerHTML = '<h1>ID Artikel tidak ditemukan.</h1>';
        return;
    }

    fetch(`/api/articles/${articleId}`)
        .then(res => res.json())
        .then(result => {
            if (result.data) {
                const article = result.data;

                // Mengatur judul halaman browser
                document.title = article.title;

                // Perkiraan waktu baca (rata-rata 200 kata per menit)
                const words = article.content.split(' ').length;
                const readTime = Math.ceil(words / 200);

                // Format tanggal
                const formattedDate = new Date(article.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                // Membuat struktur HTML artikel
                articleContainer.innerHTML = `
                    <header class="article-header">
                        <h1 class="article-title">${article.title}</h1>
                        <p class="article-subtitle">Sebuah cerita dan pemikiran.</p>
                        <div class="author-info">
                            <img src="https://placehold.co/40x40/E2E8F0/333?text=${article.author.charAt(0)}" alt="Avatar Penulis" class="author-avatar">
                            <div class="author-details">
                                <span class="author-name">${article.author}</span>
                                <span class="article-meta">${readTime} min read &middot; ${formattedDate}</span>
                            </div>
                        </div>
                    </header>

                    <figure class="article-figure">
                        <img src="${article.imageUrl || 'https://placehold.co/800x400/E2E8F0/333?text=Gambar+Artikel'}" alt="${article.title}" class="article-image">
                        <figcaption class="image-caption">Photo by Starluxx</figcaption>
                    </figure>

                    <div class="article-body">
                        ${article.content}
                    </div>
                `;
            } else {
                articleContainer.innerHTML = '<h1>Artikel tidak ditemukan.</h1>';
            }
        })
        .catch(err => {
            console.error("Gagal memuat artikel:", err);
            articleContainer.innerHTML = '<h1>Gagal memuat artikel.</h1>';
        });
});
