const handleFormSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const formName = formData.get('form-name');

    // Determina la URL de redirección. Si es un freebie, añade el parámetro.
    let successUrl = '/gracias.html';
    if (formName && formName.startsWith('freebie-')) {
        const freebieName = formName.replace('freebie-', '');
        successUrl = `/gracias.html?file=${freebieName}`;
    }

    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
    })
    .then(() => {
        // Redirige a la URL de éxito construida
        window.location.href = successUrl;
    })
    .catch((error) => alert(error));
};

// Aplica el manejador a todos los formularios de Netlify en la página
document.addEventListener('DOMContentLoaded', () => {
    const netlifyForms = document.querySelectorAll('form[data-netlify="true"]');
    netlifyForms.forEach(form => form.addEventListener('submit', handleFormSubmit));
});