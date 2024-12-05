// Usuario.js

// Base URL de tu API
const API_URL = "http://localhost:8080/producto";

// Cargar usuarios al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    fetchProductos();
});

// Función para obtener todos los productos
async function fetchProductos() {
    try {
        const response = await fetch(API_URL); 
        if (response.ok) {
            const productos = await response.json();
            populateTable(productos);
        } else {
            console.error("Error al obtener usuarios:", response.statusText);
        }
    } catch (error) {
        console.error("Error al conectar con el backend:", error);
    }
}

// Poblar la tabla con productos
function populateTable(productos) {
    const tbody = document.querySelector(".provider-table tbody");
    tbody.innerHTML = ""; // Limpiar contenido previo
    usuarios.forEach((producto) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.cantidad}</td>
            <td>${usuario.precio_unitario}</td>
        `;
        tbody.appendChild(tr);
    });
}
