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

            // Decodificar el token para obtener el ID y el rol del usuario
            const { userId, role } = getUserIdAndRoleFromToken(token);

            // Guardar el ID y el rol en localStorage
            localStorage.setItem('userId', userId);
            localStorage.setItem('userRole', role);

            // Redirigir según el rol
            redirectUserByRole(role);
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

// Función para redirigir según el rol del usuario
function redirectUserByRole(role) {
    if (role === "ROLE_ADMIN") {
        window.location.href = './Menu.html';
    } else if (role === "ROLE_CONSULTOR") {
        window.location.href = './ConsultarUsuariosProductos.html';
    } else {
        alert('Rol no reconocido');
    }
}

// Función para decodificar el token JWT y obtener el ID y el rol
function getUserIdAndRoleFromToken(token) {
    try {
        // Dividir el token en sus partes
        const payload = token.split('.')[1];

        // Decodificar la parte del payload desde Base64
        const decodedPayload = atob(payload);

        // Convertir el payload en un objeto JSON
        const payloadObject = JSON.parse(decodedPayload);

        // Retornar el ID y el rol del usuario
        if (payloadObject.id && payloadObject.role) {
            return { userId: payloadObject.id, role: payloadObject.role }; 
        } else {
            console.error('El ID o el rol no están presentes en el token JWT.');
            alert('Error al procesar el token de autenticación.');
            return null;
        }
    } catch (error) {
        console.error('Error al decodificar el token JWT:', error);
        alert('Error al procesar el token de autenticación.');
        return null;
    }
}
