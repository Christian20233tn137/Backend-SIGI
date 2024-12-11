describe('Cambiar estado de proveedor ', () => {
    beforeEach(() => {
      // Carga la página directamente
      cy.visit('http://127.0.0.1:5500/Backend-SIGI/templates/ConsultProvide.html'); // Ajusta la URL según tu entorno
      cy.reload();
    });
  
    it('Debería cambiar el estado de un proveedor', () => {
      // Intercepta la llamada GET para cargar proveedores
      cy.intercept('GET', 'http://localhost:8080/proveedor/all', {
        statusCode: 200,
        body: {
          type: 'SUCCESS',
          result: [
            {
              id: 1,
              name: 'Proveedor Activo',
              rfc: 'RFC123456',
              direccion: 'Calle Activo 1',
              telefono: '123456789',
              email: 'activo@example.com',
              status: true, // Activo
            },
          ],
        },
      }).as('getProviders');
  
      // Intercepta la llamada PUT para cambiar el estado del proveedor
      cy.intercept('PUT', 'http://localhost:8080/proveedor/cambiar-estado', {
        statusCode: 200,
        body: { message: 'Estado del proveedor actualizado exitosamente.' },
      }).as('toggleProviderStatus');
  
      // Espera a que se carguen los proveedores
      cy.wait('@getProviders');
  
      // Encuentra y hace clic en el botón "Desactivar" del proveedor
      cy.get('#providerTable tbody tr')
        .first()
        .within(() => {
          cy.contains('Desactivar').click();
        });
  
      // Verifica que la solicitud PUT se realizó correctamente
      cy.wait('@toggleProviderStatus').then((interception) => {
        expect(interception.request.body).to.deep.equal({
          id: 1, // ID del proveedor
        });
      });
  
      // Verifica que el estado cambió en la tabla
      cy.get('#providerTable tbody tr')
        .first()
        .within(() => {
          cy.get('td').eq(5).should('have.text', 'Inactivo'); // Verifica que el estado cambió a "Inactivo"
          cy.contains('Activar'); // Verifica que el botón ahora dice "Activar"
        });
    });
  });
  