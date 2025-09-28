const handleFormSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const formName = formData.get('form-name');

    // Extrae el nombre del freebie del nombre del formulario
    // "freebie-guia-peinados" -> "guia-peinados"
    const freebieName = formName.replace('freebie-', '');

    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
    })
    .then(() => {
        // Redirige a la página de gracias con el parámetro del archivo
        window.location.href = `/gracias.html?file=${freebieName}`;
    })
    .catch((error) => alert(error));
};