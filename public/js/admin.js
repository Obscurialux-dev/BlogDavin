// Variabel global untuk menyimpan instance editor
let editor;

// Inisialisasi CKEditor
ClassicEditor
    .create(document.querySelector('#content'), {
        // Konfigurasi untuk upload gambar
        simpleUpload: {
            // URL endpoint di backend kamu yang menangani upload gambar
            uploadUrl: '/api/upload'
        }
    })
    .then(newEditor => {
        editor = newEditor; // Simpan instance editor
    })
    .catch(error => {
        console.error(error);
    });


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('article-form');
    const messageEl = document.getElementById('response-message');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            messageEl.textContent = 'Memproses...';
            messageEl.style.color = 'var(--secondary-text-color)';

            const imageFile = e.target.elements.imageFile.files[0];

            const submitArticleData = (finalImageUrl) => {
                // Ambil konten dari editor CKEditor
                const content = editor.getData();
                
                const data = {
                    title: e.target.elements.title.value,
                    content: content,
                    author: e.target.elements.author.value,
                    category: e.target.elements.category.value,
                    imageUrl: finalImageUrl // Ini untuk thumbnail
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
                    editor.setData(''); // Kosongkan editor
                })
                .catch(err => {
                    messageEl.textContent = `Gagal: ${err.message}`;
                    messageEl.style.color = 'red';
                });
            };

            // Logika untuk upload thumbnail tetap sama
            if (imageFile) {
                messageEl.textContent = 'Meng-upload thumbnail...';
                const formData = new FormData();
                formData.append('imageFile', imageFile);

                fetch('/api/upload', { method: 'POST', body: formData })
                    .then(res => res.json())
                    .then(uploadResult => {
                        if (uploadResult.error) throw new Error(uploadResult.error);
                        submitArticleData(uploadResult.imageUrl);
                    })
                    .catch(err => {
                        messageEl.textContent = `Gagal upload thumbnail: ${err.message}`;
                    });
            } else {
                submitArticleData('');
            }
        });
    }
});
