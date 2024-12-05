document.addEventListener('DOMContentLoaded', function () {
    // URL base de la API
    const API_URL = 'http://localhost:8080/usuario';

    const token = localStorage.getItem('authToken');
    console.log(token)

    // Función para obtener datos de la API y llenar la tabla
    function loadTable() {
        fetch(API_URL, {
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
                    data.result.forEach((usuario, index) => {
                        const row = document.createElement('tr');

                        // Columna Nombre
                        const nameCell = document.createElement('td');
                        nameCell.textContent = usuario.name; 
                        row.appendChild(nameCell);

                        // Columna Apellidos
                        const lastNameCell = document.createElement('td');
                        lastNameCell.textContent = usuario.lastName; 
                        row.appendChild(lastNameCell);

                        // Columna Teléfono
                        const phoneCell = document.createElement('td');
                        phoneCell.textContent = usuario.phone; 
                        row.appendChild(phoneCell);

                         // Columna Correo
                         const emailCell = document.createElement('td');
                         emailCell.textContent = usuario.email; 
                         row.appendChild(emailCell);

                        // Columna Estado
                        const statusCell = document.createElement('td');
                        statusCell.textContent = usuario.status ? 'Activo' : 'Inactivo'; 
                        row.appendChild(statusCell);

                        // Columna Acciones
                        const actionsCell = document.createElement('td');

                        // Botón de Editar
                        const editButton = document.createElement('button');
                        editButton.className = 'btn btn-primary btn-sm mr-2';
                        editButton.textContent = 'Editar';
                        editButton.addEventListener('click', function () {
                            openEditModal(usuario.id, usuario.name, usuario.lastName, usuario.phone, usuario.email); 
                        });
                        actionsCell.appendChild(editButton);

                        // Botón de Activar/Desactivar
                        const toggleButton = document.createElement('button');
                        toggleButton.className = `btn btn-sm ${usuario.status ? 'btn-danger' : 'btn-success'}`; 
                        toggleButton.textContent = usuario.status ? 'Desactivar' : 'Activar'; 
                        toggleButton.addEventListener('click', function () {
                            toggleCategoryStatus(usuario.id, row, statusCell, toggleButton); 
                        });
                        actionsCell.appendChild(toggleButton);

                        row.appendChild(actionsCell);
                        tableBody.appendChild(row);
                    });
                } else {
                    alert('Error al cargar los usuarios.');
                }
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
            });
    }


    //Abrir modal de edicion
    function openEditModal(name,lastName, phone, email, password, password2){
        document.getElementById("usuarioName").value = name
        document.getElementById("usuarioLastName").value = lastName
        document.getElementById("usuarioPhone").value = phone
        document.getElementById("usuarioEmail").value = email
        document.getElementById("usuarioPassword").value = password
        document.getElementById("usuarioPasswordConfirme").value = password2
        document.getElementById('usuarioModel').style.display= 'block';
    }
    

    //Abrir modal para nueva categoria 
    document.getElementById('addProduct').addEventListener('click', function () {
        document.getElementById('usuarioName').value = ''; // Limpiar ID para nuevo registro
        document.getElementById('usuarioLastName').value = '';
        document.getElementById('usuarioPhone').value = '';
        document.getElementById('usuarioEmail').value = '';
        document.getElementById('usuarioPassword').value = '';
        document.getElementById('usuarioPasswordConfirm').value = '';
        document.getElementById('usuarioModal').style.display = 'block';
    });


    
    //Registrar una nueva categoria
    document.getElementById("registerCategoryButton").addEventListener("click", function (event) {
        // Evitar que el formulario se envíe automáticamente
        event.preventDefault();

        // Obtener los valores de los campos de entrada
        const usuarioName = document.getElementById('usuarioName').value;
        const usuarioLastName = document.getElementById('usuarioLastName').value;
        const usuarioPhone = document.getElementById('usuarioPhone').value;
        const usuarioEmail = document.getElementById('usuarioEmail').value;
        const usuarioPassword = document.getElementById('usuarioPassword').value;
        const usuarioPasswordConfirm = document.getElementById('usuarioPasswordConfirm').value;

        // Validación simple
        if (!usuarioName || !usuarioLastName || usuarioPhone || usuarioEmail || usuarioPassword || usuarioPasswordConfirm) {
            alert('Por favor, complete todos los campos.');
            return; // Si no están completos, no continua con el envío
        }

        // Crear objeto con los datos a enviar
        const usuarioData = {
            name: usuarioName,
            lastName: usuarioLastName,
            email: usuarioEmail,
            telephone: usuarioPhone,
            password: usuarioPassword
        };


        // Enviar los datos al servidor con fetch (POST)
        fetch('http://localhost:8080/usuario', {
            method: 'POST',
            headers: {
                "Authorization": "Bearer "+token, 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioData) // Convertir el objeto a JSON
        })
            .then(response => {
                if (response.ok) {
                    // Si la respuesta HTTP fue exitosa (status 200-299)
                    return response.json(); // Parsear el cuerpo de la respuesta como JSON
                } else {
                    throw new Error('Error al registrar el usuario');
                }
            })
            .then(data => {
                // Aquí podemos manejar la respuesta procesada como JSON
                alert('Categoría registrada exitosamente');
                // Cerrar el modal y limpiar los campos
                document.getElementById('usuarioName').value = ''; // Limpiar ID para nuevo registro
                document.getElementById('usuarioLastName').value = '';
                document.getElementById('usuarioPhone').value = '';
                document.getElementById('usuarioEmail').value = '';
                document.getElementById('usuarioPassword').value = '';
                document.getElementById('usuarioPasswordConfirm').value = '';
                loadTable(); // Actualizar la tabla después de agregar la categoría
            })
            .catch(error => {
                // Si hubo un error en la solicitud o en la respuestax`
                alert(error.message); // Mostrar mensaje de error
                console.error('Error al registrar la categoría:', error);
            });
    });



    //Cancelar el modal
    document.getElementById('cancelarButton').addEventListener("click", () => {
        document.getElementById('usuarioModal').style.display = 'none';
    })



});
