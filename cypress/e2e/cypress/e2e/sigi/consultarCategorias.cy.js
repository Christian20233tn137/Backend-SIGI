describe('Consulta de Categorías', () => {
    beforeEach(() => {
      // Simula datos en localStorage y abre la página
      cy.visit('http://127.0.0.1:5500/Backend-SIGI/templates/ConsultCategory.html'); // Ajusta la URL según tu entorno
      cy.window().then((win) => {
        win.localStorage.setItem('authToken', 'dummyToken'); // Simula un token
      });
      cy.reload();
    });
  
    it('Debería cargar las categorías en la tabla', () => {
      // Intercepta la llamada GET para simular los datos de categorías
      cy.intercept('GET', 'http://localhost:8080/categorias/all', {
        statusCode: 200,
        body: {
          type: 'SUCCESS',
          result: [
            { id: 1, name: 'Electrónica', description: 'Productos electrónicos', status: true },
            { id: 2, name: 'Ropa', description: 'Prendas de vestir', status: false },
          ],
        },
      }).as('getCategories');
  
      // Espera a que la solicitud se complete
      cy.wait('@getCategories');
  
      // Verifica que las filas se hayan llenado correctamente
      cy.get('#states-table tbody tr').should('have.length', 2);
  
      // Verifica los datos de la primera fila
      cy.get('#states-table tbody tr').first().within(() => {
        cy.get('th').should('have.text', '1'); // Número de fila
        cy.get('td').eq(0).should('have.text', 'Electrónica'); // Nombre
        cy.get('td').eq(1).should('have.text', 'Productos electrónicos'); // Descripción
        cy.get('td').eq(2).should('have.text', 'Activo'); // Estado
      });
  
      // Verifica los datos de la segunda fila
      cy.get('#states-table tbody tr').last().within(() => {
        cy.get('th').should('have.text', '2'); // Número de fila
        cy.get('td').eq(0).should('have.text', 'Ropa'); // Nombre
        cy.get('td').eq(1).should('have.text', 'Prendas de vestir'); // Descripción
        cy.get('td').eq(2).should('have.text', 'Inactivo'); // Estado
      });
    });
  
    it('Debería filtrar las categorías en la tabla', () => {
      // Intercepta la llamada GET para simular los datos de categorías
      cy.intercept('GET', 'http://localhost:8080/categorias/all', {
        statusCode: 200,
        body: {
          type: 'SUCCESS',
          result: [
            { id: 1, name: 'Electrónica', description: 'Productos electrónicos', status: true },
            { id: 2, name: 'Ropa', description: 'Prendas de vestir', status: false },
          ],
        },
      }).as('getCategories');
  
      // Espera a que la solicitud se complete
      cy.wait('@getCategories');
  
      // Verifica que haya dos filas antes de filtrar
      cy.get('#states-table tbody tr').should('have.length', 2);
  
      // Escribe en el campo de búsqueda para filtrar
      cy.get('#searchInput').type('Ropa');
  
      // Verifica que solo quede una fila visible
      cy.get('#states-table tbody tr:visible').should('have.length', 1);
  
      // Verifica que la fila visible sea la correcta
      cy.get('#states-table tbody tr:visible').first().within(() => {
        cy.get('td').eq(0).should('have.text', 'Ropa'); // Nombre
        cy.get('td').eq(1).should('have.text', 'Prendas de vestir'); // Descripción
      });
    });
  });
  