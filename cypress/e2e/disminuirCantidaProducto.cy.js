describe('Dsiminuir Producto', () => {
    beforeEach(() => {
      // Carga la página directamente
      cy.visit('http://127.0.0.1:5500/Backend-SIGI/templates/ConsultProduct.html'); // Ajusta la URL según tu entorno
      cy.reload();
    });
  
    it('Debería abrir el modal al hacer clic en el botón de agregar', () => {
      // Simula que el botón de agregar es presionado
      cy.get('#addProductButton').click();
  
      // Verifica que el modal esté visible
      cy.get('#productModal').should('be.visible');
    });
  });
  