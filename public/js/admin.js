document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi TinyMCE
    tinymce.init({
        selector: '#content',
        plugins: 'autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
        toolbar: 'undo redo | blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
        // Menyesuaikan tema editor dengan tema sistem/browser (lebih modern)
        skin: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oxide-dark' : 'oxide',
        content_css: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default'
    });

    const form = document.getElementById('article-form');
    const messageEl = document.getElementById('response-message');
    
    // Kode untuk hamburger button dan theme toggle sudah dihapus karena tidak diperlukan di sini.
    // Fungsi navigasi sudah ditangani secara global oleh auth-ui.js.

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            messageEl.textContent = 'Memproses...';
            messageEl.style.color = 'var(--secondary-text-color)';

            const imageFile = e.target.elements.imageFile.files[0];

            const submitArticleData = (finalImageUrl) => {
                // Ambil konten dari editor TinyMCE yang sudah diinisialisasi
                const content = tinymce.get('content').getContent();
                
                const data = {
                    title: e.target.elements.title.value,
                    content: content,
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
                    tinymce.get('content').setContent(''); // Kosongkan editor setelah berhasil
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
