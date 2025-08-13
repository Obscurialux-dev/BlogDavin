document.addEventListener('DOMContentLoaded', function() {
    const editForm = document.getElementById('edit-form');
    const messageEl = document.getElementById('response-message');
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');

    if (!articleId) {
        editForm.innerHTML = '<h1>ID Artikel tidak ditemukan.</h1>';
        return;
    }

    fetch(`/api/articles/${articleId}`)
        .then(res => res.json())
        .then(result => {
            if (result.data) {
                const article = result.data;
                editForm.innerHTML = `
                    <div class="form-group">
                        <label for="title">Judul</label>
                        <input type="text" id="title" name="title" value="${article.title}" required>
                    </div>
                    <div class="form-group">
                        <label for="author">Penulis</label>
                        <input type="text" id="author" name="author" value="${article.author}" required>
                    </div>
                    <div class="form-group">
                        <label for="category">Kategori</label>
                        <input type="text" id="category" name="category" value="${article.category || ''}" placeholder="Contoh: Teknologi">
                    </div>
                    <div class="form-group">
                        <label for="imageUrl">URL Gambar (Thumbnail)</label>
                        <input type="text" id="imageUrl" name="imageUrl" value="${article.imageUrl || ''}" placeholder="https://...">
                    </div>
                    <div class="form-group">
                        <label for="content">Konten</label>
                        <textarea id="content" name="content" rows="15" required>${article.content}</textarea>
                    </div>
                    <button type="submit">Simpan Perubahan</button>
                `;
            } else {
                editForm.innerHTML = '<h1>Artikel tidak ditemukan.</h1>';
            }
        });

    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const data = {
            title: e.target.elements.title.value,
            content: e.target.elements.content.value,
            author: e.target.elements.author.value,
            imageUrl: e.target.elements.imageUrl.value,
            category: e.target.elements.category.value
        };

        messageEl.textContent = 'Menyimpan...';

        fetch(`/api/articles/${articleId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(result => {
            if (result.message === 'success') {
                messageEl.textContent = 'Perubahan berhasil disimpan!';
                setTimeout(() => { window.location.href = '/'; }, 1500);
            } else {
                throw new Error(result.error || 'Gagal menyimpan perubahan.');
            }
        })
        .catch(err => {
            messageEl.textContent = `Error: ${err.message}`;
        });
    });
});
