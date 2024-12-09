describe('Registro de Categoría', () => {
    beforeEach(() => {
      // Simula datos en localStorage y abre la página
      cy.visit('http://127.0.0.1:5500/Backend-SIGI/templates/ConsultCategory.html'); 
      cy.window().then((win) => {
        win.localStorage.setItem('authToken', 'dummyToken'); // Simula un token
      });
      cy.reload();
    });
  
    it('Debería abrir el modal de registro de categoría', () => {
      // Clic en el botón para abrir el modal
      cy.get('#addCategoryButton').click();
  
      // Verifica que el modal esté visible
      cy.get('#categoryModal').should('be.visible');
    });
  
    it('Debería registrar una nueva categoría', () => {
      // Intercepta la llamada POST para simular el registro
      cy.intercept('POST', 'http://localhost:8080/categorias', {
        statusCode: 200,
        body: { message: 'Categoría creada exitosamente.' },
      }).as('registerCategory');
  
      // Abre el modal
      cy.get('#addCategoryButton').click();
  
      // Completa los campos del formulario
      cy.get('#categoryName').type('Electrónica');
      cy.get('#categoryDescription').type('Productos electrónicos y gadgets.');
  
      // Clic en el botón de registrar
      cy.get('#registerCategoryButton').click();
  
      // Verifica que se envió la solicitud con los datos correctos
      cy.wait('@registerCategory').then((interception) => {
        expect(interception.request.body).to.deep.equal({
          name: 'Electrónica',
          description: 'Productos electrónicos y gadgets.',
        });
      });
  
      // Verifica que el modal se cerró y muestra una alerta de éxito
      cy.get('#categoryModal').should('not.be.visible');
      cy.on('window:alert', (text) => {
        expect(text).to.equal('Categoría creada exitosamente.');
      });
    });
  });
  