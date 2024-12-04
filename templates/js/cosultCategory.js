document.addEventListener('DOMContentLoaded', function () {
    // URL base de la API
    const API_URL = 'http://localhost:8080/categorias';


    const token = localStorage.getItem('authToken');
    console.log(token)
    // Función para obtener datos de la API y llenar la tabla
    function loadTable() {
        fetch("http://localhost:8080/categorias/all",{
            method: "GET",
            headers:{
                "Authorization": "Bearer "+token, // Reemplaza <tu-token-aquí> con tu token
                "Content-Type": "application/json", // Opcional, según lo que requiera tu API
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
        // Asignar los valores actuales a los campos del formulario de edición
        document.getElementById('categoryId').value = id;
        document.getElementById('categoryName').value = name;
        document.getElementById('categoryDescription').value = description;
        // Abrir el modal
        document.getElementById('categoryModal').style.display = 'block';
    }


    // Función para cerrar el modal
    function closeEditModal() {
        document.getElementById('categoryModal').style.display = 'none';
    }


    // Función para actualizar el estado de la categoría (Activar/Desactivar)
    function toggleCategoryStatus(id, row, statusCell, toggleButton) {
        const newStatus = toggleButton.textContent === 'Activar' ? true : false;
        const updatedCategory = { status: newStatus };


        fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedCategory)
        })
            .then(response => response.json())
            .then(data => {
                if (data.type === "SUCCESS") {
                    statusCell.textContent = newStatus ? 'Activo' : 'Inactivo';
                    toggleButton.textContent = newStatus ? 'Desactivar' : 'Activar';
                    toggleButton.className = `btn btn-sm ${newStatus ? 'btn-danger' : 'btn-success'}`;
                } else {
                    alert('Error al actualizar el estado de la categoría');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un problema al cambiar el estado de la categoría');
            });
    }




    //Registrar una nueva categoria
    document.getElementById("addCategoryButton").addEventListener("click", () => {
        document.getElementById("categoryModal").style.display = "block";
    });


    //Salir
    document.getElementById("closeModalButton").addEventListener("click", () => {
        document.getElementById("categoryModal").style.display = "none";
    });


    //boton de salir
    document.getElementById("canelarButton").addEventListener("click", () => {
        document.getElementById("categoryModal").style.display = "none";
    });




    //Registrar una nueva categoria
    document.getElementById("registerCategoryButton").addEventListener("click", function (event) {
        // Evitar que el formulario se envíe automáticamente
        event.preventDefault();

        // Obtener los valores de los campos de entrada
        const categoryName = document.getElementById('categoryName').value;
        const categoryDescription = document.getElementById('categoryDescription').value;

        // Validación simple
        if (!categoryName || !categoryDescription) {
            alert('Por favor, complete todos los campos.');
            return; // Si no están completos, no continua con el envío
        }

        // Crear objeto con los datos a enviar
        const categoryData = {
            name: categoryName,
            description: categoryDescription
        };

        // Enviar los datos al servidor con fetch (POST)
        fetch('http://localhost:8080/categorias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData) // Convertir el objeto a JSON
        })
            .then(response => {
                if (response.ok) {
                    // Si la respuesta HTTP fue exitosa (status 200-299)
                    return response.json(); // Parsear el cuerpo de la respuesta como JSON
                } else {
                    throw new Error('Error al registrar la categoría');
                }
            })
            .then(data => {
                // Aquí podemos manejar la respuesta procesada como JSON
                alert('Categoría registrada exitosamente');
                // Cerrar el modal y limpiar los campos
                document.getElementById('categoryModal').style.display = 'none';
                document.getElementById('categoryName').value = '';
                document.getElementById('categoryDescription').value = '';
                loadTable(); // Actualizar la tabla después de agregar la categoría
            })
            .catch(error => {
                // Si hubo un error en la solicitud o en la respuesta
                alert(error.message); // Mostrar mensaje de error
                console.error('Error al registrar la categoría:', error);
            });
    });



    // Inicializar la tabla al cargar la página
    loadTable();
});

