describe('Consultar Usuarios ', () => {
    const API_URL = 'http://localhost:8080/usuario';
  
    beforeEach(() => {
      // Visita la página de la aplicación
      cy.visit('http://127.0.0.1:5500/Backend-SIGI/templates/ConsultarUsuarios.html');
    });
  
    it('Debe realizar una consulta a la API y cargar los usuarios en la tabla', () => {
      // Intercepta la llamada al API y responde con datos simulados
      cy.intercept('GET', API_URL, {
        statusCode: 200,
        body: {
          type: "SUCCESS",
          result: [
            { id: 1, name: "Juan", lastname: "Pérez", telephone: "123456789", email: "juan@example.com", status: true },
            { id: 2, name: "Ana", lastname: "García", telephone: "987654321", email: "ana@example.com", status: false },
          ],
        },
      }).as('getUsuarios');
  
      // Asegúrate de que la tabla se cargue correctamente después de la llamada a la API
      cy.wait('@getUsuarios');
  
      // Verifica que la tabla tenga el contenido esperado
      cy.get('#states-table tbody tr').should('have.length', 2);
  
      // Verifica el contenido de la primera fila
      cy.get('#states-table tbody tr').eq(0).within(() => {
        cy.get('th').should('contain', '1');
        cy.get('td').eq(0).should('contain', 'Juan');
        cy.get('td').eq(1).should('contain', 'Pérez');
        cy.get('td').eq(2).should('contain', '123456789');
        cy.get('td').eq(3).should('contain', 'juan@example.com');
        cy.get('td').eq(4).should('contain', 'Activo');
      });
  
      // Verifica el contenido de la segunda fila
      cy.get('#states-table tbody tr').eq(1).within(() => {
        cy.get('th').should('contain', '2');
        cy.get('td').eq(0).should('contain', 'Ana');
        cy.get('td').eq(1).should('contain', 'García');
        cy.get('td').eq(2).should('contain', '987654321');
        cy.get('td').eq(3).should('contain', 'ana@example.com');
        cy.get('td').eq(4).should('contain', 'Inactivo');
      });
    });
  });