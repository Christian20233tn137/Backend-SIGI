// Función para cargar los datos de un usuario al formulario
function loadUserData(userId) {
    fetch(`http://localhost:8080/usuario/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('nombres').value = data.name;
            document.getElementById('apellidos').value = data.lastname;
            document.getElementById('correo').value = data.email;
            document.getElementById('telefono').value = data.telephone;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cargar datos del usuario: ' + error.message);
        });
}


// Función para actualizar los datos de un usuario
function updateUser() {
    // Obtiene los valores del formulario
    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const correo = document.getElementById('correo').value;
    const telefono = document.getElementById('telefono').value;

    // Crea el objeto que será enviado al backend
    const userData = {
        name: nombres,
        lastname: apellidos,
        email: correo,
        telephone: telefono
    };

    // Realiza la solicitud PUT para actualizar los datos
    fetch('http://localhost:8080/usuario', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error al actualizar el usuario');
        }
    })
    .then(data => {
        alert('Usuario actualizado con éxito: ' + JSON.stringify(data));
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al actualizar el usuario: ' + error.message);
    });
}

// Ejemplo: Cargar datos de un usuario con ID 1 al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const userId = 1; // Cambia este valor por el ID dinámico que necesites
    loadUserData(userId);
});
