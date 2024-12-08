document.querySelector('.login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita la recarga de la página

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            // Obtener el token del backend
            const token = await response.text();

            // Guardar el token en localStorage
            localStorage.setItem('authToken', token);

            // Decodificar el token para obtener el ID del usuario
            const userId = getUserIdFromToken(token);

            // Guardar el ID en localStorage
            localStorage.setItem('userId', userId);

            // Redirigir al menú
            window.location.href = './Menu.html';
        } else {
            // Manejo de errores
            const errorText = await response.text();
            alert(`Error: ${errorText}`);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Ocurrió un error al procesar el login. Inténtalo nuevamente más tarde.');
    }
});

// Función para decodificar el token JWT
function getUserIdFromToken(token) {
    try {
        // Dividir el token en sus partes
        const payload = token.split('.')[1];

        // Decodificar la parte del payload desde Base64
        const decodedPayload = atob(payload);

        // Convertir el payload en un objeto JSON
        const payloadObject = JSON.parse(decodedPayload);

        // Retornar el ID del usuario
        if (payloadObject.id) {
            return payloadObject.id; // Asegúrate de que el backend incluya el `id` como parte del payload
        } else {
            console.error('El ID no está presente en el token JWT.');
            alert('Error al procesar el token de autenticación.');
            return null;
        }
    } catch (error) {
        console.error('Error al decodificar el token JWT:', error);
        alert('Error al procesar el token de autenticación.');
        return null;
    }
}
