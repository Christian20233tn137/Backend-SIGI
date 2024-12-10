document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

        const correo = document.getElementById('correo').value; // Obtener el valor del campo de correo

        // Validar que el campo de correo no esté vacío
        if (!correo) {
            alert('Por favor, ingrese un correo electrónico válido.');
            return;
        }

        try {
            // Realizar la solicitud POST al backend
            const response = await fetch('http://localhost:8080/consultor/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: correo }) // Cambiar "correo" a "email" según la estructura esperada
            });

            // Manejar la respuesta del servidor
            if (response.ok) {
                // Guardar el correo en localStorage
                localStorage.setItem('validatedEmail', correo);

                // Redirigir al usuario a la página Code.html si el envío fue exitoso
                window.location.href = 'Code.html';
            } else {
                // Extraer y mostrar el mensaje de error del servidor si la respuesta no es exitosa
                const errorData = await response.json();
                alert(errorData.message || 'Ocurrió un error al enviar el correo.');
            }
        } catch (error) {
            // Manejo de errores en caso de que la solicitud falle por otros motivos
            console.error('Error al procesar la solicitud:', error);
            alert('No se pudo conectar con el servidor. Inténtelo más tarde.');
        }
    });
});
