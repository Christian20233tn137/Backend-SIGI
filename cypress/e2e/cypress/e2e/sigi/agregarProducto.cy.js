describe('Agregar Cantidad de Producto', () => {
    beforeEach(() => {
      // Carga la página directamente
      cy.visit('http://127.0.0.1:5500/Backend-SIGI/templates/ConsultProduct.html'); // Ajusta la URL según tu entorno
      cy.reload();
    });
  
    it('Debería abrir el modal de edición y actualizar la cantidad de productos', () => {
      // Simula la respuesta de la API con un producto existente
      cy.intercept('GET', 'http://localhost:8080/producto/all', {
        statusCode: 200,
        body: {
          type: 'SUCCESS',
          result: [
            {
              id: 1,
              nombre: 'Producto 1',
              cantidad: 10,
              categorias: { id: 1, name: 'Categoría 1' },
              precioUnitario: 100.0,
              status: true,
            },
          ],
        },
      }).as('getProductos');
  
      // Espera a que los productos se carguen
      cy.wait('@getProductos');
  
      // Simula que el botón de editar del primer producto es presionado
      cy.get('#productos-table tbody tr')
        .first()
        .within(() => {
          cy.contains('Editar').click();
        });
  
      // Verifica que el modal esté visible
      cy.get('#productModal').should('be.visible');
  
      // Ingresa una nueva cantidad de productos
      cy.get('#cantidad').clear().type('50');
  
      // Verifica que la cantidad ingresada sea correcta
      cy.get('#cantidad').should('have.value', '50');
  
      // Simula guardar los cambios
      cy.get('#registerProductButton').click();
  
      // Verifica que el modal se haya cerrado
      cy.get('#productModal').should('not.be.visible');
    });
  });
  