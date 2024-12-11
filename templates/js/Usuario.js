document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:8080/usuario';
    const token = localStorage.getItem('authToken');
    console.log(token);

    function loadTable() {
        fetch("http://localhost:8080/usuario/all", {
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
                    tableBody.innerHTML = '';
                    data.result.forEach((usuario, index) => {
                        const row = document.createElement('tr');
                        const numberCell = document.createElement('th');
                        numberCell.scope = 'row';
                        numberCell.textContent = index + 1;
                        row.appendChild(numberCell);

                        const nameCell = document.createElement('td');
                        nameCell.textContent = usuario.name;
                        row.appendChild(nameCell);

                        const lastNameCell = document.createElement('td');
                        lastNameCell.textContent = usuario.lastname;
                        row.appendChild(lastNameCell);

                        const phoneCell = document.createElement('td');
                        phoneCell.textContent = usuario.telephone;
                        row.appendChild(phoneCell);

                        const emailCell = document.createElement('td');
                        emailCell.textContent = usuario.email;
                        row.appendChild(emailCell);

                        const statusCell = document.createElement('td');
                        statusCell.textContent = usuario.status ? 'Activo' : 'Inactivo';
                        row.appendChild(statusCell);

                        const actionsCell = document.createElement('td');
                        const editButton = document.createElement('button');
                        editButton.className = 'btn btn-primary btn-sm mr-2';
                        editButton.textContent = 'Editar';
                        editButton.addEventListener('click', function () {
                            openEditModal(usuario);
                        });
                        actionsCell.appendChild(editButton);

                        const toggleButton = document.createElement('button');
                        toggleButton.className = `btn btn-sm ${usuario.status ? 'btn-danger' : 'btn-success'}`;
                        toggleButton.textContent = usuario.status ? 'Desactivar' : 'Activar';
                        toggleButton.addEventListener('click', function () {
                            toggleUserStatus(usuario.id, statusCell, toggleButton);
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

    function openEditModal(usuario) {
        document.getElementById('usuarioId').value = usuario.id;
        document.getElementById("usuarioName").value = usuario.name;
        document.getElementById("usuarioLastName").value = usuario.lastname;
        document.getElementById("usuarioPhone").value = usuario.telephone;
        document.getElementById("usuarioEmail").value = usuario.email;
        document.getElementById("usuarioPassword").value = usuario.password;
        document.getElementById("usuarioPasswordConfirm").value = usuario.password2;
        document.getElementById('usuarioModal').style.display = 'block';
    }

    function closeModal() {
        document.getElementById('usuarioModal').style.display = 'none';
    }

    function toggleUserStatus(id, statusCell, toggleButton) {
        fetch(`${API_URL}/cambiar-estado`, {
            method: 'PUT',
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id })
        })
            .then(response => {
                if (response.ok) {
                    const newStatus = toggleButton.textContent === 'Activar';
                    statusCell.textContent = newStatus ? 'Activo' : 'Inactivo';
                    toggleButton.className = `btn btn-sm ${newStatus ? 'btn-danger' : 'btn-success'}`;
                    toggleButton.textContent = newStatus ? 'Desactivar' : 'Activar';
                } else {
                    alert('Error al cambiar el estado del usuario.');
                }
            })
            .catch(error => {
                console.error('Error al cambiar el estado:', error);
            });
    }

    document.getElementById('registerButton').addEventListener('click', function (event) {
        event.preventDefault();
    
        const confirmRegistration = confirm('¿Está seguro de que desea registrar este usuario?');
        if (!confirmRegistration) {
            return;
        }
    
        const userId = document.getElementById('usuarioId').value;
        const usuarioName = document.getElementById('usuarioName').value;
        const usuarioLastName = document.getElementById('usuarioLastName').value;
        const usuarioPhone = document.getElementById('usuarioPhone').value;
        const usuarioEmail = document.getElementById('usuarioEmail').value;
        const usuarioPassword = document.getElementById('usuarioPassword').value;
    
        if (!usuarioName || !usuarioLastName || !usuarioPhone || !usuarioEmail || !usuarioPassword) {
            alert('Por favor, complete todos los campos.');
            return;
        }
    
        const userData = {
            name: usuarioName,
            lastname: usuarioLastName,
            email: usuarioEmail,
            telephone: usuarioPhone,
            password: usuarioPassword,
        };
    
        if (userId) {
            // PUT para actualizar
            fetch(`${API_URL}/${userId}`, {
                method: 'PUT',
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error al actualizar el usuario.');
                }
            })
            .then(() => {
                alert('Usuario actualizado exitosamente.');
                closeModal();
                loadTable();
            })
            .catch(error => {
                alert('Error al actualizar los datos: ' + error.message);
            });
        } else {
            // POST para crear
            fetch(`${API_URL}/save`, {
                method: 'POST',
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error al registrar el usuario.');
                }
            })
            .then(() => {
                alert('Usuario registrado exitosamente.');
                closeModal();
                loadTable();
            })
            .catch(error => {
                alert('Error al guardar los datos: ' + error.message);
            });
        }
    });

    loadTable();

    document.getElementById('closeModalButton').addEventListener('click', closeModal);
    document.getElementById('closemodal').addEventListener('click', closeModal);

    document.getElementById('addProduct').addEventListener('click', function () {
        document.getElementById('usuarioName').value = '';
        document.getElementById('usuarioLastName').value = '';
        document.getElementById('usuarioPhone').value = '';
        document.getElementById('usuarioEmail').value = '';
        document.getElementById('usuarioPassword').value = '';
        document.getElementById('usuarioPasswordConfirm').value = '';
        document.getElementById('usuarioModal').style.display = 'block';
    });
});
