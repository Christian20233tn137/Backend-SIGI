// Función para recuperar las categorías de la base de datos y mostrarlas en la tabla
function obtenerCategorias() {
    fetch("http://localhost:8080/categorias")
        .then(response => {
            if (!response.ok) throw new Error("Error al obtener las categorías");
            return response.json();
        })
        .then(data => {
            // Limpiar la tabla antes de llenarla
            const tbody = document.querySelector(".provider-table tbody");
            tbody.innerHTML = '';

            // Iteramos sobre los datos y los agregamos a la tabla
            data.forEach(categoria => {
                agregarCategoriaATabla(categoria);
            });
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Ocurrió un error al obtener las categorías.");
        });
}

// Llamar a la función obtenerCategorias al cargar la página
document.addEventListener("DOMContentLoaded", obtenerCategorias);

// Código para el buscador
// Función para filtrar la tabla
function filterTable() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase(); // Obtener el valor del input en minúsculas
    const rows = document.querySelectorAll(".provider-table tbody tr"); // Seleccionar todas las filas del cuerpo de la tabla

    rows.forEach(row => {
        const cells = row.querySelectorAll("td"); // Obtener todas las celdas de la fila
        const rowText = Array.from(cells).map(cell => cell.textContent.toLowerCase()).join(" "); // Concatenar el texto de todas las celdas

        if (rowText.includes(searchInput)) {
            row.style.display = ""; // Mostrar la fila si coincide con la búsqueda
        } else {
            row.style.display = "none"; // Ocultar la fila si no coincide
        }
    });
}

// Asignar el evento al input
document.getElementById("searchInput").addEventListener("input", filterTable);

// Registro de categorías
document.getElementById("addCategoryButton").addEventListener("click", () => {
    document.getElementById("categoryModal").style.display = "block";
});

document.getElementById("closeModalButton").addEventListener("click", () => {
    document.getElementById("categoryModal").style.display = "none";
});

// Registrar categoría
function registrarCategoria() {
    const nombre = document.getElementById("nombreCategoria").value;
    const descripcion = document.getElementById("descripcionCategoria").value;

    const categoria = {
        nombre: nombre,
        descripcion: descripcion,
        estado: true
    };

    fetch("http://localhost:8080/categorias", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(categoria)
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al registrar la categoría");
            return response.json();
        })
        .then(data => {
            alert("¡Categoría registrada con éxito!");
            agregarCategoriaATabla(data);
            document.getElementById("categoryModal").style.display = "none";
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Ocurrió un error al registrar la categoría.");
        });
}

// Agregar la categoría a la tabla
function agregarCategoriaATabla(categoria) {
    const tbody = document.querySelector(".provider-table tbody");

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${categoria.nombre}</td>
        <td>${categoria.descripcion}</td>
        <td>${categoria.estado ? "Activo" : "Inactivo"}</td>
        <td>
            <button class="action-button" onclick="editarCategoria(${categoria.id})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="habilitar" onclick="cambiarEstadoCategoria(${categoria.id}, true, this)">
                <i class="fas fa-check-circle"> Habilitar</i>
            </button>
            <button class="deshabilitar" onclick="cambiarEstadoCategoria(${categoria.id}, false, this)">
                <i class="fas fa-times-circle"> Deshabilitar</i>
            </button>
        </td>
    `;

    tbody.appendChild(row);
}


// Función para cambiar el estado de una categoría (habilitar/deshabilitar)
function cambiarEstadoCategoria(id, habilitar, button) {
    fetch(`http://localhost:8080/categorias/${id}/estado`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ estado: habilitar })
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al cambiar el estado de la categoría");
            const row = button.closest('tr');
            const estadoCell = row.querySelectorAll("td")[2];
            estadoCell.textContent = habilitar ? "Activo" : "Inactivo";

            // Actualizar los botones según el nuevo estado
            button.parentNode.querySelectorAll('button').forEach(btn => btn.style.display = 'none');
            button.style.display = 'inline-block';
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Ocurrió un error al cambiar el estado de la categoría.");
        });
}

// Función para editar una categoría
function editarCategoria(id) {
    // Lógica para abrir el modal de edición y cargar los datos de la categoría
    const categoryRow = document.querySelector(`#category-${id}`);
    const categoryName = categoryRow.querySelector(".category-name").textContent;
    const categoryDesc = categoryRow.querySelector(".category-desc").textContent;

    // Aquí deberías abrir el modal y cargar los valores en los campos
    document.getElementById("editCategoryName").value = categoryName;
    document.getElementById("editCategoryDesc").value = categoryDesc;
    document.getElementById("editCategoryModal").style.display = "block";
}

// Función para cerrar el modal de edición
document.getElementById("closeEditModalButton").addEventListener("click", () => {
    document.getElementById("editCategoryModal").style.display = "none";
//Salir
    document.getElementById("closeModalButton").addEventListener("click", () => {
        document.getElementById("categoryModal").style.display = "none";
    });
});

