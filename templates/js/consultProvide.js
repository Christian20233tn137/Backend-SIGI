document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:8080/proveedor';
    const token = localStorage.getItem('authToken');    
    const userRole = localStorage.getItem('userRole');  // Asegúrate de guardar el rol del usuario en localStorage
    const modal = document.getElementById('modalProvee');
    modal.style.display = 'none';
    console.log('Rol recuperado de localStorage:', userRole); // Verificar el valor del rol

    // Referencia al input de búsqueda
    const searchInput = document.getElementById('searchInput');

    // Verificar si el usuario tiene el rol adecuado para acceder al menú principal
    if (userRole !== 'ROLE_ADMIN') {  // Solo los usuarios con rol 'ROLE_ADMIN' pueden acceder
        alert('Acceso denegado. No tienes permisos suficientes para ver esta página.');
        window.location.href = 'login.html';  // Redirigir a la página de inicio de sesión
        return;
    }

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
                    renderTable(data.result);
                } else {
                    alert('Error al cargar los proveedores.');
                }
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
            });
    }

    // Función para renderizar la tabla
    function renderTable(providers) {
        const tableBody = document.querySelector('#providerTable tbody');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla
        providers.forEach((provider, index) => {
            const row = document.createElement('tr');

            const numberCell = document.createElement('th');
            numberCell.scope = 'row';
            numberCell.textContent = index + 1;
            row.appendChild(numberCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = provider.name;
            row.appendChild(nameCell);

            const rfcCell = document.createElement('td');
            rfcCell.textContent = provider.rfc;
            row.appendChild(rfcCell);

            const addressCell = document.createElement('td');
            addressCell.textContent = provider.direccion;
            row.appendChild(addressCell);

            const phoneCell = document.createElement('td');
            phoneCell.textContent = provider.telefono;
            row.appendChild(phoneCell);

            const emailCell = document.createElement('td');
            emailCell.textContent = provider.email;
            row.appendChild(emailCell);

            const statusCell = document.createElement('td');
            statusCell.textContent = provider.status ? 'Activo' : 'Inactivo';
            row.appendChild(statusCell);

            const actionsCell = document.createElement('td');

            const editButton = document.createElement('button');
            editButton.className = 'btn btn-primary btn-sm mr-2';
            editButton.textContent = 'Editar';
            editButton.addEventListener('click', function () {
                openEditModal(provider);
            });
            actionsCell.appendChild(editButton);

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
    }

    // Función de búsqueda
    function searchTable() {
        const searchValue = searchInput.value.toLowerCase();
        const rows = document.querySelectorAll('#providerTable tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const matches = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(searchValue));
            row.style.display = matches ? '' : 'none';
        });
    }

    // Evento de búsqueda
    searchInput.addEventListener('input', searchTable);

    // Función para abrir el modal de edición
    function openEditModal(provider) {
        document.getElementById('providerId').value = provider.id;
        document.getElementById('providerName').value = provider.name;
        document.getElementById('providerPhone').value = provider.telefono;
        document.getElementById('providerRFC').value = provider.rfc;
        document.getElementById('providerEmail').value = provider.email;
        document.getElementById('providerAddress').value = provider.direccion;
        modal.style.display = 'block';
    }

    // Función para cerrar el modal
    function closeEditModal() {
        modal.style.display = 'none';
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

    // Evento para registrar o actualizar un proveedor
    document.getElementById('registerProvider').addEventListener('click', function (event) {
        event.preventDefault();

        const providerId = document.getElementById('providerId').value;
        const providerData = {
            name: document.getElementById('providerName').value,
            telefono: document.getElementById('providerPhone').value,
            rfc: document.getElementById('providerRFC').value,
            email: document.getElementById('providerEmail').value,
            direccion: document.getElementById('providerAddress').value,
            status: true // Nuevo proveedor activo por defecto
        };

        if (!providerData.name || !providerData.telefono || !providerData.rfc || !providerData.email || !providerData.direccion) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const method = providerId ? 'PUT' : 'POST';
        const url = providerId ? `${API_URL}/${providerId}` : API_URL;

        fetch(url, {
            method,
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(providerData)
        })
            .then(response => {
                if (response.ok) {
                    alert(providerId ? 'Proveedor actualizado exitosamente.' : 'Proveedor registrado exitosamente.');
                    closeEditModal();
                    loadTable();
                } else {
                    throw new Error('Error al guardar el proveedor.');
                }
            })
            .catch(error => {
                console.error('Error al guardar el proveedor:', error);
                alert('Error al guardar los datos: ' + error.message);
            });
    });

    // Inicializar la tabla al cargar la página
    loadTable();

    // Eventos para cerrar el modal
    document.getElementById('closeModalButton').addEventListener('click', closeEditModal);
    document.getElementById('closeModal').addEventListener('click', closeEditModal);

    // Abrir modal para nuevo proveedor
    document.getElementById('addProduct').addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('providerId').value = '';
        document.getElementById('providerName').value = '';
        document.getElementById('providerPhone').value = '';
        document.getElementById('providerRFC').value = '';
        document.getElementById('providerEmail').value = '';
        document.getElementById('providerAddress').value = '';
        modal.style.display = 'block';
    });
});
