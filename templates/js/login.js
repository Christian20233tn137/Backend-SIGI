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
            // Si las credenciales son correctas y se recibe un token JWT
            const token = await response.text();
            // Guardar el token en el localStorage o sessionStorage
            localStorage.setItem('authToken', token);
            window.location.href = './Menu.html';  // Redirige a la página de menú
        } else {
            // Si las credenciales son incorrectas, se muestra el mensaje de error
            const errorText = await response.text();
            alert(errorText);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Ocurrió un error al procesar el login. Inténtalo nuevamente más tarde.');
    }
});
