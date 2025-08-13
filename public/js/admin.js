document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('article-form');
    const messageEl = document.getElementById('response-message');

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

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const data = {
                title: e.target.elements.title.value,
                content: e.target.elements.content.value,
                author: e.target.elements.author.value,
                imageUrl: e.target.elements.imageUrl.value,
                category: e.target.elements.category.value
            };
            messageEl.textContent = 'Mengirim...';
            fetch('/api/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            .then(function(response) { return response.json(); })
            .then(function(data) {
                if (data.error) throw new Error(data.error);
                messageEl.textContent = 'Artikel berhasil dipublikasikan!';
                form.reset();
            })
            .catch(function(error) {
                messageEl.textContent = 'Gagal: ' + error.message;
            });
        });
    }
});
