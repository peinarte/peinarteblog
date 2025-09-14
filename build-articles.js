const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, 'articulos');
const outputFile = path.join(__dirname, 'articles.json');

fs.readdir(articlesDir, (err, files) => {
  if (err) {
    console.error("Error al leer la carpeta de artículos:", err);
    return;
  }

  const allArticles = [];

  files.forEach(file => {
    if (path.extname(file) === '.json') {
      const filePath = path.join(articlesDir, file);
      const articleContent = fs.readFileSync(filePath, 'utf8');
      allArticles.push(JSON.parse(articleContent));
    }
  });

  fs.writeFileSync(outputFile, JSON.stringify(allArticles, null, 2), 'utf8');
  console.log('Archivo articles.json creado con éxito.');
});
