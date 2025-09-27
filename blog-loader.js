document.addEventListener('DOMContentLoaded', () => {
    const archiveContainer = document.getElementById('archive-container');

    const renderArticleCard = (article) => {
        const date = new Date(article.date);
        const dateString = !isNaN(date)
            ? date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
            : 'Fecha no disponible';

        return `
            <div class="bg-white rounded-lg shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105">
                <a href="${article.url}">
                    <img src="${article.image}" alt="${article.title}" class="w-full h-48 object-cover">
                </a>
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2">
                        <a href="${article.url}" class="hover:text-purple-600">${article.title}</a>
                    </h3>
                    <p class="text-gray-600 text-sm">${dateString}</p>
                    <p class="text-gray-700 mt-4 text-base line-clamp-3">${article.summary}</p>
                    <a href="${article.url}" class="mt-4 inline-block text-purple-600 font-semibold hover:underline">
                        Leer más &rarr;
                    </a>
                </div>
            </div>
        `;
    };

    const loadAllArticles = async () => {
        try {
            const response = await fetch('articles.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let articles = await response.json();

            articles.sort((a, b) => new Date(b.date) - new Date(a.date));

            const articlesByCategory = {};
            articles.forEach(article => {
                const category = article.category || "Otros";
                if (!articlesByCategory[category]) {
                    articlesByCategory[category] = [];
                }
                articlesByCategory[category].push(article);
            });

            const categoryOrder = Object.keys(articlesByCategory).sort((a, b) => a.localeCompare(b));

            if (archiveContainer) archiveContainer.innerHTML = '';

            if (articles.length === 0) {
                archiveContainer.innerHTML = '<p class="text-center text-gray-500">No hay artículos para mostrar.</p>';
                return;
            }

            categoryOrder.forEach(categoryName => {
                const categoryArticles = articlesByCategory[categoryName];
                if (categoryArticles && categoryArticles.length > 0) {
                    const categorySection = document.createElement('section');
                    categorySection.className = 'mb-12';
                    categorySection.innerHTML = `
                        <h2 class="text-3xl font-bold mb-6 border-b-2 border-purple-200 pb-2">${categoryName}</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            ${categoryArticles.map(renderArticleCard).join('')}
                        </div>
                    `;
                    archiveContainer.appendChild(categorySection);
                }
            });

        } catch (error) {
            console.error('Error al cargar los artículos:', error);
            if (archiveContainer) {
                archiveContainer.innerHTML = '<p class="text-center text-red-500">No se pudieron cargar los artículos. Por favor, inténtalo de nuevo más tarde.</p>';
            }
        }
    };

    loadAllArticles();
});