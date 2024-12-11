describe('Consulta de Proveedores', () => {
    beforeEach(() => {
      // Carga la página directamente
      cy.visit('http://127.0.0.1:5500/Backend-SIGI/templates/ConsultProvide.html'); // Ajusta la URL según tu entorno
      cy.reload();
    });
  
    it('Debería mostrar todos los proveedores en la tabla', () => {
      // Intercepta la llamada GET para cargar los proveedores
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
            {
              id: 2,
              name: 'Proveedor Inactivo',
              rfc: 'RFC654321',
              direccion: 'Calle Inactivo 2',
              telefono: '987654321',
              email: 'inactivo@example.com',
              status: false, // Inactivo
            },
          ],
        },
      }).as('getProviders');
  
      // Espera a que se complete la solicitud GET
      cy.wait('@getProviders');
  
      // Verifica que se muestran ambos proveedores en la tabla
      cy.get('#providerTable tbody tr').should('have.length', 2);
  
      // Verifica los datos del primer proveedor
      cy.get('#providerTable tbody tr').first().within(() => {
        cy.get('th').should('have.text', '1'); // Número de fila
        cy.get('td').eq(0).should('have.text', 'Proveedor Activo'); // Nombre
        cy.get('td').eq(1).should('have.text', 'RFC123456'); // RFC
        cy.get('td').eq(2).should('have.text', 'Calle Activo 1'); // Dirección
        cy.get('td').eq(3).should('have.text', '123456789'); // Teléfono
        cy.get('td').eq(4).should('have.text', 'activo@example.com'); // Email
        cy.get('td').eq(5).should('have.text', 'Activo'); // Estado
      });
  
      // Verifica los datos del segundo proveedor
      cy.get('#providerTable tbody tr').last().within(() => {
        cy.get('th').should('have.text', '2'); // Número de fila
        cy.get('td').eq(0).should('have.text', 'Proveedor Inactivo'); // Nombre
        cy.get('td').eq(1).should('have.text', 'RFC654321'); // RFC
        cy.get('td').eq(2).should('have.text', 'Calle Inactivo 2'); // Dirección
        cy.get('td').eq(3).should('have.text', '987654321'); // Teléfono
        cy.get('td').eq(4).should('have.text', 'inactivo@example.com'); // Email
        cy.get('td').eq(5).should('have.text', 'Inactivo'); // Estado
      });
    });
  });
  