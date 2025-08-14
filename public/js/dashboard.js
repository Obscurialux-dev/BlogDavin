import { auth, onAuthStateChanged } from './firebase-init.js';

document.addEventListener('DOMContentLoaded', function() {
    const articlesContainer = document.getElementById('my-articles-container');
    const dashboardTitle = document.getElementById('dashboard-title');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            dashboardTitle.textContent = `Dashboard ${user.displayName}`;
            fetch(`/api/my-articles?userId=${user.uid}`)
                .then(res => res.json())
                .then(result => {
                    articlesContainer.innerHTML = '';
                    if (result.data && result.data.length > 0) {
                        result.data.forEach(article => {
                            const articleEl = document.createElement('div');
                            articleEl.className = 'article-card';
                            articleEl.innerHTML = `
                                <h2>${article.title}</h2>
                                <p class="meta">${new Date(article.createdAt).toLocaleDateString('id-ID')}</p>
                                <div class="management-buttons" style="opacity:1; position:relative; top:0; right:0; justify-content: flex-start;">
                                    <a href="/edit.html?id=${article.id}" class="btn-edit">Edit</a>
                                    <button class="btn-delete" data-id="${article.id}">Delete</button>
                                </div>
                            `;
                            articlesContainer.appendChild(articleEl);
                        });
                    } else {
                        articlesContainer.innerHTML = '<p>Kamu belum punya tulisan.</p>';
                    }
                });
        } else {
            window.location.href = '/';
        }
    });
});