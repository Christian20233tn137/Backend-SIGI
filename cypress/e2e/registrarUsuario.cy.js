describe('Prueba de registro de usuarios', () => {
    const API_URL = 'http://localhost:8080/usuario';
    const token = 'dummyAuthToken'; // Reemplazar con un token válido si es necesario
  
    beforeEach(() => {
      // Simula un token en localStorage
      cy.visit('http://127.0.0.1:5500/Backend-SIGI/templates/ConsultarUsuarios.html'); // Ajusta la ruta según tu servidor
      cy.window().then((win) => {
        win.localStorage.setItem('authToken', token);
      });
      cy.reload();
    });
  
    it('Debería abrir el modal de registro de usuario', () => {
      cy.get('#addProduct').click(); // Abre el modal
      cy.get('#usuarioModal').should('be.visible'); // Verifica que el modal está visible
    });
  
    it('Debería registrar un nuevo usuario', () => {
      // Abre el modal
      cy.get('#addProduct').click();
  
      // Completa los campos del formulario
      cy.get('#usuarioName').type('Juan');
      cy.get('#usuarioLastName').type('Pérez');
      cy.get('#usuarioPhone').type('123456789');
      cy.get('#usuarioEmail').type('juan.perez@example.com');
      cy.get('#usuarioPassword').type('password123');
      cy.get('#usuarioPasswordConfirm').type('password123');
  
      // Simula el clic en el botón de confirmar
      cy.intercept('POST', API_URL, {
        statusCode: 200,
        body: { message: 'Usuario registrado exitosamente.' },
      }).as('registerUser');
  
      cy.get('#registerButton').click();
  
      // Verifica la alerta y el cierre del modal
      cy.on('window:alert', (text) => {
        expect(text).to.equal('Usuario registrado exitosamente.');
      });
  
      cy.wait('@registerUser').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
      });
  
      cy.get('#usuarioModal').should('not.be.visible'); // Verifica que el modal se cerró
    });
  });
  