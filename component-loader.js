document.addEventListener("DOMContentLoaded", function() {
    // Determina la ruta base correcta para los componentes
    const path = window.location.pathname;
    let base_path = (path === '/' || path.endsWith('/index.html')) ? '.' : '..';

    if (path.includes('/categorias/') || path.includes('/articulos/')) {
        base_path = '..';
    }

    // Cargar el encabezado
    const headerPlaceholder = document.querySelector("header[data-component='header']");
    const mainHeaderPlaceholder = document.querySelector("header[data-component='header-main']");

    if (headerPlaceholder) {
        fetch(`${base_path}/_header.html`)
            .then(response => response.ok ? response.text() : Promise.reject('Header not found'))
            .then(data => headerPlaceholder.innerHTML = data)
            .catch(error => console.error('Error loading header:', error));
    } else if (mainHeaderPlaceholder) {
        fetch(`${base_path}/_header-main.html`)
            .then(response => response.ok ? response.text() : Promise.reject('Main Header not found'))
            .then(data => mainHeaderPlaceholder.innerHTML = data)
            .catch(error => console.error('Error loading main header:', error));
    }

    // Cargar el pie de página
    const footerPlaceholder = document.querySelector("footer[data-component='footer']");
    const mainFooterPlaceholder = document.querySelector("footer[data-component='footer-main']");

    if (footerPlaceholder) {
        fetch(`${base_path}/_footer.html`)
            .then(response => response.ok ? response.text() : Promise.reject('Footer not found'))
            .then(data => footerPlaceholder.innerHTML = data)
            .catch(error => console.error('Error loading footer:', error));
    } else if (mainFooterPlaceholder) {
        fetch(`${base_path}/_footer-main.html`)
            .then(response => response.ok ? response.text() : Promise.reject('Main Footer not found'))
            .then(data => mainFooterPlaceholder.innerHTML = data)
            .catch(error => console.error('Error loading main footer:', error));
    }
});