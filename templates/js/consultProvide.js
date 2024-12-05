document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:8080/proveedor';
    const token = localStorage.getItem('authToken');

    // Función para cargar la tabla
    function loadTable() {
        fetch(`${API_URL}/all`, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.type === "SUCCESS") {
                    const tableBody = document.querySelector('#providerTable tbody');
                    tableBody.innerHTML = ''; // Limpiar tabla antes de llenarla
                    data.result.forEach((provider, index) => {
                        const row = document.createElement('tr');


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

                        // Columna Email
                        const emailCell = document.createElement('td');
                        emailCell.textContent = provider.email;
                        row.appendChild(emailCell);

                        // Columna Estado
                        const statusCell = document.createElement('td');
                        statusCell.textContent = provider.status ? 'Activo' : 'Inactivo';
                        row.appendChild(statusCell);

                        // Columna Acciones
                        const actionsCell = document.createElement('td');

                        // Botón de Editar
                        const editButton = document.createElement('button');
                        editButton.className = 'btn btn-primary btn-sm mr-2';
                        editButton.textContent = 'Editar';
                        editButton.addEventListener('click', function () {
                            openEditModal(
                                provider.id,
                                provider.name,
                                provider.telefono,
                                provider.rfc,
                                provider.email,
                                provider.direccion
                            );
                        });
                        actionsCell.appendChild(editButton);

                        // Botón de Activar/Desactivar
                        const toggleButton = document.createElement('button');
                        toggleButton.className = `btn btn-sm ${provider.status ? 'btn-danger' : 'btn-success'}`;
                        toggleButton.textContent = provider.status ? 'Desactivar' : 'Activar';
                        toggleButton.addEventListener('click', function () {
                            toggleStatus(provider.id, row, statusCell, toggleButton);
                        });
                        actionsCell.appendChild(toggleButton);

                        row.appendChild(actionsCell);
                        tableBody.appendChild(row);
                    });
                } else {
                    alert('Error al cargar los proveedores.');
                }
            })
            .catch(error => console.error('Error al cargar datos:', error));
    }

    // Abrir modal para editar proveedor
    function openEditModal(id, name, phone, rfc, email, direction) {
        document.getElementById('providerName').value = name;
        document.getElementById('providerPhone').value = phone;
        document.getElementById('providerRFC').value = rfc;
        document.getElementById('providerEmail').value = email;
        document.getElementById('providerAddress').value = direction;
        document.getElementById('registerProvider').dataset.id = id;
        document.getElementById('modalProvee').style.display = 'block';
    }

    //Funcion para cerrar el modal
    function closeEditModal(){
        document.getElementById('modalProvee').style.display = 'none';
    }

    // Cerrar modal
    document.getElementById('closeModalButton').addEventListener("click", () => {
        document.getElementById('modalProvee').style.display = 'none';
    });

    document.getElementById('closeModal').addEventListener("click", () => {
        document.getElementById('modalProvee').style.display = 'none';
    });


     // Cambiar estado del proveedor
     function toggleStatus(id) {
        fetch(`${API_URL}/cambiar-estado`, {
            method: 'PUT',
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
        })
            .then(response => {
                if (response.ok) {
                    alert('Estado cambiado exitosamente.');
                    loadTable();
                } else {
                    alert('Error al cambiar el estado.');
                }
            })
            .catch(error => console.error('Error al cambiar el estado:', error));
    }

        //Guardar cambios
        document.getElementById('registerProvider').addEventListener('click', function(event){
            event.preventDefault();

            const providerId = document.getElementById('registerProvider').dataset.id;
            const providerName = document.getElementById('providerName').value;
            const providerPhone = document.getElementById('providerPhone').value;
            const providerRFC = document.getElementById('providerRFC').value;
            const providerEmail = document.getElementById('providerEmail').value;
            const providerDirection = document.getElementById('providerAddress').value;

            if (!providerName || !providerPhone || !providerRFC || !providerEmail || !providerDirection) {
                alert('Por favor, complete todos los campos');
                return;
            }

            const providerData = {
                name : providerName,
                rfc : providerRFC,
                direccion : providerDirection,
                telefono : providerPhone,
                email : providerEmail,        
            };

            const method = providerId ? 'PUT' : 'POST';
            const endpoint = providerId ? `${API_URL}` : `${API_URL}`;

            fetch(endpoint,{
                method: method,
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(providerData)
            })
                .then(response =>{
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Error al guardar los datos');
                    }
                })
                .then(()=>{
                    alert('Proveedor guardado exitosamente.');
                    closeEditModal();
                    loadTable();
                })
                .catch(error => {
                    alert('Error al guardar los datos ' + error.message)
                })

        })


    // Inicializar la tabla
    loadTable();
});
