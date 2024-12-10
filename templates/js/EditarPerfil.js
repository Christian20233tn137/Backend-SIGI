document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:8080/usuario';
    const token = localStorage.getItem('authToken'); // Obtiene el token desde localStorage
    const userId = localStorage.getItem('userId'); // Obtiene el ID del usuario desde localStorage
    const userRole = localStorage.getItem('userRole');  // Asegúrate de guardar el rol del usuario en localStorage


    console.log('Rol recuperado de localStorage:', userRole); // Verificar el valor del rol

    // Verificar si el usuario tiene el rol adecuado para acceder al menú principal
    if (userRole !== 'ROLE_ADMIN') {  // Solo los usuarios con rol 'ROLE_ADMIN' pueden acceder
        alert('Acceso denegado. No tienes permisos suficientes para ver esta página.');
        window.location.href = 'login.html';  // Redirigir a la página de inicio de sesión
        return;
    }

    // Validar la existencia del token y el ID
    if (!token) {
        alert('No se encontró un token de autenticación. Por favor, inicia sesión.');
        return;
    }

    if (!userId) {
        alert('No se encontró un ID de usuario. Por favor, inicia sesión nuevamente.');
        return;
    }

    // Función para cargar los datos del usuario
    function loadUserData(userId) {
        fetch(`${API_URL}/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Cargar los datos en los campos del formulario
            document.getElementById('nombres').value = data.name || '';
            document.getElementById('apellidos').value = data.lastname || '';
            document.getElementById('correo').value = data.email || '';
            document.getElementById('telefono').value = data.telephone || '';
        })
        .catch(error => {
            console.error('Error al cargar los datos del usuario:', error);
            alert('Error al cargar los datos del usuario: ' + error.message);
        });
    }

    // Función para actualizar los datos del usuario
    function updateUserProfile(userId) {
        const updatedData = {
            id: userId,
            name: document.getElementById('nombres').value,
            lastname: document.getElementById('apellidos').value,
            email: document.getElementById('correo').value,
            telephone: document.getElementById('telefono').value,
        };

        fetch(`${API_URL}/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            alert('Perfil actualizado con éxito.');
        })
        .catch(error => {
            console.error('Error al actualizar el perfil del usuario:', error);
            alert('Error al actualizar el perfil: ' + error.message);
        });
    }

    // Cargar datos del usuario al cargar la página
    loadUserData(userId);

    // Actualizar perfil al hacer clic en el botón de guardar
    document.getElementById('updateBtn').addEventListener('click', function () {
        updateUserProfile(userId);
    });
});
