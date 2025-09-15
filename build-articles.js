const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, 'articulos');
const outputFile = path.join(__dirname, 'articles.json');

try {
  // Read all files in the directory synchronously
  const files = fs.readdirSync(articlesDir);
  const allArticles = [];

  files.forEach(file => {
    if (path.extname(file) === '.json') {
      const filePath = path.join(articlesDir, file);
      try {
        const articleContent = fs.readFileSync(filePath, 'utf8');
        allArticles.push(JSON.parse(articleContent));
      } catch (e) {
        console.error(`Error al parsear el archivo JSON: ${file}`, e);
      }
    }
  });

  fs.writeFileSync(outputFile, JSON.stringify(allArticles, null, 2), 'utf8');
  console.log('Archivo articles.json creado con éxito.');

} catch (err) {
  // Catch errors for the whole block
  if (err.code === 'ENOENT') {
    fs.writeFileSync(outputFile, '[]', 'utf8');
    console.log('Carpeta "articulos" no encontrada. Se creó un articles.json vacío.');
  } else {
    console.error("Error al leer la carpeta de artículos:", err);
  }
}
