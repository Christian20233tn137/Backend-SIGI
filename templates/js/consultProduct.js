document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:8080/producto';
    const token = localStorage.getItem('authToken');
    const searchInput = document.getElementById('searchInput');
    let productos = []; // Lista para almacenar todos los productos
    
    // Cargar productos desde la API
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
                    productos = data.result; // Guardar todos los productos
                    renderTable(productos); // Renderizar la tabla con los productos cargados
                } else {
                    alert('Error al cargar los productos.');
                }
            })
            .catch(error => console.error('Error al obtener los productos:', error));
    }

    // Renderizar la tabla con productos
    function renderTable(productosFiltrados) {
        const tableBody = document.querySelector('#productos-table tbody');
        tableBody.innerHTML = ''; // Limpiar la tabla

        productosFiltrados.forEach((producto, index) => {
            const row = document.createElement('tr');

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
    }

    // Filtrar productos basado en el término de búsqueda
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = productos.filter(producto => {
            const nombre = producto.nombre.toLowerCase();
            const categoria = producto.categorias ? producto.categorias.name.toLowerCase() : '';
            const estado = producto.status ? 'activo' : 'inactivo';
            const cantidad = producto.cantidad.toString(); // Convertir cantidad a string para el filtrado
            const precio = producto.precioUnitario.toFixed(2); // Convertir precio a string con 2 decimales

            return (
                nombre.includes(searchTerm) ||
                categoria.includes(searchTerm) ||
                estado.includes(searchTerm) ||
                cantidad.includes(searchTerm) ||
                precio.includes(searchTerm) // Incluir precio en el filtro
            );
        });

        renderTable(filteredProducts);
    }

    // Mostrar modal de edición/agregar producto
    function openEditModal(producto) {
        document.getElementById('productId').value = producto.id || '';
        document.getElementById('productName').value = producto.nombre || '';
        document.getElementById('precioUnitario').value = producto.precioUnitario || '';
        document.getElementById('categoryId').value = producto.categorias ? producto.categorias.id : '';
        document.getElementById('cantidad').value = producto.cantidad || '';
        document.getElementById('productModal').style.display = 'block';
    }

    // Cerrar modal de edición/agregar producto
    function closeEditModal() {
        document.getElementById('productModal').style.display = 'none';
    }

    // Cambiar el estado de un producto
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

    // Guardar un producto
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

    // Eventos para abrir y cerrar el modal
    document.getElementById('addProductButton').addEventListener('click', function () {
        openEditModal({});
    });
    document.getElementById('closeModalButton').addEventListener('click', closeEditModal);
    document.getElementById('closeModalButtonFooter').addEventListener('click', closeEditModal);

    // Evento para filtrar productos en tiempo real
    searchInput.addEventListener('input', filterProducts);

    // Cargar la tabla al inicio
    loadTable();
});
