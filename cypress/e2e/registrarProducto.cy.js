describe('Registrar Producto', () => {
    beforeEach(() => {
      // Carga la página directamente
      cy.visit('http://127.0.0.1:5500/Backend-SIGI/templates/ConsultProduct.html'); // Ajusta la URL según tu entorno
      cy.reload();
    });
  
    it('Debería registrar un nuevo producto', () => {
      // Intercepta la llamada POST para registrar un producto
      cy.intercept('POST', 'http://localhost:8080/producto', {
        statusCode: 200,
        body: { message: 'Producto registrado exitosamente.' },
      }).as('registerProduct');
  
      // Abre el modal de registro de producto
      cy.get('#addProductButton').click();
  
      // Verifica que el modal esté visible
      cy.get('#productModal').should('be.visible');
  
      // Llena los campos del formulario
      cy.get('#productName').type('Producto Ejemplo');
      cy.get('#precioUnitario').type('99.99');
      cy.get('#categoryId').select('1'); // Selecciona una categoría (ajusta el valor según tus opciones cargadas)
      cy.get('#cantidad').type('10');
  
      // Hace clic en el botón "Registrar"
      cy.get('#registerProductButton').click();
  
      // Verifica que la solicitud POST se realizó correctamente
      cy.wait('@registerProduct').then((interception) => {
        expect(interception.request.body).to.deep.equal({
          id: '',
          nombre: 'Producto Ejemplo',
          precioUnitario: 99.99,
          categorias: { id: '1' },
          cantidad: 10,
        });
      });
  
      // Verifica que el modal se cerró
      cy.get('#productModal').should('not.be.visible');
  
      // Verifica que se muestra una alerta de éxito
      cy.on('window:alert', (text) => {
        expect(text).to.equal('Producto registrado exitosamente.');
      });
    });
  });
  