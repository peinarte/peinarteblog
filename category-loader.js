document.addEventListener('DOMContentLoaded', async () => {
    const categoryArticlesContainer = document.getElementById('category-articles-container');
    // Extrae el nombre de la categoría del título de la página.
    // "PeinArte | Mi Categoría" -> "Mi Categoría"
    const categoryName = document.title.split('|')[1].trim();

    const renderArticleCard = (article) => {
        // La ruta a las imágenes y artículos es relativa a la página de categoría.
        const articlePath = `../articulos/${article.filename}`;
        const imagePath = article.image.startsWith('http') ? article.image : `../${article.image}`;

        // Manejo de fechas inválidas para evitar que la página se rompa
        const date = new Date(article.date);
        const dateString = !isNaN(date)
            ? date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
            : 'Fecha no disponible';

        return `
            <div class="bg-white rounded-lg shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105">
                <a href="${articlePath}">
                    <img src="${imagePath}" alt="${article.title}" class="w-full h-48 object-cover">
                </a>
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2">
                        <a href="${articlePath}" class="hover:text-purple-600">${article.title}</a>
                    </h3>
                    <p class="text-gray-600 text-sm">${dateString}</p>
                    <p class="text-gray-700 mt-4 text-base line-clamp-3">${article.summary}</p>
                    <a href="${articlePath}" class="mt-4 inline-block text-purple-600 font-semibold hover:underline">
                        Leer más &rarr;
                    </a>
                </div>
            </div>
        `;
    };

    // --- Lógica de Carga ---

    try {
        // La ruta al JSON es relativa desde la carpeta /categorias
        const response = await fetch('../articles.json');
        const allArticles = await response.json();

        // Filtra los artículos usando la categoría que viene del JSON
        const filteredArticles = allArticles.filter(article => (article.category || "Otros") === categoryName);

        // Ordena los artículos filtrados por fecha
        filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (filteredArticles.length > 0) {
            categoryArticlesContainer.innerHTML = filteredArticles.map(renderArticleCard).join('');
        } else {
            categoryArticlesContainer.innerHTML = '<p class="col-span-full text-center text-gray-600">No hay artículos en esta categoría aún.</p>';
        }

    } catch (error) {
        console.error('Error al cargar los artículos de la categoría:', error);
        categoryArticlesContainer.innerHTML = '<p class="col-span-full text-center text-red-500">No se pudieron cargar los artículos de esta categoría.</p>';
    }
});