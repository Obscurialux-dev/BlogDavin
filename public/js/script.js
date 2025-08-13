document.addEventListener('DOMContentLoaded', function() {
    const articlesContainer = document.getElementById('articles-container');
    const paginationContainer = document.getElementById('pagination-container');
    const searchBox = document.getElementById('search-box');
    const pageTitle = document.getElementById('page-title');
    const categoriesContainer = document.getElementById('categories-container');

    const articlesPerPage = 5;
    let currentPage = 1;
    let currentSearchTerm = '';
    let currentCategory = '';
    let searchTimeout;

    function loadArticles(page, searchTerm, category) {
        currentPage = page;
        currentSearchTerm = searchTerm;
        currentCategory = category;
        articlesContainer.innerHTML = '<p class="loading-text">Memuat artikel...</p>';

        if (category) {
            pageTitle.textContent = `Tulisan dalam Kategori "${category}"`;
        } else if (searchTerm) {
            pageTitle.textContent = `Hasil Pencarian untuk "${searchTerm}"`;
        } else {
            pageTitle.textContent = 'Tulisan Terbaru';
        }

        const url = `/api/articles?page=${page}&limit=${articlesPerPage}&search=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(category)}`;
        fetch(url)
            .then(res => res.json())
            .then(result => {
                articlesContainer.innerHTML = '';
                if (result.data && result.data.length > 0) {
                    result.data.forEach(article => {
                        const articleWrapper = document.createElement('div');
                        articleWrapper.className = 'article-card';
                        const previewContent = article.content.substring(0, 120) + '...';
                        const imageHtml = article.imageUrl ? `<img src="${article.imageUrl}" alt="" class="thumbnail">` : '';
                        const categoryHtml = article.category ? `<span class="category-tag">${article.category}</span>` : '';

                        articleWrapper.innerHTML = `
                            <div class="management-buttons">
                                <a href="/edit.html?id=${article.id}" class="btn-edit">Edit</a>
                                <button class="btn-delete" data-id="${article.id}">Delete</button>
                            </div>
                            <a href="/article.html?id=${article.id}" style="text-decoration: none; color: inherit;">
                                ${categoryHtml}
                                <div class="article-card-content">
                                    <div>
                                        <h2>${article.title}</h2>
                                        <p class="preview">${previewContent}</p>
                                        <p class="meta">Oleh ${article.author} &bull; ${new Date(article.createdAt).toLocaleDateString('id-ID')}</p>
                                    </div>
                                    ${imageHtml}
                                </div>
                            </a>
                        `;
                        articlesContainer.appendChild(articleWrapper);
                    });
                    document.querySelectorAll('.btn-delete').forEach(button => button.addEventListener('click', handleDelete));
                } else {
                    articlesContainer.innerHTML = '<p>Tidak ada tulisan yang cocok.</p>';
                }
                updatePaginationButtons();
                updateCategoryLinks();
            });
    }

    function setupPagination(searchTerm, category) {
        const url = `/api/articles/count?search=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(category)}`;
        fetch(url).then(res => res.json()).then(result => {
            const totalPages = Math.ceil(result.data.count / articlesPerPage);
            paginationContainer.innerHTML = '';
            if (totalPages > 1) {
                for (let i = 1; i <= totalPages; i++) {
                    const pageBtn = document.createElement('button');
                    pageBtn.className = 'page-btn';
                    pageBtn.textContent = i;
                    pageBtn.dataset.page = i;
                    pageBtn.addEventListener('click', () => loadArticles(i, currentSearchTerm, currentCategory));
                    paginationContainer.appendChild(pageBtn);
                }
            }
            updatePaginationButtons();
        });
    }

    function loadCategories() {
        fetch('/api/categories').then(res => res.json()).then(result => {
            if (result.data) {
                categoriesContainer.innerHTML = '';
                // Tombol "Semua"
                const allBtn = document.createElement('a');
                allBtn.href = "#";
                allBtn.className = 'category-link';
                allBtn.textContent = 'Semua';
                allBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    searchBox.value = '';
                    loadArticles(1, '', '');
                    setupPagination('', '');
                });
                categoriesContainer.appendChild(allBtn);

                result.data.forEach(cat => {
                    const categoryBtn = document.createElement('a');
                    categoryBtn.href = `#${cat.category}`;
                    categoryBtn.className = 'category-link';
                    categoryBtn.textContent = cat.category;
                    categoryBtn.dataset.category = cat.category;
                    categoryBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        searchBox.value = '';
                        loadArticles(1, '', cat.category);
                        setupPagination('', cat.category);
                    });
                    categoriesContainer.appendChild(categoryBtn);
                });
                updateCategoryLinks();
            }
        });
    }

    function updateCategoryLinks() {
        document.querySelectorAll('.category-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.category === currentCategory || (!currentCategory && link.textContent === 'Semua')) {
                link.classList.add('active');
            }
        });
    }

    function updatePaginationButtons() { /* ... (fungsi ini tidak berubah) ... */ }
    function handleDelete(event) { /* ... (fungsi ini tidak berubah) ... */ }
    // ... (kode tema tetap sama) ...

    // Event listener untuk kotak pencarian
    searchBox.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const searchTerm = e.target.value;
        searchTimeout = setTimeout(() => {
            loadArticles(1, searchTerm, ''); // Pencarian akan mereset filter kategori
            setupPagination(searchTerm, '');
        }, 300);
    });

    // Inisialisasi
    loadArticles(currentPage, currentSearchTerm, currentCategory);
    setupPagination(currentSearchTerm, currentCategory);
    loadCategories();
});