describe('Editar Producto', () => {
    beforeEach(() => {
      // Carga la página directamente
      cy.visit('http://127.0.0.1:5500/Backend-SIGI/templates/ConsultProduct.html'); // Ajusta la URL según tu entorno
      cy.reload();
    });
  
    it('Debería abrir el modal de edición e ingresar datos', () => {
      // Simula la respuesta de la API con un producto para editar
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
  
      // Ingresa datos en los campos del modal
      cy.get('#productName').clear().type('Producto Editado');
      cy.get('#precioUnitario').clear().type('150.50');
      cy.get('#cantidad').clear().type('20');
  
      // Verifica que los datos se hayan ingresado correctamente
      cy.get('#productName').should('have.value', 'Producto Editado');
      cy.get('#precioUnitario').should('have.value', '150.50');
      cy.get('#cantidad').should('have.value', '20');
  
      // Cierra el modal
      cy.get('#closeModalButtonFooter').click();
  
      // Verifica que el modal no esté visible
      cy.get('#productModal').should('not.be.visible');
    });
  });
  