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
                    tableBody.innerHTML = ''; // Limpiar tabla
                    data.result.forEach(provider => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${provider.name}</td>
                            <td>${provider.rfc}</td>
                            <td>${provider.direccion}</td>
                            <td>${provider.telefono}</td>
                            <td>${provider.email}</td>
                            <td>${provider.status ? 'Activo' : 'Inactivo'}</td>
                            <td>
                                <button class="btn btn-primary btn-sm" data-id="${provider.id}">Editar</button>
                                <button class="btn btn-${provider.status ? 'danger' : 'success'} btn-sm toggle-status" data-id="${provider.id}">
                                    ${provider.status ? 'Desactivar' : 'Activar'}
                                </button>
                            </td>`;
                        tableBody.appendChild(row);
                    });

                    // Agregar eventos a botones
                    document.querySelectorAll('.btn-primary').forEach(button => {
                        button.addEventListener('click', event => openEditModal(event.target.dataset.id));
                    });

                    document.querySelectorAll('.toggle-status').forEach(button => {
                        button.addEventListener('click', event => toggleStatus(event.target.dataset.id));
                    });
                } else {
                    alert('Error al cargar los proveedores.');
                }
            })
            .catch(error => console.error('Error al cargar datos:', error));
    }

    // Abrir modal para editar
    function openEditModal(id) {
        fetch(`${API_URL}/${id}`, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(response => response.json())
            .then(provider => {
                if (provider) {
                    document.getElementById('providerName').value = provider.name || '';
                    document.getElementById('providerPhone').value = provider.telefono || '';
                    document.getElementById('providerRFC').value = provider.rfc || '';
                    document.getElementById('providerEmail').value = provider.email || '';
                    document.getElementById('providerAddress').value = provider.direccion || '';
                    document.getElementById('registerProvider').dataset.id = provider.id;
                    document.getElementById('modal').style.display = 'block';
                }
            })
            .catch(error => console.error('Error al cargar el proveedor:', error));
    }

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

    // Guardar datos del proveedor
    document.getElementById('registerProvider').addEventListener('click', function () {
        const providerId = this.dataset.id || null;
        const providerData = {
            id: providerId,
            name: document.getElementById('providerName').value.trim(),
            telefono: document.getElementById('providerPhone').value.trim(),
            rfc: document.getElementById('providerRFC').value.trim(),
            email: document.getElementById('providerEmail').value.trim(),
            direccion: document.getElementById('providerAddress').value.trim()
        };

        // Validaciones básicas
        if (!providerData.name || providerData.name.length > 50) {
            alert('El nombre es obligatorio y no debe exceder los 50 caracteres.');
            return;
        }
        if (!/^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/.test(providerData.rfc)) {
            alert('El RFC debe ser válido.');
            return;
        }
        if (!/^\d{10}$/.test(providerData.telefono)) {
            alert('El teléfono debe contener 10 dígitos.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(providerData.email) || providerData.email.length > 20) {
            alert('El correo debe ser válido y no exceder 20 caracteres.');
            return;
        }
        if (!providerData.direccion || providerData.direccion.length > 100) {
            alert('La dirección es obligatoria y no debe exceder 100 caracteres.');
            return;
        }

        const method = providerId ? 'PUT' : 'POST';

        fetch(API_URL, {
            method,
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(providerData)
        })
            .then(response => {
                if (response.ok) {
                    alert('Proveedor guardado exitosamente.');
                    document.getElementById('modal').style.display = 'none';
                    loadTable();
                } else {
                    alert('Error al guardar el proveedor.');
                }
            })
            .catch(error => console.error('Error al guardar el proveedor:', error));
    });

    // Inicializar
    loadTable();
});
