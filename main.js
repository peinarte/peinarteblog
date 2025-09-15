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
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    };

    const renderArticleCard = (article) => {
        return `
            <div class="bg-white rounded-lg shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105">
                <a href="articulos/${article.filename}">
                    <img src="${article.image}" alt="${article.title}" class="w-full h-48 object-cover">
                </a>
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2">
                        <a href="articulos/${article.filename}" class="hover:text-purple-600">${article.title}</a>
                    </h3>
                    <p class="text-gray-600 text-sm">${new Date(article.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p class="text-gray-700 mt-4 text-base line-clamp-3">${article.summary}</p>
                    <a href="articulos/${article.filename}" class="mt-4 inline-block text-purple-600 font-semibold hover:underline">
                        Leer más &rarr;
                    </a>
                </div>
            </div>
        `;
    };

    const getArticleCategory = (title) => {
        const titleLower = title.toLowerCase();
        if (titleLower.includes("noche") || titleLower.includes("fiesta") || titleLower.includes("deslumbran") || titleLower.includes("elegancia irresistible") || titleLower.includes("elegancia radiante")) {
            return "Peinados de Noche y Fiesta";
        } else if (titleLower.includes("elegante") || titleLower.includes("profesional") || titleLower.includes("ejecutivos") || titleLower.includes("trabajo") || titleLower.includes("negocios") || titleLower.includes("poderosa") || titleLower.includes("impecable")) {
            return "Peinados Elegantes y Profesionales";
        } else if (titleLower.includes("fácil") || titleLower.includes("sencillos") || titleLower.includes("coleta") || titleLower.includes("moño") || titleLower.includes("día") || titleLower.includes("minutos")) {
            return "Peinados Fáciles para Todos los Días";
        } else if (titleLower.includes("capas") || titleLower.includes("medias") || titleLower.includes("corte")) {
            return "Peinados Medianos en Capas";
        } else if (titleLower.includes("largo") || titleLower.includes("trenzas")) {
            return "Peinados para Cabello Largo";
        } else if (titleLower.includes("2025") || titleLower.includes("futuro") || titleLower.includes("moda capilar") || titleLower.includes("tendencias")) {
            return "Tendencias 2025 en Peinados";
        } else {
            return "Otros";
        }
    };

    const loadArticles = async () => {
        try {
            const response = await fetch('articles.json');
            let articles = await response.json();

            // Sort all articles by date (newest first)
            articles.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Update latest article link
            if (articles.length > 0) {
                latestArticleLink.href = `articulos/${articles[0].filename}`;
                latestArticleLink.innerText = 'Leer nuestro último artículo';
            } else {
                latestArticleLink.innerText = 'No hay artículos aún';
            }

            // Render Recent Articles (top 5)
            recentArticlesContainer.innerHTML = '';
            articles.slice(0, 5).forEach(article => {
                recentArticlesContainer.innerHTML += renderArticleCard(article);
            });

            // Group articles by category and render sections
            const articlesByCategory = {};
            articles.forEach(article => {
                const category = getArticleCategory(article.title); // Use the JS function to assign category
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
            const categoriesDropdownContainer = categoriesDropdown.querySelector('.py-1');
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


            categorySectionsContainer.innerHTML = ''; // Clear previous content

            categoryOrder.forEach(categoryName => {
                const categoryArticles = articlesByCategory[categoryName];
                if (categoryArticles && categoryArticles.length > 0) {
                    const categorySlug = slugify(categoryName);
                    const categorySection = document.createElement('section');
                    categorySection.className = 'mb-8';
                    categorySection.innerHTML = `
                        <h2 class="text-3xl font-bold mb-4">${categoryName}</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            ${categoryArticles.slice(0, 5).map(renderArticleCard).join('')}
                        </div>
                        <div class="text-center mt-8">
                            <a href="categorias/${categorySlug}.html" class="inline-block bg-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105">
                                Ver más ${categoryName} &rarr;
                            </a>
                        </div>
                    `;
                    categorySectionsContainer.appendChild(categorySection);
                }
            });

        } catch (error) {
            console.error('Error al cargar los artículos:', error);
            recentArticlesContainer.innerHTML = '<p class="text-center text-red-500">No se pudieron cargar los artículos. Por favor, asegúrate de que el archivo articles.json existe y es válido.</p>';
            latestArticleLink.innerText = 'Error al cargar artículos';
        }
    };

    loadArticles();
});