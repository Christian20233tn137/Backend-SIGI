describe('Consulta de Productos Activos', () => {
    beforeEach(() => {
      // Carga la página directamente
      cy.visit('http://127.0.0.1:5500/Backend-SIGI/templates/ConsultProduct.html'); // Ajusta la URL según tu entorno
      cy.reload();
    });
  
    it('Debería mostrar solo los productos activos en la tabla', () => {
      // Intercepta la llamada GET para simular los datos de productos
      cy.intercept('GET', 'http://localhost:8080/producto/all', {
        statusCode: 200,
        body: {
          type: 'SUCCESS',
          result: [
            {
              id: 1,
              nombre: 'Laptop',
              cantidad: 10,
              categorias: { name: 'Electrónica' },
              precioUnitario: 1500.99,
              status: true, // Activo
            },
            {
              id: 2,
              nombre: 'Camiseta',
              cantidad: 50,
              categorias: { name: 'Ropa' },
              precioUnitario: 19.99,
              status: false, // Inactivo
            },
            {
              id: 3,
              nombre: 'Silla',
              cantidad: 20,
              categorias: { name: 'Hogar' },
              precioUnitario: 50.00,
              status: true, // Activo
            },
          ],
        },
      }).as('getProducts');
  
      // Espera a que la solicitud se complete
      cy.wait('@getProducts');
  
      // Verifica que solo los productos activos se muestran en la tabla
      cy.get('#productos-table tbody tr').should('have.length', 2); // Solo 2 productos activos
  
      // Verifica que las filas visibles correspondan a productos activos
      cy.get('#productos-table tbody tr').each(($row) => {
        cy.wrap($row).within(() => {
          cy.get('td').eq(4).should('have.text', 'Activo'); // Verifica que el estado sea "Activo"
        });
      });
    });
  });
  