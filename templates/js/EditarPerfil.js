document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:8080/usuario';
    const token = localStorage.getItem('authToken'); // Obtiene el token desde localStorage
    const userId = localStorage.getItem('userId'); // Obtiene el ID del usuario desde localStorage
    const userRole = localStorage.getItem('userRole'); // Obtiene el rol del usuario desde localStorage

    console.log('Rol recuperado de localStorage:', userRole); // Verificar el valor del rol

    // Verificar si el usuario tiene el rol adecuado para acceder al menú principal
    if (userRole !== 'ROLE_ADMIN') {  // Solo los usuarios con rol 'ROLE_ADMIN' pueden acceder
        alert('Acceso denegado. No tienes permisos suficientes para ver esta página.');
        window.location.href = 'login.html'; // Redirigir a la página de inicio de sesión
        return;
    }

    // Validar la existencia del token y el ID
    if (!token) {
        alert('No se encontró un token de autenticación. Por favor, inicia sesión.');
        window.location.href = 'login.html'; // Redirigir a login si no hay token
        return;
    }

    if (!userId) {
        alert('No se encontró un ID de usuario. Por favor, inicia sesión nuevamente.');
        window.location.href = 'login.html'; // Redirigir a login si no hay ID
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
                if (response.status === 403) {
                    alert('No tienes permisos para realizar esta acción. Verifica tu rol o token.');
                }
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos del usuario cargados:', data);
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
            name: document.getElementById('nombres').value.trim(),
            lastname: document.getElementById('apellidos').value.trim(),
            email: document.getElementById('correo').value.trim(),
            telephone: document.getElementById('telefono').value.trim(),
            password: document.getElementById('password').value.trim() || null, // Agregar password
        };

        // Validar datos antes de enviar la solicitud
        if (!updatedData.name || !updatedData.lastname || !updatedData.email || !updatedData.telephone) {
            alert('Todos los campos excepto la contraseña son obligatorios.');
            return;
        }

        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(updatedData.email)) {
            alert('El correo electrónico no tiene un formato válido.');
            return;
        }

        console.log('Datos enviados al servidor:', JSON.stringify(updatedData, null, 2));

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
                return response.json().then(err => {
                    console.error('Error del servidor:', err);
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Perfil actualizado con éxito:', data);
            alert('Perfil actualizado con éxito.');
        })
        .catch(error => {
            console.error('Error al actualizar el perfil del usuario:', error);
            alert(`Error al actualizar el perfil: ${error.message}`);
        });
    }

    // Cargar datos del usuario al cargar la página
    loadUserData(userId);

    // Actualizar perfil al hacer clic en el botón de guardar
    document.getElementById('updateBtn').addEventListener('click', function () {
        updateUserProfile(userId);
    });
});