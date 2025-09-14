const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, 'articulos'); // Cambiado a 'articulos'
const outputFile = path.join(__dirname, 'articles.json');

fs.readdir(articlesDir, (err, files) => {
  if (err) {
    console.error("Error al leer la carpeta de artículos:", err);
    // Si la carpeta no existe o está vacía, crea un archivo JSON vacío
    if (err.code === 'ENOENT') {
      fs.writeFileSync(outputFile, '[]', 'utf8');
      console.log('Carpeta "articulos" no encontrada. Se creó un articles.json vacío.');
      return;
    }
    return;
  }

  const allArticles = [];

  files.forEach(file => {
    if (path.extname(file) === '.json') {
      const filePath = path.join(articlesDir, file);
      const articleContent = fs.readFileSync(filePath, 'utf8');
      try {
        allArticles.push(JSON.parse(articleContent));
      } catch (e) {
        console.error(`Error al parsear el archivo JSON: ${file}`, e);
      }
    }
  });

  fs.writeFileSync(outputFile, JSON.stringify(allArticles, null, 2), 'utf8');
  console.log('Archivo articles.json creado con éxito.');
});
