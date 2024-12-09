describe('Registro de Proveedor', () => {
    beforeEach(() => {
      // Carga la página directamente
      cy.visit('http://127.0.0.1:5500/Backend-SIGI/templates/ConsultProvide.html'); // Ajusta la URL según tu entorno
      cy.reload();
    });
  
    it('Debería registrar un nuevo proveedor', () => {
      // Intercepta la llamada POST para registrar un proveedor
      cy.intercept('POST', 'http://localhost:8080/proveedor', {
        statusCode: 200,
        body: { message: 'Proveedor registrado exitosamente.' },
      }).as('registerProvider');
  
      // Abre el modal de registro de proveedor
      cy.get('#addProduct').click();
  
      // Verifica que el modal esté visible
      cy.get('#modalProvee').should('be.visible');
  
      // Llena los campos del formulario
      cy.get('#providerName').type('Proveedor Ejemplo');
      cy.get('#providerPhone').type('123456789');
      cy.get('#providerRFC').type('RFC123456');
      cy.get('#providerEmail').type('proveedor@example.com');
      cy.get('#providerAddress').type('Calle Ejemplo 123');
  
      // Hace clic en el botón "Registrar"
      cy.get('#registerProvider').click();
  
      // Verifica que la solicitud POST se realizó con los datos correctos
      cy.wait('@registerProvider').then((interception) => {
        expect(interception.request.body).to.deep.equal({
          name: 'Proveedor Ejemplo',
          telefono: '123456789',
          rfc: 'RFC123456',
          email: 'proveedor@example.com',
          direccion: 'Calle Ejemplo 123',
          status: true, // Por defecto, el proveedor es activo
        });
      });
  
      // Verifica que el modal se cerró
      cy.get('#modalProvee').should('not.be.visible');
  
      // Verifica que se muestra una alerta de éxito
      cy.on('window:alert', (text) => {
        expect(text).to.equal('Proveedor registrado exitosamente.');
      });
    });
  });
  