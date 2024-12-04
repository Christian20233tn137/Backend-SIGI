// Usuario.js

// Base URL de tu API
const API_URL = "http://localhost:8080/usuario";

// Cargar usuarios al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    fetchUsuarios();
});

// Función para obtener todos los usuarios
async function fetchUsuarios() {
    try {
        const response = await fetch(API_URL); 
        if (response.ok) {
            const usuarios = await response.json();
            populateTable(usuarios);
        } else {
            console.error("Error al obtener usuarios:", response.statusText);
        }
    } catch (error) {
        console.error("Error al conectar con el backend:", error);
    }
}

// Poblar la tabla con usuarios
function populateTable(usuarios) {
    const tbody = document.querySelector(".provider-table tbody");
    tbody.innerHTML = ""; // Limpiar contenido previo
    usuarios.forEach((usuario) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${usuario.nombre}</td>
            <td>${usuario.apellidos}</td>
            <td>${usuario.telefono}</td>
            <td>${usuario.correo}</td>
            <td>${usuario.estado ? "Activo" : "Inactivo"}</td>
            <td>
                <button class="edit-button" data-id="${usuario.id}">Editar</button>
                <button class="delete-button" data-id="${usuario.id}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Asignar eventos a los botones de gestionar
    document.querySelectorAll(".edit-button").forEach((btn) =>
        btn.addEventListener("click", handleEdit)
    );
    document.querySelectorAll(".delete-button").forEach((btn) =>
        btn.addEventListener("click", handleDelete)
    );
}

// Función para manejar la creación de un usuario
document.querySelector(".registrar").addEventListener("click", async (e) => {
    e.preventDefault();
    const usuario = gatherFormData();
    if (validateForm(usuario)) {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario),
            });
            if (response.ok) {
                alert("Usuario registrado exitosamente.");
                fetchUsuarios(); // Refrescar lista
            } else {
                console.error("Error al registrar usuario:", response.statusText);
            }
        } catch (error) {
            console.error("Error al conectar con el backend:", error);
        }
    }
});

// Función para manejar la edición de un usuario
async function handleEdit(e) {
    const id = e.target.dataset.id;
    const usuario = gatherFormData();
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario),
        });
        if (response.ok) {
            alert("Usuario actualizado exitosamente.");
            fetchUsuarios();
        } else {
            console.error("Error al actualizar usuario:", response.statusText);
        }
    } catch (error) {
        console.error("Error al conectar con el backend:", error);
    }
}

// Función para manejar la eliminación de un usuario
async function handleDelete(e) {
    const id = e.target.dataset.id;
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                alert("Usuario eliminado exitosamente.");
                fetchUsuarios();
            } else {
                console.error("Error al eliminar usuario:", response.statusText);
            }
        } catch (error) {
            console.error("Error al conectar con el backend:", error);
        }
    }
}

// Recopilar datos del formulario
function gatherFormData() {
    return {
        nombre: document.querySelector("input[name='nombre']").value,
        apellidos: document.querySelector("input[name='apellidos']").value,
        telefono: document.querySelector("input[name='telefono']").value,
        correo: document.querySelector("input[name='correo']").value,
        contraseña: document.querySelector("input[name='contraseña']").value,
    };
}

// Validar datos del formulario
function validateForm(usuario) {
    if (!usuario.nombre || !usuario.apellidos || !usuario.telefono || !usuario.correo || !usuario.contraseña) {
        alert("Todos los campos son obligatorios.");
        return false;
    }
    return true;
}
