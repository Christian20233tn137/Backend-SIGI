document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:8080/consultor';
    const token = localStorage.getItem('authToken');
    const searchInput = document.getElementById('searchInput');
    let productos = []; // Lista para almacenar todos los productos

// Función para obtener todos los productos
   function loadTable() {
        fetch(`${API_URL}/all/Productos`, {
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
}

     // Evento para filtrar productos en tiempo real
     searchInput.addEventListener('input', filterProducts);

    // Cargar la tabla al inicio
    loadTable();
});
