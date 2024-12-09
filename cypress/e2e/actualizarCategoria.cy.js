describe('Actualizar Categoría', () => {
    beforeEach(() => {
      // Carga la página directamente
      cy.visit('http://127.0.0.1:5500/Backend-SIGI/templates/ConsultCategory.html'); // Ajusta la URL según tu entorno
      cy.reload();
    });
  
    it('Debería permitir actualizar una categoría existente', () => {
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
  
      // Intercepta la llamada PUT para actualizar la categoría
      cy.intercept('PUT', 'http://localhost:8080/categorias/1', {
        statusCode: 200,
        body: { message: 'Categoría actualizada exitosamente.' },
      }).as('updateCategory');
  
      // Espera a que se carguen las categorías
      cy.wait('@getCategories');
  
      // Encuentra y hace clic en el botón "Editar" de la primera categoría
      cy.get('#states-table tbody tr')
        .first()
        .within(() => {
          cy.contains('Editar').click();
        });
  
      // Verifica que el modal esté visible
      cy.get('#categoryModal').should('be.visible');
  
      // Edita los campos del formulario
      cy.get('#categoryName').clear().type('Electrónica Actualizada');
      cy.get('#categoryDescription').clear().type('Productos electrónicos y gadgets actualizados');
  
      // Clic en el botón "Registrar" para enviar la actualización
      cy.get('#registerCategoryButton').click();
  
      // Verifica que la solicitud PUT se realizó con los datos correctos
      cy.wait('@updateCategory').then((interception) => {
        expect(interception.request.body).to.deep.equal({
          name: 'Electrónica Actualizada',
          description: 'Productos electrónicos y gadgets actualizados',
        });
      });
  
      // Verifica que el modal se cerró
      cy.get('#categoryModal').should('not.be.visible');
  
      // Verifica que se muestra una alerta de éxito
      cy.on('window:alert', (text) => {
        expect(text).to.equal('Categoría actualizada exitosamente.');
      });
    });
  });
  