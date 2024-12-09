describe('Validar botón Editar perfil', () => {
    beforeEach(() => {
      // Visita la página que contiene la barra lateral
      cy.visit('http://127.0.0.1:5500/Backend-SIGI/templates/ConsultarUsuarios.html'); // Ajusta la URL si es necesario
    });
  
    it('Debería encontrar y hacer clic en el botón de Editar perfil', () => {
      // Localiza el enlace de "Editar perfil" por su texto
      cy.contains('Editar perfil')
        .should('be.visible') // Verifica que es visible
        .and('have.attr', 'href', 'EditarPerfilAdmin.html') // Verifica que tiene el enlace correcto
        .click(); // Realiza clic en el enlace
  
      // Verifica que la navegación ocurra a la página esperada
      cy.url().should('include', 'EditarPerfilAdmin.html');
    });
  });
  