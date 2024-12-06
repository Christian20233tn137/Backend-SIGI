document.addEventListener('DOMContentLoaded', function () {
    // URL base de la API
    const API_URL = 'http://localhost:8080/categorias';

    const token = localStorage.getItem('authToken');
    console.log(token);

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
                    const tableBody = document.querySelector('#states-table tbody');
                    tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla
                    data.result.forEach((category, index) => {
                        const row = document.createElement('tr');

                        // Columna #
                        const numberCell = document.createElement('th');
                        numberCell.scope = 'row';
                        numberCell.textContent = index + 1;
                        row.appendChild(numberCell);

                        // Columna Nombre
                        const nameCell = document.createElement('td');
                        nameCell.textContent = category.name;
                        row.appendChild(nameCell);

                        // Columna Descripción
                        const descriptionCell = document.createElement('td');
                        descriptionCell.textContent = category.description;
                        row.appendChild(descriptionCell);

                        // Columna Estado
                        const statusCell = document.createElement('td');
                        statusCell.textContent = category.status ? 'Activo' : 'Inactivo';
                        row.appendChild(statusCell);

                        // Columna Acciones
                        const actionsCell = document.createElement('td');

                        // Botón de Editar
                        const editButton = document.createElement('button');
                        editButton.className = 'btn btn-primary btn-sm mr-2';
                        editButton.textContent = 'Editar';
                        editButton.addEventListener('click', function () {
                            openEditModal(category.id, category.name, category.description);
                        });
                        actionsCell.appendChild(editButton);

                        // Botón de Activar/Desactivar
                        const toggleButton = document.createElement('button');
                        toggleButton.className = `btn btn-sm ${category.status ? 'btn-danger' : 'btn-success'}`;
                        toggleButton.textContent = category.status ? 'Desactivar' : 'Activar';
                        toggleButton.addEventListener('click', function () {
                            toggleCategoryStatus(category.id, row, statusCell, toggleButton);
                        });
                        actionsCell.appendChild(toggleButton);

                        row.appendChild(actionsCell);
                        tableBody.appendChild(row);
                    });
                } else {
                    alert('Error al cargar las categorías.');
                }
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
            });
    }

    // Función para abrir el modal de edición
    function openEditModal(id, name, description) {
        document.getElementById('categoryId').value = id; // Cargar el ID en el formulario
        document.getElementById('categoryName').value = name; // Cargar el nombre actual
        document.getElementById('categoryDescription').value = description; // Cargar la descripción actual
        document.getElementById('categoryModal').style.display = 'block'; // Mostrar el modal
    }

    // Función para cerrar el modal
    function closeEditModal() {
        document.getElementById('categoryModal').style.display = 'none';
    }

    // Función para actualizar el estado de la categoría (Activar/Desactivar)
    function toggleCategoryStatus(id, row, statusCell, toggleButton) {
        const newStatus = toggleButton.textContent === 'Activar' ? true : false;

        fetch(`${API_URL}/cambiar-estado`, {
            method: 'PUT',
            headers: {
                "Authorization": "Bearer " + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
            .then(response => {
                if (response.ok) {
                    statusCell.textContent = newStatus ? 'Activo' : 'Inactivo';
                    toggleButton.className = `btn btn-sm ${newStatus ? 'btn-danger' : 'btn-success'}`;
                    toggleButton.textContent = newStatus ? 'Desactivar' : 'Activar';
                } else {
                    alert('Error al cambiar el estado de la categoría.');
                }
            })
            .catch(error => {
                console.error('Error al cambiar el estado:', error);
                alert('Hubo un problema al cambiar el estado de la categoría.');
            });
    }

    document.getElementById('registerCategoryButton').addEventListener('click', function (event) {
        event.preventDefault();
    
        const categoryId = document.getElementById('categoryId').value;
        const categoryName = document.getElementById('categoryName').value;
        const categoryDescription = document.getElementById('categoryDescription').value;
    
        if (!categoryName || !categoryDescription) {
            alert('Por favor, complete todos los campos.');
            return;
        }
    
        const categoryData = {
            name: categoryName,
            description: categoryDescription
        };
    
        // Si hay un ID, se usa PUT, de lo contrario POST
        if (categoryId) {
            // PUT para actualizar
            fetch(`${API_URL}/${categoryId}`, {
                method: 'PUT',
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(categoryData)
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Error al actualizar la categoría.');
                    }
                })
                .then(() => {
                    alert('Categoría actualizada exitosamente.');
                    closeEditModal();
                    loadTable();
                })
                .catch(error => {
                    alert('Error al actualizar los datos: ' + error.message);
                });
        } else {
            // POST para crear
            fetch(API_URL, {
                method: 'POST',
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(categoryData)
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Error al crear la categoría.');
                    }
                })
                .then(() => {
                    alert('Categoría creada exitosamente.');
                    closeEditModal();
                    loadTable();
                })
                .catch(error => {
                    alert('Error al crear los datos: ' + error.message);
                });
        }
    });
    
    // Inicializar la tabla al cargar la página
    loadTable();

    // Eventos para cerrar el modal
    document.getElementById('closeModalButton').addEventListener('click', closeEditModal);
    document.getElementById('canelarButton').addEventListener('click', closeEditModal);

    // Abrir modal para nueva categoría
    document.getElementById('addCategoryButton').addEventListener('click', function () {
        document.getElementById('categoryId').value = ''; // Limpiar ID para nuevo registro
        document.getElementById('categoryName').value = '';
        document.getElementById('categoryDescription').value = '';
        document.getElementById('categoryModal').style.display = 'block';
    });
});
