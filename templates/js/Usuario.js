document.addEventListener('DOMContentLoaded', function () {
    // URL base de la API
    const API_URL = 'http://localhost:8080/usuario';

    const token = localStorage.getItem('authToken');
    console.log(token)

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

                        // Columna #
                        const numberCell = document.createElement('th');
                        numberCell.scope = 'row';
                        numberCell.textContent = index + 1;
                        row.appendChild(numberCell);

                        // Columna Nombre
                        const nameCell = document.createElement('td');
                        nameCell.textContent = usuario.name; 
                        row.appendChild(nameCell);

                        // Columna Apellidos
                        const lastNameCell = document.createElement('td');
                        lastNameCell.textContent = usuario.lastName; 
                        row.appendChild(lastNameCell);

                        // Columna Teléfono
                        const phoneCell = document.createElement('td');
                        phoneCell.textContent = usuario.phone; 
                        row.appendChild(phoneCell);

                         // Columna Correo
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
                            toggleUserStatus(usuario.id, row, statusCell, toggleButton); 
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


    //Funcion para abrir el modal de edicion
    function openEditModal(usuario){
        document.getElementById('usuarioId').value = usuario.id;
        document.getElementById("usuarioName").value = usuario.name
        document.getElementById("usuarioLastName").value = usuario.lastName
        document.getElementById("usuarioPhone").value = usuario.phone
        document.getElementById("usuarioEmail").value = usuario.email
        document.getElementById("usuarioPassword").value = usuario.password
        document.getElementById("usuarioPasswordConfirm").value = usuario.password2
        document.getElementById('usuarioModel').style.display= 'block';
    }

    function closeModal(){
        document.getElementById('usuarioModal').style.display = 'none';
    }
    
    //Funcion para cambiar el estado de un usuario
    function toggleUserStatus(id, statusCell, toggleButton){
        fetch(`${API_URL}/cambiar-estado`, {
            method: 'PUT',
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id : id})
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

    

    
    //Crear o editar
    document.getElementById('registerButton').addEventListener('click', function(event) {
        event.preventDefault();
    
        const userId = document.getElementById('usuarioId').value;
        const usuarioName = document.getElementById('usuarioName').value;
        const usuarioLastName = document.getElementById('usuarioLastName').value;
        const usuarioPhone = document.getElementById('usuarioPhone').value;
        const usuarioEmail = document.getElementById('usuarioEmail').value;
        const usuarioPassword = document.getElementById('usuarioPassword').value;
    
        let userData = {
            name: usuarioName,
            lastname: usuarioLastName,
            email: usuarioEmail,
            telephone: usuarioPhone,
            password: usuarioPassword,
        };
    
        if (userId) {
            updateUser(userId, userData); // Llamamos a la función para PUT
        } else {
            createUser(userData); // Llamamos a la función para POST
        }
    });
    
    function createUser(userData) {
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
                closeModal();
                loadTable();
            } else {
                alert('Error al registrar el usuario.');
            }
        })
        .catch(error => {
            console.error('Error al guardar el usuario:', error);
        });
    }
    
    function updateUser(userId, userData) {
        const endpoint = `${API_URL}/${userId}`; // Para PUT, agregamos el ID al final de la URL
    
        fetch(endpoint, {
            method: 'PUT',
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (response.ok) {
                alert('Usuario actualizado exitosamente.');
                closeModal();
                loadTable();
            } else {
                alert('Error al actualizar el usuario.');
            }
        })
        .catch(error => {
            console.error('Error al actualizar el usuario:', error);
        });
    }
    
    //Inicializar la tabla al cargar la pagina
    loadTable();

     // Eventos para cerrar el modal
     document.getElementById('closeModalButton').addEventListener('click', closeModal);
     document.getElementById('closemodal').addEventListener('click', closeModal);


     //Abrir el modal para nuevo Usuario
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
