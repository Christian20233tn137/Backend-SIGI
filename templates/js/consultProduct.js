document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:8080/producto';
    const API_URL_CATEGORIAS = 'http://localhost:8080/categorias';
    const API_URL_PROVEEDORES = 'http://localhost:8080/proveedor';
    const token = localStorage.getItem('authToken');
    console.log(token);

    function loadTable() {
        fetch(`${API_URL}/all`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.type === 'SUCCESS') {
                    const tableBody = document.querySelector('#productos-table tbody');
                    tableBody.innerHTML = '';
                    data.result.forEach((producto, index) => {
                        const row = document.createElement('tr');

                        // Columna #
                        const numberCell = document.createElement('th');
                        numberCell.scope = 'row';
                        numberCell.textContent = index + 1;
                        row.appendChild(numberCell);

                        // Columna Nombre
                        const nameCell = document.createElement('td');
                        nameCell.textContent = producto.nombre;
                        row.appendChild(nameCell);

                        // Columna Cantidad
                        const cantidadCell = document.createElement('td');
                        cantidadCell.textContent = producto.cantidad;
                        row.appendChild(cantidadCell);

                        // Columna Categoría
                        const categoryCell = document.createElement('td');
                        categoryCell.textContent = producto.categorias ? producto.categorias.name : 'Sin categoría';
                        row.appendChild(categoryCell);

                        // Columna Precio Unitario
                        const precioCell = document.createElement('td');
                        precioCell.textContent = `$${producto.precioUnitario.toFixed(2)}`;
                        row.appendChild(precioCell);

                        // Columna Estado
                        const statusCell = document.createElement('td');
                        statusCell.textContent = producto.status ? 'Activo' : 'Inactivo';
                        row.appendChild(statusCell);

                        // Columna Gestionar
                        const actionsCell = document.createElement('td');

                        // Botón Editar
                        const editButton = document.createElement('button');
                        editButton.className = 'btn btn-primary btn-sm';
                        editButton.textContent = 'Editar';
                        editButton.addEventListener('click', function () {
                            openEditModal(producto);
                        });
                        actionsCell.appendChild(editButton);

                        // Botón Activar/Desactivar
                        const toggleButton = document.createElement('button');
                        toggleButton.className = `btn btn-sm ${producto.status ? 'btn-danger' : 'btn-success'}`;
                        toggleButton.textContent = producto.status ? 'Desactivar' : 'Activar';
                        toggleButton.addEventListener('click', function () {
                            toggleStatus(producto.id, statusCell, toggleButton);
                        });
                        actionsCell.appendChild(toggleButton);

                        row.appendChild(actionsCell);
                        tableBody.appendChild(row);
                    });
                } else {
                    alert('Error al cargar los productos.');
                }
            })
            .catch(error => console.error('Error al obtener los productos:', error));
    }

    function loadCategories() {
        fetch(`${API_URL_CATEGORIAS}/all`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.type === 'SUCCESS') {
                    const categorySelect = document.getElementById('categoryId');
                    categorySelect.innerHTML = '<option value="">Seleccione una categoría</option>';
                    data.result.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category.id;
                        option.textContent = category.name;
                        categorySelect.appendChild(option);
                    });
                } else {
                    alert('Error al cargar las categorías.');
                }
            })
            .catch(error => console.error('Error al cargar las categorías:', error));
    }

    function openEditModal(producto) {
        document.getElementById('productId').value = producto.id || '';
        document.getElementById('productName').value = producto.nombre || '';
        document.getElementById('precioUnitario').value = producto.precioUnitario || '';
        document.getElementById('categoryId').value = producto.categorias ? producto.categorias.id : '';
        document.getElementById('cantidad').value = producto.cantidad || '';

        loadCategories();

        document.getElementById('productModal').style.display = 'block';
    }

    function closeEditModal() {
        document.getElementById('productModal').style.display = 'none';
    }

    function toggleStatus(productId, statusCell, toggleButton) {
        fetch(`${API_URL}/estado`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: productId }),
        })
            .then(response => {
                if (response.ok) {
                    const isActive = toggleButton.textContent === 'Activar';
                    statusCell.textContent = isActive ? 'Activo' : 'Inactivo';
                    toggleButton.textContent = isActive ? 'Desactivar' : 'Activar';
                    toggleButton.className = `btn btn-sm ${isActive ? 'btn-danger' : 'btn-success'}`;
                } else {
                    alert('Error al cambiar el estado del producto.');
                }
            })
            .catch(error => console.error('Error al cambiar el estado:', error));
    }

    document.getElementById('registerProductButton').addEventListener('click', function () {
        const productId = document.getElementById('productId').value;
        const productName = document.getElementById('productName').value;
        const precioUnitario = document.getElementById('precioUnitario').value;
        const categoryId = document.getElementById('categoryId').value;
        const cantidad = document.getElementById('cantidad').value;

        const producto = {
            id: productId,
            nombre: productName,
            precioUnitario: parseFloat(precioUnitario),
            categorias: { id: categoryId },
            cantidad: parseInt(cantidad, 10),
        };

        const method = productId ? 'PUT' : 'POST';
        fetch(API_URL, {
            method: method,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(producto),
        })
            .then(response => {
                if (response.ok) {
                    closeEditModal();
                    loadTable();
                } else {
                    alert('Error al guardar el producto.');
                }
            })
            .catch(error => console.error('Error al guardar el producto:', error));
    });

    document.getElementById('addProductButton').addEventListener('click', function () {
        openEditModal({});
    });

    document.getElementById('closeModalButton').addEventListener('click', closeEditModal);
    document.getElementById('closeModalButtonFooter').addEventListener('click', closeEditModal);

    loadTable();
});
