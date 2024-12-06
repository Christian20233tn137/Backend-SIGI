document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:8080/usuario';

    const token = localStorage.getItem('authToken');
    console.log(token);

    // Función para obtener datos de la API y llenar la tabla
    function loadTable() {
        fetch(API_URL, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.type === "SUCCESS") {
                    const tableBody = document.querySelector('#states-table tbody');
                    tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla
                    data.result.forEach((usuario, index) => {
                        const row = document.createElement('tr');

                        // Columna Nombre
                        const nameCell = document.createElement('td');
                        nameCell.textContent = usuario.name;
                        row.appendChild(nameCell);

                        // Columna Apellidos
                        const lastnameCell = document.createElement('td');
                        lastnameCell.textContent = usuario.lastname;
                        row.appendChild(lastnameCell);

                        // Columna Teléfono
                        const phoneCell = document.createElement('td');
                        phoneCell.textContent = usuario.telephone;
                        row.appendChild(phoneCell);

                        // Columna Correo Electrónico
                        const emailCell = document.createElement('td');
                        emailCell.textContent = usuario.email;
                        row.appendChild(emailCell);

                        // Columna Estado
                        const statusCell = document.createElement('td');
                        statusCell.textContent = usuario.status ? 'Activo' : 'Inactivo';
                        row.appendChild(statusCell);

                        // Columna Acciones
                        const actionsCell = document.createElement('td');

                        // Botón de Editar
                        const editButton = document.createElement('button');
                        editButton.className = 'btn btn-primary btn-sm mr-2';
                        editButton.textContent = 'Editar';
                        editButton.addEventListener('click', function () {
                            openEditModal(usuario);
                        });
                        actionsCell.appendChild(editButton);

                        // Botón de Activar/Desactivar
                        const toggleButton = document.createElement('button');
                        toggleButton.className = `btn btn-sm ${usuario.status ? 'btn-danger' : 'btn-success'}`;
                        toggleButton.textContent = usuario.status ? 'Desactivar' : 'Activar';
                        toggleButton.addEventListener('click', function () {
                            toggleUserStatus(usuario.id, statusCell, toggleButton);
                        });
                        actionsCell.appendChild(toggleButton);

                        row.appendChild(actionsCell);
                        tableBody.appendChild(row);
                    });
                } else {
                    alert('Error al cargar los usuarios.');
                }
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
            });
    }

    // Función para abrir el modal de edición
    function openEditModal(usuario) {
        document.getElementById('usuarioName').value = usuario.name;
        document.getElementById('usuarioLastName').value = usuario.lastname;
        document.getElementById('usuarioPhone').value = usuario.telephone;
        document.getElementById('usuarioEmail').value = usuario.email;
        document.getElementById('usuarioPassword').value = '';
        document.getElementById('usuarioPasswordConfirm').value = '';
        document.getElementById('usuarioModal').style.display = 'block';
    }

    // Función para cerrar el modal
    function closeEditModal() {
        document.getElementById('usuarioModal').style.display = 'none';
    }

    // Función para cambiar el estado de un usuario
    function toggleUserStatus(id, statusCell, toggleButton) {
        fetch(`${API_URL}/cambiar-estado`, {
            method: 'PUT',
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id })
        })
            .then(response => {
                if (response.ok) {
                    const newStatus = toggleButton.textContent === 'Activar';
                    statusCell.textContent = newStatus ? 'Activo' : 'Inactivo';
                    toggleButton.className = `btn btn-sm ${newStatus ? 'btn-danger' : 'btn-success'}`;
                    toggleButton.textContent = newStatus ? 'Desactivar' : 'Activar';
                } else {
                    alert('Error al cambiar el estado del usuario.');
                }
            })
            .catch(error => {
                console.error('Error al cambiar el estado:', error);
            });
    }

    // Guardar cambios (Crear/Editar)
    document.querySelector('.registrar').addEventListener('click', function (event) {
        event.preventDefault();

        const name = document.getElementById('usuarioName').value;
        const lastname = document.getElementById('usuarioLastName').value;
        const telephone = document.getElementById('usuarioPhone').value;
        const email = document.getElementById('usuarioEmail').value;
        const password = document.getElementById('usuarioPassword').value;
        const confirmPassword = document.getElementById('usuarioPasswordConfirm').value;

        if (!name || !lastname || !telephone || !email || !password || password !== confirmPassword) {
            alert('Por favor, complete todos los campos correctamente.');
            return;
        }

        const userData = {
            name,
            lastname,
            telephone,
            email,
            password,
            status: true
        };

        fetch(API_URL, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (response.ok) {
                    alert('Usuario registrado exitosamente.');
                    closeEditModal();
                    loadTable();
                } else {
                    alert('Error al registrar el usuario.');
                }
            })
            .catch(error => {
                console.error('Error al guardar el usuario:', error);
            });
    });

    // Inicializar la tabla al cargar la página
    loadTable();

    // Eventos para cerrar el modal
    document.getElementById('cancelarButton').addEventListener('click', closeEditModal);

    // Abrir modal para nuevo usuario
    document.getElementById('addProduct').addEventListener('click', function () {
        document.getElementById('usuarioName').value = '';
        document.getElementById('usuarioLastName').value = '';
        document.getElementById('usuarioPhone').value = '';
        document.getElementById('usuarioEmail').value = '';
        document.getElementById('usuarioPassword').value = '';
        document.getElementById('usuarioPasswordConfirm').value = '';
        document.getElementById('usuarioModal').style.display = 'block';
    });
});
