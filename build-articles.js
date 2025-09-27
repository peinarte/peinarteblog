const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const articlesDir = path.join(__dirname, 'articulos');
const outputFile = path.join(__dirname, 'articles.json');

try {
  const files = fs.readdirSync(articlesDir);
  let allArticles = [];

  files.forEach(file => {
    // Leemos los archivos HTML directamente para extraer los metadatos.
    // Esto es más robusto que depender de archivos .json separados.
    if (path.extname(file) === '.html') {
      const filePath = path.join(articlesDir, file);
      try {
        const htmlContent = fs.readFileSync(filePath, 'utf8');
        const dom = new JSDOM(htmlContent);
        const scriptElement = dom.window.document.querySelector('script[type="application/ld+json"]');

        if (scriptElement) {
          const metadata = JSON.parse(scriptElement.textContent);
          
          // Añadimos el nombre del archivo al objeto para usarlo en los enlaces.
          // Esto es crucial y asegura que el enlace siempre sea correcto.
          metadata.filename = file;

          // ¡Aquí está la magia! Creamos la propiedad 'url' que necesitas.
          metadata.url = `articulos/${file}`;

          // Intentamos encontrar la categoría en el contenido del artículo.
          // Esto es una mejora para que no dependas de archivos JSON externos.
          // Buscamos un comentario o un elemento específico si lo defines.
          // Por ahora, lo dejamos opcional. Si no está en el JSON, será "Otros".
          if (!metadata.category) {
             // Ejemplo: podrías buscar un h2 con una clase específica.
             // const categoryEl = dom.window.document.querySelector('.category-tag');
             // metadata.category = categoryEl ? categoryEl.textContent : 'Otros';
          }

          allArticles.push(metadata);
        } else {
          console.warn(`Advertencia: El archivo ${file} no contiene metadatos JSON-LD.`);
        }
      } catch (e) {
        console.error(`Error al procesar el archivo HTML: ${file}. Asegúrate de que el JSON incrustado es válido. Detalle:`, e.message);
      }
    }
  });

  // Ordenar artículos por fecha, del más nuevo al más antiguo
  // Se añade un try-catch para evitar que fechas inválidas rompan el script.
  allArticles.sort((a, b) => {
    try {
      return new Date(b.date) - new Date(a.date);
    } catch (e) {
      return 0;
    }
  });

  fs.writeFileSync(outputFile, JSON.stringify(allArticles, null, 2), 'utf8');
  console.log(`Archivo articles.json actualizado con éxito desde los archivos HTML. Total: ${allArticles.length} artículos.`);

} catch (err) {
  if (err.code === 'ENOENT') {
    fs.writeFileSync(outputFile, '[]', 'utf8');
    console.log('Carpeta "articulos" no encontrada. Se creó un articles.json vacío.');
  } else {
    console.error("Error general al construir articles.json:", err);
  }
}
