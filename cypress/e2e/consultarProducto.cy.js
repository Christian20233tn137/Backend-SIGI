describe('Consulta de Productos ', () => {
    beforeEach(() => {
      // Carga la página directamente
      cy.visit('http://127.0.0.1:5500/Backend-SIGI/templates/ConsultProduct.html'); // Ajusta la URL según tu entorno
      cy.reload();
    });
  
    it('Debería cargar los productos en la tabla', () => {
      // Intercepta la llamada GET para simular los datos de productos
      cy.intercept('GET', 'http://localhost:8080/producto/all', {
        statusCode: 200,
        body: {
          type: 'SUCCESS',
          result: [
            {
              id: 1,
              nombre: 'Laptop',
              cantidad: 10,
              categorias: { name: 'Electrónica' },
              precioUnitario: 1500.99,
              status: true,
            },
            {
              id: 2,
              nombre: 'Camiseta',
              cantidad: 50,
              categorias: { name: 'Ropa' },
              precioUnitario: 19.99,
              status: false,
            },
          ],
        },
      }).as('getProducts');
  
      // Espera a que la solicitud se complete
      cy.wait('@getProducts');
  
      // Verifica que las filas se hayan llenado correctamente
      cy.get('#productos-table tbody tr').should('have.length', 2);
  
      // Verifica los datos de la primera fila
      cy.get('#productos-table tbody tr').first().within(() => {
        cy.get('th').should('have.text', '1'); // Número de fila
        cy.get('td').eq(0).should('have.text', 'Laptop'); // Nombre
        cy.get('td').eq(1).should('have.text', '10'); // Cantidad
        cy.get('td').eq(2).should('have.text', 'Electrónica'); // Categoría
        cy.get('td').eq(3).should('have.text', '$1500.99'); // Precio Unitario
        cy.get('td').eq(4).should('have.text', 'Activo'); // Estado
      });
  
      // Verifica los datos de la segunda fila
      cy.get('#productos-table tbody tr').last().within(() => {
        cy.get('th').should('have.text', '2'); // Número de fila
        cy.get('td').eq(0).should('have.text', 'Camiseta'); // Nombre
        cy.get('td').eq(1).should('have.text', '50'); // Cantidad
        cy.get('td').eq(2).should('have.text', 'Ropa'); // Categoría
        cy.get('td').eq(3).should('have.text', '$19.99'); // Precio Unitario
        cy.get('td').eq(4).should('have.text', 'Inactivo'); // Estado
      });
    });
  
    it('Debería filtrar los productos en la tabla', () => {
      // Intercepta la llamada GET para simular los datos de productos
      cy.intercept('GET', 'http://localhost:8080/producto/all', {
        statusCode: 200,
        body: {
          type: 'SUCCESS',
          result: [
            {
              id: 1,
              nombre: 'Laptop',
              cantidad: 10,
              categorias: { name: 'Electrónica' },
              precioUnitario: 1500.99,
              status: true,
            },
            {
              id: 2,
              nombre: 'Camiseta',
              cantidad: 50,
              categorias: { name: 'Ropa' },
              precioUnitario: 19.99,
              status: false,
            },
          ],
        },
      }).as('getProducts');
  
      // Espera a que la solicitud se complete
      cy.wait('@getProducts');
  
      // Verifica que haya dos filas antes de filtrar
      cy.get('#productos-table tbody tr').should('have.length', 2);
  
      // Escribe en el campo de búsqueda para filtrar
      cy.get('#searchInput').type('Camiseta');
  
      // Verifica que solo quede una fila visible
      cy.get('#productos-table tbody tr:visible').should('have.length', 1);
  
      // Verifica que la fila visible sea la correcta
      cy.get('#productos-table tbody tr:visible').first().within(() => {
        cy.get('td').eq(0).should('have.text', 'Camiseta'); // Nombre
        cy.get('td').eq(1).should('have.text', '50'); // Cantidad
        cy.get('td').eq(2).should('have.text', 'Ropa'); // Categoría
      });
    });
  });
  