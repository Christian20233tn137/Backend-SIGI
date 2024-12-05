document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const productosTable = document.getElementById("productos-table").getElementsByTagName('tbody')[0];
    const productModal = document.getElementById("productModal");
    const closeModalButton = document.getElementById("closeModalButton");
    const registerProductButton = document.getElementById("registerProductButton");
    const addProductButton = document.getElementById("addProductButton");

    // Variables para los formularios
    const productIdInput = document.getElementById("productId");
    const productNameInput = document.getElementById("productName");
    const cantidadInput = document.getElementById("cantidad");
    const precioUnitarioInput = document.getElementById("precioUnitario");
    const categoryIdInput = document.getElementById("categoryId");
    const proveedorInput = document.getElementById("proveedor");

    // Función para obtener y cargar categorías
    function loadCategories() {
        fetch('http://localhost:8080/categorias')
            .then(response => response.json())
            .then(data => {
                categoryIdInput.innerHTML = data.map(cat => `<option value="${cat.id}">${cat.nombre}</option>`).join('');
            })
            .catch(error => console.error("Error al cargar categorías:", error));
    }

    // Función para obtener y cargar proveedores
    function loadProveedores() {
        fetch('http://localhost:8080/proveedor')
            .then(response => response.json())
            .then(data => {
                proveedorInput.innerHTML = data.map(prov => `<option value="${prov.id}">${prov.nombre}</option>`).join('');
            })
            .catch(error => console.error("Error al cargar proveedores:", error));
    }

    // Función para cargar productos en la tabla
    function loadProducts(searchTerm = '') {
        fetch(`http://localhost:8080/productos?search=${searchTerm}`)
            .then(response => response.json())
            .then(data => {
                productosTable.innerHTML = data.map(product => `
                    <tr>
                        <td>${product.nombre}</td>
                        <td>${product.cantidad}</td>
                        <td>${product.categoria.nombre}</td>
                        <td>${product.precioUnitario}</td>
                        <td>${product.proveedor.nombre}</td>
                        <td>${product.status ? 'Activo' : 'Inactivo'}</td>
                        <td>
                            <button onclick="editProduct(${product.id})">Editar</button>
                            <button onclick="toggleStatus(${product.id}, ${product.status})">Cambiar Estado</button>
                        </td>
                    </tr>
                `).join('');
            })
            .catch(error => console.error("Error al cargar productos:", error));
    }

    // Función para editar un producto
    function editProduct(productId) {
        fetch(`http://localhost:8080/productos/${productId}`)
            .then(response => response.json())
            .then(product => {
                productIdInput.value = product.id;
                productNameInput.value = product.nombre;
                cantidadInput.value = product.cantidad;
                precioUnitarioInput.value = product.precioUnitario;
                categoryIdInput.value = product.categoria.id;
                proveedorInput.value = product.proveedor.id;
                productModal.style.display = 'block';
            })
            .catch(error => console.error("Error al obtener el producto:", error));
    }

    // Función para cambiar el estado de un producto
    function toggleStatus(productId, currentStatus) {
        const newStatus = !currentStatus;
        fetch(`http://localhost:8080/productos/${productId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        })
            .then(response => response.json())
            .then(() => loadProducts())
            .catch(error => console.error("Error al cambiar el estado del producto:", error));
    }

    // Función para registrar o modificar un producto
    registerProductButton.addEventListener("click", function (e) {
        e.preventDefault();
        
        const productData = {
            id: productIdInput.value ? parseInt(productIdInput.value) : null,
            nombre: productNameInput.value,
            cantidad: parseInt(cantidadInput.value),
            precioUnitario: parseFloat(precioUnitarioInput.value),
            status: true, // Por defecto, siempre se registra como activo
            categoria: { id: parseInt(categoryIdInput.value) },
            proveedor: { id: parseInt(proveedorInput.value) }
        };

        const method = productIdInput.value ? 'PUT' : 'POST';
        const url = productIdInput.value ? `http://localhost:8080/productos/${productIdInput.value}` : 'http://localhost:8080/productos';
        
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        })
            .then(response => response.json())
            .then(() => {
                loadProducts();
                productModal.style.display = 'none';
            })
            .catch(error => console.error("Error al registrar/modificar producto:", error));
    });

    // Cerrar modal
    closeModalButton.addEventListener("click", function () {
        productModal.style.display = 'none';
    });

    // Cargar datos iniciales
    loadCategories();
    loadProveedores();
    loadProducts();

    // Filtrar productos al escribir en la barra de búsqueda
    searchInput.addEventListener("input", function () {
        loadProducts(searchInput.value);
    });

    // Abrir modal para agregar un nuevo producto
    addProductButton.addEventListener("click", function () {
        productModal.style.display = 'block';
        productIdInput.value = '';
        productNameInput.value = '';
        cantidadInput.value = '';
        precioUnitarioInput.value = '';
        categoryIdInput.value = '';
        proveedorInput.value = '';
    });
});
