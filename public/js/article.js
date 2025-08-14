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

                    const formattedContent = article.content;

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

    loadArticle();
});
