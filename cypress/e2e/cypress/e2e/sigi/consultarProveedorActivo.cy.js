describe('Actualizar proveedor activos', () => {
    beforeEach(() => {
      // Carga la página directamente
      cy.visit('http://127.0.0.1:5500/Backend-SIGI/templates/ConsultProvide.html'); // Ajusta la URL según tu entorno
      cy.reload();
    });
  
    it('Debería actualizar los datos de un proveedor existente', () => {
      // Intercepta la llamada GET para simular los datos de proveedores
      cy.intercept('GET', 'http://localhost:8080/proveedor/all', {
        statusCode: 200,
        body: {
          type: 'SUCCESS',
          result: [
            {
              id: 1,
              name: 'Proveedor Original',
              rfc: 'RFC123456',
              direccion: 'Calle Original 1',
              telefono: '123456789',
              email: 'original@example.com',
              status: true,
            },
          ],
        },
      }).as('getProviders');
  
      // Intercepta la llamada PUT para actualizar un proveedor
      cy.intercept('PUT', 'http://localhost:8080/proveedor/1', {
        statusCode: 200,
        body: { message: 'Proveedor actualizado exitosamente.' },
      }).as('updateProvider');
  
      // Espera a que se complete la solicitud GET
      cy.wait('@getProviders');
  
      // Abre el modal de edición haciendo clic en el botón "Editar"
      cy.get('#providerTable tbody tr')
        .first()
        .within(() => {
          cy.contains('Editar').click();
        });
  
      // Verifica que el modal de edición esté visible
      cy.get('#modalProvee').should('be.visible');
  
      // Edita los campos del formulario
      cy.get('#providerName').clear().type('Proveedor Actualizado');
      cy.get('#providerPhone').clear().type('987654321');
      cy.get('#providerRFC').clear().type('RFC654321');
      cy.get('#providerEmail').clear().type('actualizado@example.com');
      cy.get('#providerAddress').clear().type('Calle Actualizada 2');
  
      // Clic en el botón "Registrar" para actualizar los datos
      cy.get('#registerProvider').click();
  
      // Verifica que la solicitud PUT se realizó correctamente
      cy.wait('@updateProvider').then((interception) => {
        expect(interception.request.body).to.deep.equal({
          name: 'Proveedor Actualizado',
          telefono: '987654321',
          rfc: 'RFC654321',
          email: 'actualizado@example.com',
          direccion: 'Calle Actualizada 2',
          status: true,
        });
      });
  
      // Verifica que el modal se cerró
      cy.get('#modalProvee').should('not.be.visible');
  
      // Verifica que el mensaje de éxito se muestra en una alerta
      cy.on('window:alert', (text) => {
        expect(text).to.equal('Proveedor actualizado exitosamente.');
      });
    });
  });
  