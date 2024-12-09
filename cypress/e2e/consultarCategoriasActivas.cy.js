describe('Consulta de categorías activas', () => {
    beforeEach(() => {
      // Carga la página sin necesidad de manipular localStorage
      cy.visit('http://127.0.0.1:5500/Backend-SIGI/templates/ConsultCategory.html'); // Ajusta la URL según tu entorno
      cy.reload();
    });
  
    it('Debería mostrar solo las categorías activas en la tabla', () => {
      // Intercepta la llamada GET para simular los datos de categorías
      cy.intercept('GET', 'http://localhost:8080/categorias/all', {
        statusCode: 200,
        body: {
          type: 'SUCCESS',
          result: [
            { id: 1, name: 'Electrónica', description: 'Productos electrónicos', status: true },
            { id: 2, name: 'Ropa', description: 'Prendas de vestir', status: false },
            { id: 3, name: 'Hogar', description: 'Artículos para el hogar', status: true },
          ],
        },
      }).as('getCategories');
  
      // Espera a que se complete la solicitud GET
      cy.wait('@getCategories');
  
      // Verifica que solo las categorías activas se muestran
      cy.get('#states-table').should('have.length', 2); // Solo 2 categorías activas
  
      // Verifica que las filas visibles correspondan a categorías activas
      cy.get('#states-table tbody tr').each(($row) => {
        cy.wrap($row).within(() => {
          cy.get('td').eq(2).should('have.text', 'Activo'); // Verifica que el estado sea "Activo"
        });
      });
    });
  });
  