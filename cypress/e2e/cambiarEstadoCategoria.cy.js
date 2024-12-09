describe('Cambiar estado de la categoría', () => {
    beforeEach(() => {
      // Carga la página directamente
      cy.visit('http://127.0.0.1:5500/Backend-SIGI/templates/ConsultCategory.html'); // Ajusta la URL según tu entorno
      cy.reload();
    });
  
    it('Debería cambiar el estado de la categoría correctamente', () => {
      // Intercepta la llamada GET para cargar categorías en la tabla
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
  
      // Intercepta la llamada PUT para cambiar el estado de la categoría
      cy.intercept('PUT', 'http://localhost:8080/categorias/cambiar-estado', {
        statusCode: 200,
        body: { message: 'Estado de la categoría actualizado exitosamente.' },
      }).as('toggleCategoryStatus');
  
      // Espera a que se carguen las categorías
      cy.wait('@getCategories');
  
      // Encuentra y hace clic en el botón "Desactivar" de la primera categoría
      cy.get('#states-table tbody tr')
        .first()
        .within(() => {
          cy.contains('Desactivar').click();
        });
  
      // Verifica que la solicitud PUT se realizó correctamente
      cy.wait('@toggleCategoryStatus').then((interception) => {
        expect(interception.request.body).to.deep.equal({
          id: 1, // Asegúrate de que el ID enviado sea el correcto
        });
      });
  
      // Verifica que el estado de la categoría cambió en la tabla
      cy.get('#states-table tbody tr')
        .first()
        .within(() => {
          cy.get('td').eq(2).should('have.text', 'Inactivo'); // Verifica que el estado cambió a "Inactivo"
          cy.contains('Activar'); // Verifica que el botón cambió a "Activar"
        });
    });
  });
  