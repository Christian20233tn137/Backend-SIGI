document.addEventListener('DOMContentLoaded', function () {
    // URL base de la API para los proveedores
    const API_URL = 'http://localhost:8080/proveedor'; // Asegúrate de actualizar la URL correcta de la API
    
    // Función para obtener datos de la API y llenar la tabla
    function loadTable() {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                if (data.type === "SUCCESS") {
                    const tableBody = document.querySelector('#providerTable tbody');
                    tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla
                    data.result.forEach((provider, index) => {
                        const row = document.createElement('tr');

                    
                        // Columna Nombre
                        const nameCell = document.createElement('td');
                        nameCell.textContent = provider.nombre;
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

                        // Columna Correo
                        const emailCell = document.createElement('td');
                        emailCell.textContent = provider.correo;
                        row.appendChild(emailCell);

                        // Columna Estado
                        const statusCell = document.createElement('td');
                        statusCell.textContent = provider.estado ? 'Activo' : 'Inactivo';
                        row.appendChild(statusCell);

                        // Columna Acciones
                        const actionsCell = document.createElement('td');

                        // Botón de Editar
                        const editButton = document.createElement('button');
                        editButton.className = 'btn btn-primary btn-sm mr-2';
                        editButton.textContent = 'Editar';
                        editButton.addEventListener('click', function () {
                            openEditModal(provider.id, provider.nombre, provider.rfc, provider.direccion, provider.telefono, provider.correo);
                        });
                        actionsCell.appendChild(editButton);

                        // Botón de Activar/Desactivar
                        const toggleButton = document.createElement('button');
                        toggleButton.className = `btn btn-sm ${provider.estado ? 'btn-danger' : 'btn-success'}`;
                        toggleButton.textContent = provider.estado ? 'Desactivar' : 'Activar';
                        toggleButton.addEventListener('click', function () {
                            toggleProviderStatus(provider.id, row, statusCell, toggleButton);
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
    function openEditModal(nombre, telefono, rfc, correo, direccion) {
        // Asignar los valores actuales a los campos del formulario de edición
        document.getElementById('providerName').value = nombre;
        document.getElementById('providerRFC').value = rfc;
        document.getElementById('providerAddress').value = direccion;
        document.getElementById('providerPhone').value = telefono;
        document.getElementById('providerEmail').value = correo;
        // Abrir el modal
        document.getElementById('modal').style.display = 'block';
    }

    // Función para cerrar el modal
    function closeEditModal() {
        document.getElementById('modal').style.display = 'none';
    }

    // Función para actualizar el estado del proveedor (Activar/Desactivar)
    function toggleProviderStatus(id, row, statusCell, toggleButton) {
        const newStatus = toggleButton.textContent === 'Activar' ? true : false;
        const updatedProvider = { estado: newStatus };

        fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProvider)
        })
        .then(response => response.json())
        .then(data => {
            if (data.type === "SUCCESS") {
                statusCell.textContent = newStatus ? 'Activo' : 'Inactivo';
                toggleButton.textContent = newStatus ? 'Desactivar' : 'Activar';
                toggleButton.className = `btn btn-sm ${newStatus ? 'btn-danger' : 'btn-success'}`;
            } else {
                alert('Error al actualizar el estado del proveedor');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al cambiar el estado del proveedor');
        });
    }

  

    // Registrar un nuevo proveedor
    document.getElementById("addProduct").addEventListener("click", () => {
        document.getElementById("modal").style.display = "block";
    });

    document.getElementById("closeModalButton").addEventListener("click", () => {
        document.getElementById("modal").style.display = "none";
    });

    // Salir del modal
    document.getElementById("closeModal").addEventListener("click", () => {
        document.getElementById("modal").style.display = "none";
    });

    // Registrar un nuevo proveedor
    document.getElementById("registerProvider").addEventListener("click", function (event) {
        // Evitar que el formulario se envíe automáticamente
        event.preventDefault();
    
        // Obtener los valores de los campos de entrada
        const providerName = document.getElementById('providerName').value;
        const providerRFC = document.getElementById('providerRFC').value;
        const providerAddress = document.getElementById('providerAddress').value;
        const providerPhone = document.getElementById('providerPhone').value;
        const providerEmail = document.getElementById('providerEmail').value;
    
        // Validación simple
        if (!providerName || !providerRFC || !providerPhone || !providerEmail) {
            alert('Por favor, complete todos los campos.');
            return; // Si no están completos, no continua con el envío
        }
    
        // Crear objeto con los datos a enviar
        const providerData = {
            nombre: providerName,
            rfc: providerRFC,
            direccion: providerAddress,
            telefono: providerPhone,
            correo: providerEmail
        };
    
        // Enviar los datos al servidor con fetch (POST)
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(providerData) // Convertir el objeto a JSON
        })
        .then(response => {
            if (response.ok) {
                return response.json(); // Parsear el cuerpo de la respuesta como JSON
            } else {
                throw new Error('Error al registrar el proveedor');
            }
        })
        .then(data => {
            alert('Proveedor registrado exitosamente');
            document.getElementById('providerModal').style.display = 'none';
            loadTable(); // Actualizar la tabla después de agregar el proveedor
        })
        .catch(error => {
            alert(error.message); // Mostrar mensaje de error
            console.error('Error al registrar el proveedor:', error);
        });
    });

    // Inicializar la tabla al cargar la página
    loadTable();

    
});
