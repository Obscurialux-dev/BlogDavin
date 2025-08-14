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
                const imagePreview = article.imageUrl ? `<img src="${article.imageUrl}" alt="Pratinjau Gambar" style="max-width: 200px; margin-top: 10px; border-radius: 8px;">` : '';

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
                        <input type="text" id="category" name="category" value="${article.category || ''}">
                    </div>
                    <div class="form-group">
                        <label for="imageFile">Ganti Gambar Thumbnail (Opsional)</label>
                        <input type="file" id="imageFile" name="imageFile" accept="image/*">
                        <input type="hidden" id="imageUrl" name="imageUrl" value="${article.imageUrl || ''}">
                        <div id="image-preview-container">${imagePreview}</div>
                    </div>
                    <div class="form-group">
                        <label for="content">Konten</label>
                        <textarea id="content" name="content" rows="15">${article.content}</textarea>
                    </div>
                    <button type="submit">Simpan Perubahan</button>
                `;

                // Inisialisasi TinyMCE setelah form diisi
                tinymce.init({
                    selector: '#content',
                    plugins: 'autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
                    toolbar: 'undo redo | blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                    skin: (document.body.classList.contains('dark-theme') ? 'oxide-dark' : 'oxide'),
                    content_css: (document.body.classList.contains('dark-theme') ? 'dark' : 'default')
                });
            } else {
                editForm.innerHTML = '<h1>Artikel tidak ditemukan.</h1>';
            }
        });

    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        messageEl.textContent = 'Memproses...';

        const imageFile = e.target.elements.imageFile.files[0];
        const existingImageUrl = e.target.elements.imageUrl.value;

        const submitArticleData = (finalImageUrl) => {
            const data = {
                title: e.target.elements.title.value,
                content: tinymce.get('content').getContent(), // Ambil konten dari TinyMCE
                author: e.target.elements.author.value,
                category: e.target.elements.category.value,
                imageUrl: finalImageUrl
            };
            fetch(`/api/articles/${articleId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(result => {
                if (result.error) throw new Error(result.error);
                messageEl.textContent = 'Perubahan berhasil disimpan!';
                messageEl.style.color = 'green';
                setTimeout(() => { window.location.href = '/'; }, 1500);
            })
            .catch(err => {
                messageEl.textContent = `Gagal: ${err.message}`;
                messageEl.style.color = 'red';
            });
        };

        if (imageFile) {
            messageEl.textContent = 'Meng-upload gambar baru...';
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
            submitArticleData(existingImageUrl);
        }
    });
});