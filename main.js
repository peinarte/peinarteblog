document.addEventListener('DOMContentLoaded', () => {
    const recentArticlesContainer = document.getElementById('recent-articles-container');
    const categorySectionsContainer = document.getElementById('category-sections-container');
    const latestArticleLink = document.getElementById('latest-article-link');
    const backToTopBtn = document.getElementById('back-to-top-btn');
    const categoriesMenu = document.getElementById('categories-menu');
    const categoriesBtn = document.getElementById('categories-btn');
    const categoriesDropdown = document.getElementById('categories-dropdown');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileCategoriesDropdown = document.getElementById('mobile-categories-dropdown');
    const searchInput = document.getElementById('search-input');
    const recentArticlesSectionTitle = document.querySelector('h2.text-3xl.font-bold');

    // Back to Top Button Logic
    window.onscroll = () => {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            backToTopBtn.classList.remove('hidden');
        } else {
            backToTopBtn.classList.add('hidden');
        }
    };
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Categories dropdown toggle
    if (categoriesBtn) {
        categoriesBtn.addEventListener('click', () => {
            categoriesDropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            if (!categoriesMenu.contains(event.target)) {
                categoriesDropdown.classList.add('hidden');
            }
        });
    }

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }


    // Helper to slugify category names for URLs
    const slugify = (text) => {
        const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
        const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
        const p = new RegExp(a.split('').join('|'), 'g')
        return text.toString().toLowerCase().replace(p, c => b.charAt(a.indexOf(c)))
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    };

    const renderArticleCard = (article) => {
        // Manejo de fechas inválidas para evitar que la página se rompa
        const date = new Date(article.date);
        const dateString = !isNaN(date)
            ? date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
            : 'Fecha no disponible';

        return `
            <div class="bg-white rounded-lg shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105">
                <a href="articulos/${article.filename}">
                    <img src="${article.image}" alt="${article.title}" class="w-full h-48 object-cover">
                </a>
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2">
                        <a href="articulos/${article.filename}" class="hover:text-purple-600">${article.title}</a>
                    </h3>
                    <p class="text-gray-600 text-sm">${dateString}</p>
                    <p class="text-gray-700 mt-4 text-base line-clamp-3">${article.summary}</p>
                    <a href="articulos/${article.filename}" class="mt-4 inline-block text-purple-600 font-semibold hover:underline">
                        Leer más &rarr;
                    </a>
                </div>
            </div>
        `;
    };

    const loadArticles = async () => {
        try {
            const response = await fetch('articles.json');
            let articles = await response.json();

            // Sort all articles by date (newest first)
            articles.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Setup search listener
            if (searchInput) {
                searchInput.addEventListener('input', () => handleSearch(articles));
            }

            // Update latest article link
            if (articles.length > 0) {
                latestArticleLink.href = `articulos/${articles[0].filename}`;
                latestArticleLink.innerText = 'Leer nuestro último artículo';
            } else {
                latestArticleLink.innerText = 'No hay artículos aún';
            }

            // Render Recent Articles (top 5)
            if (recentArticlesContainer) {
                recentArticlesContainer.innerHTML = articles.slice(0, 5).map(renderArticleCard).join('');
            }

            // Group articles by category and render sections
            const articlesByCategory = {};
            articles.forEach(article => {
                // Usamos la categoría que viene directamente del JSON. ¡Mucho mejor!
                const category = article.category || "Otros";
                if (!articlesByCategory[category]) {
                    articlesByCategory[category] = [];
                }
                articlesByCategory[category].push(article);
            });

            // Define the order of categories
            const categoryOrder = [
                "Peinados de Noche y Fiesta",
                "Peinados Elegantes y Profesionales",
                "Peinados Fáciles para Todos los Días",
                "Peinados Medianos en Capas",
                "Peinados para Cabello Largo",
                "Tendencias 2025 en Peinados",
                "Otros" // Ensure 'Otros' is last
            ];

            // Populate categories dropdown
            if (categoriesDropdown) {
                const categoriesDropdownContainer = categoriesDropdown.querySelector('.py-1');
                if (categoriesDropdownContainer) categoriesDropdownContainer.innerHTML = ''; // Clear previous
                if (mobileCategoriesDropdown) mobileCategoriesDropdown.innerHTML = ''; // Clear previous

                categoryOrder.forEach(categoryName => {
                    if (articlesByCategory[categoryName] && articlesByCategory[categoryName].length > 0) {
                        const categorySlug = slugify(categoryName);
                        const link = document.createElement('a');
                        link.href = `categorias/${categorySlug}.html`;
                        link.textContent = categoryName;
                        link.className = 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100';
                        link.setAttribute('role', 'menuitem');
                        categoriesDropdownContainer.appendChild(link);

                        const mobileLink = link.cloneNode(true);
                        mobileLink.className = 'block text-gray-600 hover:text-gray-900 py-2';
                        mobileCategoriesDropdown.appendChild(mobileLink);
                    }
                });
            }


            if (categorySectionsContainer) categorySectionsContainer.innerHTML = ''; // Clear previous content

            categoryOrder.forEach(categoryName => {
                const categoryArticles = articlesByCategory[categoryName];
                if (categoryArticles && categoryArticles.length > 0) {
                    const categorySlug = slugify(categoryName);
                    const categorySection = document.createElement('section');
                    categorySection.className = 'mb-8';
                    categorySection.innerHTML = `
                        <h2 class="text-3xl font-bold mb-4">${categoryName}</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            ${categoryArticles.slice(0, 3).map(renderArticleCard).join('')}
                        </div>
                        <div class="text-center mt-8">
                            <a href="categorias/${categorySlug}.html" class="inline-block bg-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105">
                                Ver más en ${categoryName} &rarr;
                            </a>
                        </div>
                    `;
                    if (categorySectionsContainer) {
                        categorySectionsContainer.appendChild(categorySection);
                    }
                }
            });

        } catch (error) {
            console.error('Error al cargar los artículos:', error);
            if (recentArticlesContainer) {
                recentArticlesContainer.innerHTML = '<p class="text-center text-red-500">No se pudieron cargar los artículos. Por favor, asegúrate de que el archivo articles.json existe y es válido.</p>';
            }
            if (latestArticleLink) {
                latestArticleLink.innerText = 'Error al cargar artículos';
            }
        }
    };

    loadArticles();
});
