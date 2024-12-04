document.addEventListener('DOMContentLoaded', function () {
    // URL base de la API
    const API_URL = 'http://localhost:8080/producto';

    // Función para obtener datos de la API y llenar la tabla
    function loadTable() {
        fetch("http://localhost:8080/categorias/all")
            .then(response => response.json())
            .then(data => {
                if (data.type === "SUCCESS") {
                    const tableBody = document.querySelector('#productos-table tbody');
                    tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla
                    data.result.forEach(producto => {
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
                        const categoriaCell = document.createElement('td');
                        categoriaCell.textContent = producto.categoria;
                        row.appendChild(categoriaCell);

                        // Columna Precio
                        const precioCell = document.createElement('td');
                        precioCell.textContent = producto.precioUnitario;
                        row.appendChild(precioCell);

                        // Columna Proveedor
                        const proveedorCell = document.createElement('td');
                        proveedorCell.textContent = producto.proveedor;
                        row.appendChild(proveedorCell);

                        // Columna Estado
                        const estadoCell = document.createElement('td');
                        estadoCell.textContent = producto.estado ? 'Activo' : 'Inactivo';
                        row.appendChild(estadoCell);

                        // Columna Acciones
                        const actionsCell = document.createElement('td');

                        // Botón de Editar
                        const editButton = document.createElement('button');
                        editButton.className = 'btn btn-primary btn-sm mr-2';
                        editButton.textContent = 'Editar';
                        editButton.addEventListener('click', function () {
                            openEditModal(producto.id, producto.nombre, producto.categoria, producto.precioUnitario);
                        });
                        actionsCell.appendChild(editButton);

                        // Botón de Activar/Desactivar
                        const toggleButton = document.createElement('button');
                        toggleButton.className = `btn btn-sm ${producto.estado ? 'btn-danger' : 'btn-success'}`;
                        toggleButton.textContent = producto.estado ? 'Desactivar' : 'Activar';
                        toggleButton.addEventListener('click', function () {
                            toggleProductStatus(producto.id, row, estadoCell, toggleButton);
                        });
                        actionsCell.appendChild(toggleButton);

                        row.appendChild(actionsCell);
                        tableBody.appendChild(row);
                    });
                } else {
                    alert('Error al cargar los productos.');
                }
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
            });
    }

    // Función para abrir el modal de edición
    function openEditModal(id, nombre, categoria, precio) {
        // Asignar los valores actuales a los campos del formulario de edición
        document.getElementById('productId').value = id;
        document.getElementById('productName').value = nombre;
        document.getElementById('productCategory').value = categoria;
        document.getElementById('productPrice').value = precio;
        showModal(); // Mostrar el modal
    }

    // Mostrar el modal y el fondo
    function showModal() {
        document.querySelector('.modal').style.display = 'block';
    }

    // Ocultar el modal y el fondo
    function closeModal() {
        document.querySelector('.modal').style.display = 'none';
    }

    // Función para actualizar el estado del producto (Activar/Desactivar)
    function toggleProductStatus(id, row, estadoCell, toggleButton) {
        const newStatus = toggleButton.textContent === 'Activar';
        const updatedProduct = { id, estado: newStatus };

        fetch(`${API_URL}/estado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct)
        })
            .then(response => response.json())
            .then(data => {
                if (data.type === "SUCCESS") {
                    estadoCell.textContent = newStatus ? 'Activo' : 'Inactivo';
                    toggleButton.textContent = newStatus ? 'Desactivar' : 'Activar';
                    toggleButton.className = `btn btn-sm ${newStatus ? 'btn-danger' : 'btn-success'}`;
                } else {
                    alert('Error al actualizar el estado del producto');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un problema al cambiar el estado del producto');
            });
    }

    // Registrar un nuevo producto
    document.querySelector('.plus-button').addEventListener('click', showModal);
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', closeModal);
    });
    document.getElementById('registerProductButton').addEventListener('click', function (event) {
        event.preventDefault();

        const productName = document.getElementById('productName').value;
        const productCategory = document.getElementById('productCategory').value;
        const productPrice = document.getElementById('productPrice').value;

        if (!productName || !productCategory || !productPrice) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const productData = {
            nombre: productName,
            categoria: productCategory,
            precioUnitario: productPrice
        };

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        })
            .then(response => response.json())
            .then(data => {
                alert('Producto registrado exitosamente');
                closeModal(); // Cerrar el modal
                document.getElementById('productName').value = '';
                document.getElementById('productCategory').value = '';
                document.getElementById('productPrice').value = '';
                loadTable(); // Actualizar la tabla después de agregar el producto
            })
            .catch(error => {
                alert('Error al registrar el producto');
                console.error('Error:', error);
            });
    });

    // Inicializar la tabla al cargar la página
    loadTable();
});