document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:8080/proveedor';

    const token = localStorage.getItem('authToken');

    // Función para obtener datos de la API y llenar la tabla
    function loadTable() {
        fetch(`${API_URL}/all`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.type === "SUCCESS") {
                    const tableBody = document.querySelector('#providerTable tbody');
                    tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla
                    data.result.forEach((provider, index) => {
                        const row = document.createElement('tr');

                        // Columna #
                        const numberCell = document.createElement('th');
                        numberCell.scope = 'row';
                        numberCell.textContent = index + 1;
                        row.appendChild(numberCell);

                        // Columna Nombre
                        const nameCell = document.createElement('td');
                        nameCell.textContent = provider.name;
                        row.appendChild(nameCell);

                        // Columna RFC
                        const rfcCell = document.createElement('td');
                        rfcCell.textContent = provider.rfc;
                        row.appendChild(rfcCell);

                        // Columna Dirección
                        const addressCell = document.createElement('td');
                        addressCell.textContent = provider.direccion;
                        row.appendChild(addressCell);

                        // Columna Teléfono
                        const phoneCell = document.createElement('td');
                        phoneCell.textContent = provider.telefono;
                        row.appendChild(phoneCell);

                        // Columna Correo Electrónico
                        const emailCell = document.createElement('td');
                        emailCell.textContent = provider.email;
                        row.appendChild(emailCell);

                        // Columna Estado
                        const statusCell = document.createElement('td');
                        statusCell.textContent = provider.status ? 'Activo' : 'Inactivo';
                        row.appendChild(statusCell);

                        // Columna Gestionar
                        const actionsCell = document.createElement('td');

                        // Botón de Editar
                        const editButton = document.createElement('button');
                        editButton.className = 'btn btn-primary btn-sm mr-2';
                        editButton.textContent = 'Editar';
                        editButton.addEventListener('click', function () {
                            openEditModal(provider);
                        });
                        actionsCell.appendChild(editButton);

                        // Botón de Activar/Desactivar
                        const toggleButton = document.createElement('button');
                        toggleButton.className = `btn btn-sm ${provider.status ? 'btn-danger' : 'btn-success'}`;
                        toggleButton.textContent = provider.status ? 'Desactivar' : 'Activar';
                        toggleButton.addEventListener('click', function () {
                            toggleProviderStatus(provider.id, statusCell, toggleButton);
                        });
                        actionsCell.appendChild(toggleButton);

                        row.appendChild(actionsCell);
                        tableBody.appendChild(row);
                    });
                } else {
                    alert('Error al cargar los proveedores.');
                }
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
            });
    }

    


    // Función para abrir el modal de edición
    function openEditModal(provider) {
<<<<<<< HEAD
        document.getElementById('providerId').value = provider.id; // Asignar el ID del proveedor al campo oculto
=======

        document.getElementById('providerId').value = provider.id;
>>>>>>> cf42e82cffdcfc9230973385e195ae300891f059
        document.getElementById('providerName').value = provider.name;
        document.getElementById('providerPhone').value = provider.telefono;
        document.getElementById('providerRFC').value = provider.rfc;
        document.getElementById('providerEmail').value = provider.email;
        document.getElementById('providerAddress').value = provider.direccion;
        document.getElementById('modalProvee').style.display = 'block';
    }

    // Función para cerrar el modal
    function closeEditModal() {
        document.getElementById('modalProvee').style.display = 'none';
    }

    // Función para cambiar el estado de un proveedor
    function toggleProviderStatus(id, statusCell, toggleButton) {
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
                    alert('Error al cambiar el estado del proveedor.');
                }
            })
            .catch(error => {
                console.error('Error al cambiar el estado:', error);
            });
    }

    

    document.getElementById('registerProvider').addEventListener('click', function (event) {
        event.preventDefault();
<<<<<<< HEAD

        const providerId = document.getElementById('providerId').value; // Leer el ID del proveedor
        const providerData = {
            id: providerId || null, // Incluir el ID si está presente
            name: document.getElementById('providerName').value,
            telefono: document.getElementById('providerPhone').value,
            rfc: document.getElementById('providerRFC').value,
            email: document.getElementById('providerEmail').value,
            direccion: document.getElementById('providerAddress').value,
            status: true // Nuevo proveedor activo por defecto
        };

        const method = providerId ? 'PUT' : 'POST'; // Determinar si es una actualización o un nuevo registro
=======
    
        const providerId = document.getElementById('providerId').value;
        const providerName = document.getElementById('providerName').value;
        const providerPhone = document.getElementById('providerPhone').value;
        const providerRFC = document.getElementById('providerRFC').value;
        const providerEmail = document.getElementById('providerEmail').value;
        const providerAddress = document.getElementById('providerAddress').value;
    
        let providerData = {
            name: providerName,
            telefono: providerPhone,
            rfc: providerRFC,
            email: providerEmail,
            direccion: providerAddress,
            status: true // Nuevo proveedor activo por defecto
        };
    
        if (providerId) {
            updateProvider(providerId, providerData); // Llamamos a la función para PUT
        } else {
            createProvider(providerData); // Llamamos a la función para POST
        }
    });
    
    function createProvider(providerData) {
>>>>>>> cf42e82cffdcfc9230973385e195ae300891f059
        fetch(API_URL, {
            method: method,
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(providerData)
        })
<<<<<<< HEAD
            .then(response => {
                if (response.ok) {
                    alert('Proveedor guardado exitosamente.');
                    closeEditModal();
                    loadTable();
                } else {
                    alert('Error al guardar el proveedor.');
                }
            })
            .catch(error => {
                console.error('Error al guardar el proveedor:', error);
            });
    });

=======
        .then(response => {
            if (response.ok) {
                alert('Proveedor registrado exitosamente.');
                closeEditModal();
                loadTable();
            } else {
                alert('Error al registrar el proveedor.');
            }
        })
        .catch(error => {
            console.error('Error al guardar el proveedor:', error);
        });
    }
    
    function updateProvider(providerId, providerData) {
        const endpoint = `${API_URL}/${providerId}`; // Para PUT, agregamos el ID al final de la URL
    
        fetch(endpoint, {
            method: 'PUT',
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(providerData)
        })
        .then(response => {
            if (response.ok) {
                alert('Proveedor actualizado exitosamente.');
                closeEditModal();
                loadTable();
            } else {
                alert('Error al actualizar el proveedor.');
            }
        })
        .catch(error => {
            console.error('Error al actualizar el proveedor:', error);
        });
    }
    
    
>>>>>>> cf42e82cffdcfc9230973385e195ae300891f059
    // Inicializar la tabla al cargar la página
    loadTable();

    // Eventos para cerrar el modal
    document.getElementById('closeModalButton').addEventListener('click', closeEditModal);

    // Abrir modal para nuevo proveedor
    document.getElementById('addProduct').addEventListener('click', function () {
        document.getElementById('providerId').value = ''; // Limpiar el ID para nuevo registro
        document.getElementById('providerName').value = '';
        document.getElementById('providerPhone').value = '';
        document.getElementById('providerRFC').value = '';
        document.getElementById('providerEmail').value = '';
        document.getElementById('providerAddress').value = '';
        document.getElementById('modalProvee').style.display = 'block';
    });
});
