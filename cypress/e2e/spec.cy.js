describe('Validación de Inicio de Sesión', () => {
  const baseUrl = 'http://localhost:8080'; // URL del backend

  beforeEach(() => {
      // Asegúrate de visitar la URL correcta
      cy.visit('http://127.0.0.1:5500/templates/login.html'); // URL del frontend
  });

  it('Debería iniciar sesión correctamente con credenciales válidas', () => {
      // Esperar a que el campo de email sea visible
      cy.get('#email', { timeout: 10000 }).should('be.visible');

      // Interceptar la solicitud de inicio de sesión
      cy.intercept('POST', `${baseUrl}/auth/login`, {
          statusCode: 200,
          body: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqdWFuLnBlcmV6QGV4YW1wbGUuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpZCI6MSwic3RhdHVzIjp0cnVlLCJpYXQiOjE3MzM1NDY3NTMsImV4cCI6MTczMzYzMzE1M30.czTgHWzO3SsapU_hdBZYiUC-Z0V22W7qxyWMAWiKYkk', // Token de prueba
      }).as('loginRequest');

      // Llenar el formulario con credenciales válidas
      cy.get('#email').type('juan.perez@example.com');
      cy.get('#password').type('SecurePassword123');

      // Enviar el formulario
      cy.get('.login-form').submit();

      // Esperar la solicitud de inicio de sesión y validar la respuesta
      cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

      // Validar que el token se guarda en localStorage
      cy.window().then((win) => {
          expect(win.localStorage.getItem('authToken')).to.exist;
      });

      // Validar redirección a la página de menú
      cy.url().should('include', '/Menu.html');
  });
});


describe('Validación de la carga de usuarios en la tabla', () => {
  const API_URL = 'http://localhost:8080/usuario/all'; // Endpoint de usuarios
  const FRONT_URL = 'http://127.0.0.1:5500/templates/ConsultarUsuarios.html'; // URL del frontend

  beforeEach(() => {
      // Configura un token falso en localStorage antes de visitar la página
      cy.visit(FRONT_URL, {
          onBeforeLoad: (win) => {
              win.localStorage.setItem('authToken', 'fake-jwt-token'); // Token simulado
          },
      });
  });

  it('Debería cargar correctamente los usuarios en la tabla', () => {
      // Interceptar la solicitud al API de usuarios
      cy.intercept('GET', API_URL, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              result: [
                  {
                      id: 1,
                      name: 'Juan',
                      lastname: 'Pérez',
                      telephone: '1234567890',
                      email: 'juan.perez@example.com',
                      status: true,
                  },
                  {
                      id: 2,
                      name: 'María',
                      lastname: 'Gómez',
                      telephone: '0987654321',
                      email: 'maria.gomez@example.com',
                      status: false,
                  },
              ],
          },
      }).as('getUsers');

      // Esperar a que se cargue la tabla
      cy.wait('@getUsers');

      // Validar que se rendericen las filas correctas en la tabla
      cy.get('#states-table tbody tr').should('have.length', 2);

      // Verificar los datos de la primera fila
      cy.get('#states-table tbody tr').eq(0).within(() => {
          cy.get('th').should('contain', '1'); // Número
          cy.get('td').eq(0).should('contain', 'Juan'); // Nombre
          cy.get('td').eq(1).should('contain', 'Pérez'); // Apellidos
          cy.get('td').eq(2).should('contain', '1234567890'); // Teléfono
          cy.get('td').eq(3).should('contain', 'juan.perez@example.com'); // Correo
          cy.get('td').eq(4).should('contain', 'Activo'); // Estado
      });

      // Verificar los datos de la segunda fila
      cy.get('#states-table tbody tr').eq(1).within(() => {
          cy.get('th').should('contain', '2'); // Número
          cy.get('td').eq(0).should('contain', 'María'); // Nombre
          cy.get('td').eq(1).should('contain', 'Gómez'); // Apellidos
          cy.get('td').eq(2).should('contain', '0987654321'); // Teléfono
          cy.get('td').eq(3).should('contain', 'maria.gomez@example.com'); // Correo
          cy.get('td').eq(4).should('contain', 'Inactivo'); // Estado
      });
  });
});




describe('Validación de funcionalidades de Categorías', () => {
  const API_URL = 'http://localhost:8080/categorias';
  const FRONT_URL = 'http://127.0.0.1:5500/templates/ConsultCategory.html';

  beforeEach(() => {
      cy.visit(FRONT_URL, {
          onBeforeLoad: (win) => {
              win.localStorage.setItem('authToken', 'fake-jwt-token'); // Configurar un token simulado
          },
      });
  });

  it('Debería cargar correctamente las categorías en la tabla', () => {
      // Interceptar la solicitud para obtener categorías
      cy.intercept('GET', `${API_URL}/all`, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              result: [
                  {
                      id: 1,
                      name: 'Categoría 1',
                      description: 'Descripción de Categoría 1',
                      status: true,
                  },
                  {
                      id: 2,
                      name: 'Categoría 2',
                      description: 'Descripción de Categoría 2',
                      status: false,
                  },
              ],
          },
      }).as('getCategorias');

      // Esperar explícitamente por la solicitud interceptada
      cy.wait('@getCategorias', { timeout: 10000 }).then((interception) => {
          console.log('Intercepción completada:', interception);
      });

      // Verificar que la tabla tiene las filas correctas
      cy.get('#states-table tbody tr').should('have.length', 2);

      // Validar datos de la primera fila
      cy.get('#states-table tbody tr').eq(0).within(() => {
          cy.get('th').should('contain', '1');
          cy.get('td').eq(0).should('contain', 'Categoría 1');
          cy.get('td').eq(1).should('contain', 'Descripción de Categoría 1');
          cy.get('td').eq(2).should('contain', 'Activo');
      });

      // Validar datos de la segunda fila
      cy.get('#states-table tbody tr').eq(1).within(() => {
          cy.get('th').should('contain', '2');
          cy.get('td').eq(0).should('contain', 'Categoría 2');
          cy.get('td').eq(1).should('contain', 'Descripción de Categoría 2');
          cy.get('td').eq(2).should('contain', 'Inactivo');
      });
  });
});


describe('Pruebas de Edición de Usuarios', () => {
  const API_URL = 'http://localhost:8080/usuario';
  const FRONT_URL = 'http://127.0.0.1:5500/templates/ConsultarUsuarios.html';

  beforeEach(() => {
      // Configura el token simulado en localStorage y visita la página
      cy.visit(FRONT_URL, {
          onBeforeLoad: (win) => {
              win.localStorage.setItem('authToken', 'fake-jwt-token');
          },
      });
  });

  it('Debería editar un usuario correctamente', () => {
      // Interceptar la solicitud GET para cargar usuarios
      cy.intercept('GET', API_URL, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              result: [
                  {
                      id: 1,
                      name: 'Juan',
                      lastname: 'Pérez',
                      telephone: '1234567890',
                      email: 'juan.perez@example.com',
                      status: true,
                  },
              ],
          },
      }).as('getUsuarios');

      // Interceptar la solicitud PUT para actualizar el usuario
      cy.intercept('PUT', `${API_URL}/1`, {
          statusCode: 200,
          body: {
              message: 'Usuario actualizado exitosamente',
          },
      }).as('updateUsuario');

      // Validar que los usuarios se cargan correctamente
      cy.wait('@getUsuarios');

      // Abrir el modal de edición para el primer usuario
      cy.get('#states-table tbody tr')
          .first()
          .within(() => {
              cy.get('button')
                  .contains('Editar')
                  .click();
          });

      // Validar que los datos del usuario están precargados en el formulario
      cy.get('#usuarioName').should('have.value', 'Juan');
      cy.get('#usuarioLastName').should('have.value', 'Pérez');
      cy.get('#usuarioPhone').should('have.value', '1234567890');
      cy.get('#usuarioEmail').should('have.value', 'juan.perez@example.com');

      // Modificar los datos del usuario
      cy.get('#usuarioName').clear().type('Carlos');
      cy.get('#usuarioLastName').clear().type('Gómez');
      cy.get('#usuarioPhone').clear().type('0987654321');
      cy.get('#usuarioEmail').clear().type('carlos.gomez@example.com');

      // Guardar los cambios
      cy.get('#registerButton').click();

      // Validar que la solicitud PUT se realizó correctamente
      cy.wait('@updateUsuario').its('response.statusCode').should('eq', 200);

      // Validar que los datos actualizados se reflejan en la tabla
      cy.intercept('GET', API_URL, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              result: [
                  {
                      id: 1,
                      name: 'Carlos',
                      lastname: 'Gómez',
                      telephone: '0987654321',
                      email: 'carlos.gomez@example.com',
                      status: true,
                  },
              ],
          },
      }).as('getUsuariosUpdated');

      // Esperar a que la tabla se recargue
      cy.wait('@getUsuariosUpdated');

      // Validar los datos actualizados en la tabla
      cy.get('#states-table tbody tr').first().within(() => {
          cy.get('td').eq(0).should('contain', 'Carlos');
          cy.get('td').eq(1).should('contain', 'Gómez');
          cy.get('td').eq(2).should('contain', '0987654321');
          cy.get('td').eq(3).should('contain', 'carlos.gomez@example.com');
      });
  });
});



describe('Pruebas de Consultar y Editar Perfil', () => {
  const API_URL = 'http://localhost:8080/usuario';
  const FRONT_URL = 'http://127.0.0.1:5500/templates/EditarPerfilAdmin.html';

  beforeEach(() => {
      cy.visit(FRONT_URL); // Visita la página del perfil
  });

  it('Debería cargar los datos del usuario correctamente', () => {
      // Interceptar la solicitud GET para cargar el perfil
      cy.intercept('GET', `${API_URL}/1`, {
          statusCode: 200,
          body: {
              name: 'Juan',
              lastname: 'Pérez',
              email: 'juan.perez@example.com',
              telephone: '1234567890',
          },
      }).as('getUser');

      // Validar que la solicitud GET se realiza
      cy.wait('@getUser').its('response.statusCode').should('eq', 200);

      // Validar que los datos se cargan correctamente en el formulario
      cy.get('#nombres').should('have.value', 'Juan');
      cy.get('#apellidos').should('have.value', 'Pérez');
      cy.get('#correo').should('have.value', 'juan.perez@example.com');
      cy.get('#telefono').should('have.value', '1234567890');
  });

  it('Debería actualizar los datos del usuario correctamente', () => {
      // Interceptar la solicitud PUT para actualizar el perfil
      cy.intercept('PUT', API_URL, {
          statusCode: 200,
          body: {
              message: 'Usuario actualizado exitosamente',
          },
      }).as('updateUser');

      // Modificar los datos en el formulario
      cy.get('#nombres').clear().type('Carlos');
      cy.get('#apellidos').clear().type('Gómez');
      cy.get('#correo').clear().type('carlos.gomez@example.com');
      cy.get('#telefono').clear().type('0987654321');

      // Enviar los datos
      cy.get('button').contains('ACTUALIZAR').click();

      // Validar que la solicitud PUT se realiza correctamente
      cy.wait('@updateUser').its('response.statusCode').should('eq', 200);

      // Validar que aparece el mensaje de éxito
      cy.on('window:alert', (text) => {
          expect(text).to.contains('Usuario actualizado con éxito');
      });
  });
});



describe('Pruebas de Edición de Perfil', () => {
  const API_URL = 'http://localhost:8080/usuario';
  const FRONT_URL = 'http://127.0.0.1:5500/templates/EditarPerfilAdmin.html';

  beforeEach(() => {
      cy.visit(FRONT_URL); // Visita la página del perfil
  });

  it('Debería editar correctamente el perfil del usuario', () => {
      // Interceptar la solicitud GET para cargar el perfil
      cy.intercept('GET', `${API_URL}/1`, {
          statusCode: 200,
          body: {
              name: 'Juan',
              lastname: 'Pérez',
              email: 'juan.perez@example.com',
              telephone: '1234567890',
          },
      }).as('getUser');

      // Validar que la solicitud GET se realiza
      cy.wait('@getUser').its('response.statusCode').should('eq', 200);

      // Validar que los datos se cargan correctamente en el formulario
      cy.get('#nombres').should('have.value', 'Juan');
      cy.get('#apellidos').should('have.value', 'Pérez');
      cy.get('#correo').should('have.value', 'juan.perez@example.com');
      cy.get('#telefono').should('have.value', '1234567890');

      // Interceptar la solicitud PUT para actualizar el perfil
      cy.intercept('PUT', API_URL, {
          statusCode: 200,
          body: {
              message: 'Usuario actualizado exitosamente',
          },
      }).as('updateUser');

      // Modificar los datos en el formulario
      cy.get('#nombres').clear().type('Carlos');
      cy.get('#apellidos').clear().type('Gómez');
      cy.get('#correo').clear().type('carlos.gomez@example.com');
      cy.get('#telefono').clear().type('0987654321');

      // Enviar los datos
      cy.get('button').contains('ACTUALIZAR').click();

      // Validar que la solicitud PUT se realiza correctamente
      cy.wait('@updateUser').its('response.statusCode').should('eq', 200);

      // Validar que aparece el mensaje de éxito
      cy.on('window:alert', (text) => {
          expect(text).to.contains('Usuario actualizado con éxito');
      });

      // Opcional: Validar que los datos del formulario se mantengan actualizados
      cy.get('#nombres').should('have.value', 'Carlos');
      cy.get('#apellidos').should('have.value', 'Gómez');
      cy.get('#correo').should('have.value', 'carlos.gomez@example.com');
      cy.get('#telefono').should('have.value', '0987654321');
  });
});


describe('Validación de funcionalidades de Categorías', () => {
  const API_URL = 'http://localhost:8080/categorias';
  const FRONT_URL = 'http://127.0.0.1:5500/templates/ConsultCategory.html';

  beforeEach(() => {
      cy.visit(FRONT_URL, {
          onBeforeLoad: (win) => {
              win.localStorage.setItem('authToken', 'fake-jwt-token'); // Configurar un token simulado
          },
      });
  });

  it('Debería registrar una nueva categoría correctamente', () => {
      // Interceptar la solicitud POST para agregar una nueva categoría
      cy.intercept('POST', API_URL, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              message: 'Categoría creada exitosamente',
          },
      }).as('postCategoria');

      // Abrir el modal para agregar una categoría
      cy.get('#addCategoryButton').click();

      // Llenar el formulario de categoría
      cy.get('#categoryName').type('Nueva Categoría');
      cy.get('#categoryDescription').type('Descripción de Nueva Categoría');

      // Enviar los datos
      cy.get('#registerCategoryButton').click();

      // Validar que la solicitud POST se realizó
      cy.wait('@postCategoria').its('response.statusCode').should('eq', 200);

      // Interceptar la solicitud GET para recargar la tabla con la nueva categoría
      cy.intercept('GET', `${API_URL}/all`, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              result: [
                  {
                      id: 1,
                      name: 'Categoría 1',
                      description: 'Descripción de Categoría 1',
                      status: true,
                  },
                  {
                      id: 2,
                      name: 'Categoría 2',
                      description: 'Descripción de Categoría 2',
                      status: false,
                  },
                  {
                      id: 3,
                      name: 'Nueva Categoría',
                      description: 'Descripción de Nueva Categoría',
                      status: true,
                  },
              ],
          },
      }).as('getCategoriasUpdated');

      // Validar que la tabla se actualizó con la nueva categoría
      cy.wait('@getCategoriasUpdated');
      cy.get('#states-table tbody tr').should('have.length', 3);

      // Validar datos de la nueva categoría en la tabla
      cy.get('#states-table tbody tr').last().within(() => {
          cy.get('th').should('contain', '3');
          cy.get('td').eq(0).should('contain', 'Nueva Categoría');
          cy.get('td').eq(1).should('contain', 'Descripción de Nueva Categoría');
          cy.get('td').eq(2).should('contain', 'Activo');
      });
  });
});




describe('Pruebas de Consulta de Categorías', () => {
  const API_URL = 'http://localhost:8080/categorias';
  const FRONT_URL = 'http://127.0.0.1:5500/templates/ConsultCategory.html';

  beforeEach(() => {
      cy.visit(FRONT_URL, {
          onBeforeLoad: (win) => {
              win.localStorage.setItem('authToken', 'fake-jwt-token'); // Configurar un token simulado
          },
      });
  });

  it('Debería mostrar correctamente una categoría específica al buscarla', () => {
      // Interceptar la solicitud GET para cargar las categorías
      cy.intercept('GET', `${API_URL}/all`, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              result: [
                  {
                      id: 1,
                      name: 'Categoría 1',
                      description: 'Descripción de Categoría 1',
                      status: true,
                  },
                  {
                      id: 2,
                      name: 'Categoría 2',
                      description: 'Descripción de Categoría 2',
                      status: false,
                  },
              ],
          },
      }).as('getCategorias');

      // Esperar a que se carguen las categorías
      cy.wait('@getCategorias');

      // Validar que la tabla muestra todas las categorías inicialmente
      cy.get('#states-table tbody tr').should('have.length', 2);

      // Escribir el nombre de la categoría en el campo de búsqueda
      cy.get('#searchInput').type('Categoría 1');

      // Simular el filtrado
      cy.intercept('GET', `${API_URL}/buscar?nombre=Categoría 1`, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              result: [
                  {
                      id: 1,
                      name: 'Categoría 1',
                      description: 'Descripción de Categoría 1',
                      status: true,
                  },
              ],
          },
      }).as('buscarCategoria');

      // Validar que la tabla muestra solo la categoría consultada
      cy.wait('@buscarCategoria');
      cy.get('#states-table tbody tr').should('have.length', 1);

      // Verificar los datos de la categoría consultada
      cy.get('#states-table tbody tr').within(() => {
          cy.get('th').should('contain', '1'); // ID
          cy.get('td').eq(0).should('contain', 'Categoría 1'); // Nombre
          cy.get('td').eq(1).should('contain', 'Descripción de Categoría 1'); // Descripción
          cy.get('td').eq(2).should('contain', 'Activo'); // Estado
      });
  });
});


describe('Pruebas de Consulta de Categorías Activas', () => {
  const API_URL = 'http://localhost:8080/categorias';
  const FRONT_URL = 'http://127.0.0.1:5500/templates/ConsultCategory.html';

  beforeEach(() => {
      cy.visit(FRONT_URL, {
          onBeforeLoad: (win) => {
              win.localStorage.setItem('authToken', 'fake-jwt-token'); // Configurar un token simulado
          },
      });
  });

  it('Debería mostrar correctamente solo las categorías activas', () => {
      // Interceptar la solicitud GET para cargar todas las categorías
      cy.intercept('GET', `${API_URL}/all`, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              result: [
                  {
                      id: 1,
                      name: 'Categoría 1',
                      description: 'Descripción de Categoría 1',
                      status: true,
                  },
                  {
                      id: 2,
                      name: 'Categoría 2',
                      description: 'Descripción de Categoría 2',
                      status: false,
                  },
                  {
                      id: 3,
                      name: 'Categoría 3',
                      description: 'Descripción de Categoría 3',
                      status: true,
                  },
              ],
          },
      }).as('getCategorias');

      // Esperar a que se carguen las categorías
      cy.wait('@getCategorias');

      // Validar que la tabla muestra todas las categorías inicialmente
      cy.get('#states-table tbody tr').should('have.length', 3);

      // Interceptar la solicitud GET para filtrar categorías activas
      cy.intercept('GET', `${API_URL}/activas`, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              result: [
                  {
                      id: 1,
                      name: 'Categoría 1',
                      description: 'Descripción de Categoría 1',
                      status: true,
                  },
                  {
                      id: 3,
                      name: 'Categoría 3',
                      description: 'Descripción de Categoría 3',
                      status: true,
                  },
              ],
          },
      }).as('getCategoriasActivas');

      // Simular el filtrado por categorías activas
      cy.get('#filterActiveButton').click(); // Reemplaza con el selector del botón de filtro, si aplica

      // Validar que solo las categorías activas se muestran en la tabla
      cy.wait('@getCategoriasActivas');
      cy.get('#states-table tbody tr').should('have.length', 2);

      // Validar datos de las categorías activas
      cy.get('#states-table tbody tr').eq(0).within(() => {
          cy.get('th').should('contain', '1');
          cy.get('td').eq(0).should('contain', 'Categoría 1');
          cy.get('td').eq(1).should('contain', 'Descripción de Categoría 1');
          cy.get('td').eq(2).should('contain', 'Activo');
      });

      cy.get('#states-table tbody tr').eq(1).within(() => {
          cy.get('th').should('contain', '3');
          cy.get('td').eq(0).should('contain', 'Categoría 3');
          cy.get('td').eq(1).should('contain', 'Descripción de Categoría 3');
          cy.get('td').eq(2).should('contain', 'Activo');
      });
  });
});



describe('Pruebas de Actualización de Categorías', () => {
  const API_URL = 'http://localhost:8080/categorias';
  const FRONT_URL = 'http://127.0.0.1:5500/templates/ConsultCategory.html';

  beforeEach(() => {
      cy.visit(FRONT_URL, {
          onBeforeLoad: (win) => {
              win.localStorage.setItem('authToken', 'fake-jwt-token'); // Configurar un token simulado
          },
      });
  });

  it('Debería actualizar correctamente una categoría', () => {
      // Interceptar la solicitud GET para cargar categorías
      cy.intercept('GET', `${API_URL}/all`, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              result: [
                  {
                      id: 1,
                      name: 'Categoría 1',
                      description: 'Descripción de Categoría 1',
                      status: true,
                  },
                  {
                      id: 2,
                      name: 'Categoría 2',
                      description: 'Descripción de Categoría 2',
                      status: false,
                  },
              ],
          },
      }).as('getCategorias');

      // Validar que las categorías se cargan correctamente
      cy.wait('@getCategorias');
      cy.get('#states-table tbody tr').should('have.length', 2);

      // Interceptar la solicitud PUT para actualizar la categoría
      cy.intercept('PUT', `${API_URL}/1`, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              message: 'Categoría actualizada exitosamente',
          },
      }).as('updateCategoria');

      // Abrir el modal de edición para la primera categoría
      cy.get('#states-table tbody tr').first().within(() => {
          cy.get('button').contains('Editar').click();
      });

      // Validar que los datos de la categoría se cargan en el formulario
      cy.get('#categoryName').should('have.value', 'Categoría 1');
      cy.get('#categoryDescription').should('have.value', 'Descripción de Categoría 1');

      // Modificar los datos en el formulario
      cy.get('#categoryName').clear().type('Nueva Categoría Editada');
      cy.get('#categoryDescription').clear().type('Descripción Actualizada');

      // Guardar los cambios
      cy.get('#registerCategoryButton').click();

      // Validar que la solicitud PUT se realizó correctamente
      cy.wait('@updateCategoria').its('response.statusCode').should('eq', 200);

      // Interceptar la solicitud GET para recargar la tabla con los datos actualizados
      cy.intercept('GET', `${API_URL}/all`, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              result: [
                  {
                      id: 1,
                      name: 'Nueva Categoría Editada',
                      description: 'Descripción Actualizada',
                      status: true,
                  },
                  {
                      id: 2,
                      name: 'Categoría 2',
                      description: 'Descripción de Categoría 2',
                      status: false,
                  },
              ],
          },
      }).as('getCategoriasUpdated');

      // Validar que la tabla muestra los datos actualizados
      cy.wait('@getCategoriasUpdated');
      cy.get('#states-table tbody tr').should('have.length', 2);

      // Verificar los datos actualizados en la tabla
      cy.get('#states-table tbody tr').first().within(() => {
          cy.get('th').should('contain', '1'); // ID
          cy.get('td').eq(0).should('contain', 'Nueva Categoría Editada'); // Nombre
          cy.get('td').eq(1).should('contain', 'Descripción Actualizada'); // Descripción
          cy.get('td').eq(2).should('contain', 'Activo'); // Estado
      });
  });
});


describe('Pruebas de Cambio de Estado de Categorías', () => {
  const API_URL = 'http://localhost:8080/categorias';
  const FRONT_URL = 'http://127.0.0.1:5500/templates/ConsultCategory.html';

  beforeEach(() => {
      cy.visit(FRONT_URL, {
          onBeforeLoad: (win) => {
              win.localStorage.setItem('authToken', 'fake-jwt-token'); // Configurar un token simulado
          },
      });
  });

  it('Debería cambiar correctamente el estado de una categoría', () => {
      // Interceptar la solicitud GET para cargar categorías
      cy.intercept('GET', `${API_URL}/all`, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              result: [
                  {
                      id: 1,
                      name: 'Categoría 1',
                      description: 'Descripción de Categoría 1',
                      status: true, // Activo inicialmente
                  },
                  {
                      id: 2,
                      name: 'Categoría 2',
                      description: 'Descripción de Categoría 2',
                      status: false, // Inactivo inicialmente
                  },
              ],
          },
      }).as('getCategorias');

      // Validar que las categorías se cargan correctamente
      cy.wait('@getCategorias');
      cy.get('#states-table tbody tr').should('have.length', 2);

      // Interceptar la solicitud PUT para cambiar el estado de la categoría
      cy.intercept('PUT', `${API_URL}/cambiar-estado`, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              message: 'Estado de la categoría actualizado',
          },
      }).as('changeStateCategoria');

      // Cambiar el estado de la primera categoría
      cy.get('#states-table tbody tr').first().within(() => {
          cy.get('button').contains('Desactivar').click();
      });

      // Validar que la solicitud PUT se realizó correctamente
      cy.wait('@changeStateCategoria').its('response.statusCode').should('eq', 200);

      // Interceptar la solicitud GET para recargar la tabla con el nuevo estado
      cy.intercept('GET', `${API_URL}/all`, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              result: [
                  {
                      id: 1,
                      name: 'Categoría 1',
                      description: 'Descripción de Categoría 1',
                      status: false, // Cambiado a inactivo
                  },
                  {
                      id: 2,
                      name: 'Categoría 2',
                      description: 'Descripción de Categoría 2',
                      status: false,
                  },
              ],
          },
      }).as('getCategoriasUpdated');

      // Validar que la tabla muestra el nuevo estado
      cy.wait('@getCategoriasUpdated');
      cy.get('#states-table tbody tr').first().within(() => {
          cy.get('td').eq(2).should('contain', 'Inactivo'); // Estado actualizado
          cy.get('button').contains('Activar'); // El botón debe cambiar
      });
  });
});

describe('Pruebas de Registro de Proveedores', () => {
  const API_URL = 'http://localhost:8080/proveedor';
  const FRONT_URL = 'http://127.0.0.1:5500/templates/ConsultProvide.html';

  beforeEach(() => {
      cy.visit(FRONT_URL, {
          onBeforeLoad: (win) => {
              win.localStorage.setItem('authToken', 'fake-jwt-token'); // Configurar un token simulado
          },
      });
  });

  it('Debería registrar correctamente un nuevo proveedor', () => {
      // Interceptar la solicitud GET para cargar proveedores
      cy.intercept('GET', `${API_URL}/all`, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              result: [
                  {
                      id: 1,
                      name: 'Proveedor 1',
                      rfc: 'RFC12345',
                      direccion: 'Dirección 1',
                      telefono: '1234567890',
                      email: 'proveedor1@example.com',
                      status: true,
                  },
              ],
          },
      }).as('getProveedores');

      // Validar que los proveedores se cargan correctamente
      cy.wait('@getProveedores');
      cy.get('#providerTable tbody tr').should('have.length', 1);

      // Interceptar la solicitud POST para agregar un nuevo proveedor
      cy.intercept('POST', API_URL, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              message: 'Proveedor registrado exitosamente',
          },
      }).as('postProveedor');

      // Abrir el modal para agregar un nuevo proveedor
      cy.get('#addProduct').click();

      // Llenar el formulario del proveedor
      cy.get('#providerName').type('Proveedor Nuevo');
      cy.get('#providerPhone').type('0987654321');
      cy.get('#providerRFC').type('RFC67890');
      cy.get('#providerEmail').type('proveedornuevo@example.com');
      cy.get('#providerAddress').type('Nueva Dirección');

      // Enviar el formulario
      cy.get('#registerProvider').click();

      // Validar que la solicitud POST se realizó correctamente
      cy.wait('@postProveedor').its('response.statusCode').should('eq', 200);

      // Interceptar la solicitud GET para recargar la tabla con el nuevo proveedor
      cy.intercept('GET', `${API_URL}/all`, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              result: [
                  {
                      id: 1,
                      name: 'Proveedor 1',
                      rfc: 'RFC12345',
                      direccion: 'Dirección 1',
                      telefono: '1234567890',
                      email: 'proveedor1@example.com',
                      status: true,
                  },
                  {
                      id: 2,
                      name: 'Proveedor Nuevo',
                      rfc: 'RFC67890',
                      direccion: 'Nueva Dirección',
                      telefono: '0987654321',
                      email: 'proveedornuevo@example.com',
                      status: true,
                  },
              ],
          },
      }).as('getProveedoresUpdated');

      // Validar que la tabla muestra el nuevo proveedor
      cy.wait('@getProveedoresUpdated');
      cy.get('#providerTable tbody tr').should('have.length', 2);

      // Validar los datos del nuevo proveedor en la tabla
      cy.get('#providerTable tbody tr').last().within(() => {
          cy.get('th').should('contain', '2'); // ID
          cy.get('td').eq(0).should('contain', 'Proveedor Nuevo'); // Nombre
          cy.get('td').eq(1).should('contain', 'RFC67890'); // RFC
          cy.get('td').eq(2).should('contain', 'Nueva Dirección'); // Dirección
          cy.get('td').eq(3).should('contain', '0987654321'); // Teléfono
          cy.get('td').eq(4).should('contain', 'proveedornuevo@example.com'); // Correo
          cy.get('td').eq(5).should('contain', 'Activo'); // Estado
      });
  });
});




describe('Pruebas de Actualización de Proveedores', () => {
  const API_URL = 'http://localhost:8080/proveedor';
  const FRONT_URL = 'http://127.0.0.1:5500/templates/ConsultProvide.html';

  beforeEach(() => {
      cy.visit(FRONT_URL, {
          onBeforeLoad: (win) => {
              win.localStorage.setItem('authToken', 'fake-jwt-token'); // Configurar un token simulado
          },
      });
  });

  it('Debería actualizar correctamente un proveedor existente', () => {
      // Interceptar la solicitud GET para cargar proveedores
      cy.intercept('GET', `${API_URL}/all`, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              result: [
                  {
                      id: 1,
                      name: 'Proveedor 1',
                      rfc: 'RFC12345',
                      direccion: 'Dirección 1',
                      telefono: '1234567890',
                      email: 'proveedor1@example.com',
                      status: true,
                  },
              ],
          },
      }).as('getProveedores');

      // Validar que los proveedores se cargan correctamente
      cy.wait('@getProveedores');
      cy.get('#providerTable tbody tr').should('have.length', 1);

      // Interceptar la solicitud PUT para actualizar el proveedor
      cy.intercept('PUT', `${API_URL}/1`, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              message: 'Proveedor actualizado exitosamente',
          },
      }).as('updateProveedor');

      // Abrir el modal de edición para el primer proveedor
      cy.get('#providerTable tbody tr').first().within(() => {
          cy.get('button').contains('Editar').click();
      });

      // Validar que los datos se cargan en el formulario
      cy.get('#providerName').should('have.value', 'Proveedor 1');
      cy.get('#providerRFC').should('have.value', 'RFC12345');
      cy.get('#providerAddress').should('have.value', 'Dirección 1');
      cy.get('#providerPhone').should('have.value', '1234567890');
      cy.get('#providerEmail').should('have.value', 'proveedor1@example.com');

      // Modificar los datos en el formulario
      cy.get('#providerName').clear().type('Proveedor Actualizado');
      cy.get('#providerRFC').clear().type('RFC67890');
      cy.get('#providerAddress').clear().type('Dirección Actualizada');
      cy.get('#providerPhone').clear().type('0987654321');
      cy.get('#providerEmail').clear().type('proveedoractualizado@example.com');

      // Guardar los cambios
      cy.get('#registerProvider').click();

      // Validar que la solicitud PUT se realizó correctamente
      cy.wait('@updateProveedor').its('response.statusCode').should('eq', 200);

      // Interceptar la solicitud GET para recargar la tabla con los datos actualizados
      cy.intercept('GET', `${API_URL}/all`, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              result: [
                  {
                      id: 1,
                      name: 'Proveedor Actualizado',
                      rfc: 'RFC67890',
                      direccion: 'Dirección Actualizada',
                      telefono: '0987654321',
                      email: 'proveedoractualizado@example.com',
                      status: true,
                  },
              ],
          },
      }).as('getProveedoresUpdated');

      // Validar que la tabla muestra los datos actualizados
      cy.wait('@getProveedoresUpdated');
      cy.get('#providerTable tbody tr').should('have.length', 1);

      // Validar los datos actualizados en la tabla
      cy.get('#providerTable tbody tr').first().within(() => {
          cy.get('th').should('contain', '1'); // ID
          cy.get('td').eq(0).should('contain', 'Proveedor Actualizado'); // Nombre
          cy.get('td').eq(1).should('contain', 'RFC67890'); // RFC
          cy.get('td').eq(2).should('contain', 'Dirección Actualizada'); // Dirección
          cy.get('td').eq(3).should('contain', '0987654321'); // Teléfono
          cy.get('td').eq(4).should('contain', 'proveedoractualizado@example.com'); // Correo
          cy.get('td').eq(5).should('contain', 'Activo'); // Estado
      });
  });
});





describe('Pruebas de Consulta de Proveedores', () => {
  const API_URL = 'http://localhost:8080/proveedor';
  const FRONT_URL = 'http://127.0.0.1:5500/templates/ConsultProvide.html';

  beforeEach(() => {
      cy.visit(FRONT_URL, {
          onBeforeLoad: (win) => {
              win.localStorage.setItem('authToken', 'fake-jwt-token'); // Configurar un token simulado
          },
      });
  });

  it('Debería mostrar correctamente los proveedores en la tabla', () => {
      // Interceptar la solicitud GET para cargar proveedores
      cy.intercept('GET', `${API_URL}/all`, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              result: [
                  {
                      id: 1,
                      name: 'Proveedor 1',
                      rfc: 'RFC12345',
                      direccion: 'Dirección 1',
                      telefono: '1234567890',
                      email: 'proveedor1@example.com',
                      status: true,
                  },
                  {
                      id: 2,
                      name: 'Proveedor 2',
                      rfc: 'RFC67890',
                      direccion: 'Dirección 2',
                      telefono: '0987654321',
                      email: 'proveedor2@example.com',
                      status: false,
                  },
              ],
          },
      }).as('getProveedores');

      // Validar que los proveedores se cargan correctamente
      cy.wait('@getProveedores');
      cy.get('#providerTable tbody tr').should('have.length', 2);

      // Validar datos del primer proveedor
      cy.get('#providerTable tbody tr').eq(0).within(() => {
          cy.get('th').should('contain', '1'); // ID
          cy.get('td').eq(0).should('contain', 'Proveedor 1'); // Nombre
          cy.get('td').eq(1).should('contain', 'RFC12345'); // RFC
          cy.get('td').eq(2).should('contain', 'Dirección 1'); // Dirección
          cy.get('td').eq(3).should('contain', '1234567890'); // Teléfono
          cy.get('td').eq(4).should('contain', 'proveedor1@example.com'); // Correo
          cy.get('td').eq(5).should('contain', 'Activo'); // Estado
      });

      // Validar datos del segundo proveedor
      cy.get('#providerTable tbody tr').eq(1).within(() => {
          cy.get('th').should('contain', '2'); // ID
          cy.get('td').eq(0).should('contain', 'Proveedor 2'); // Nombre
          cy.get('td').eq(1).should('contain', 'RFC67890'); // RFC
          cy.get('td').eq(2).should('contain', 'Dirección 2'); // Dirección
          cy.get('td').eq(3).should('contain', '0987654321'); // Teléfono
          cy.get('td').eq(4).should('contain', 'proveedor2@example.com'); // Correo
          cy.get('td').eq(5).should('contain', 'Inactivo'); // Estado
      });
  });
});


describe('Pruebas de Registro de Productos', () => {
  const API_URL = 'http://localhost:8080/producto';
  const FRONT_URL = 'http://127.0.0.1:5500/templates/ConsultProduct.html';

  beforeEach(() => {
      cy.visit(FRONT_URL, {
          onBeforeLoad: (win) => {
              win.localStorage.setItem('authToken', 'fake-jwt-token'); // Configurar un token simulado
          },
      });
  });

  it('Debería registrar correctamente un nuevo producto', () => {
      // Interceptar la solicitud POST para agregar un producto
      cy.intercept('POST', API_URL, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              message: 'Producto registrado exitosamente',
          },
      }).as('postProducto');

      // Abrir el modal para agregar un nuevo producto
      cy.get('#addProductButton').click();

      // Llenar el formulario
      cy.get('#productName').type('Producto Nuevo');
      cy.get('#precioUnitario').type('100');
      cy.get('#categoryId').select('1');
      cy.get('#cantidad').type('10');

      // Enviar el formulario
      cy.get('#registerProductButton').click();

      // Validar que la solicitud POST se realizó correctamente
      cy.wait('@postProducto').its('response.statusCode').should('eq', 200);
  });
});



describe('Pruebas de Consulta de Productos', () => {
  const API_URL = 'http://localhost:8080/producto';
  const FRONT_URL = 'http://127.0.0.1:5500/templates/ConsultProduct.html';

  beforeEach(() => {
      cy.visit(FRONT_URL, {
          onBeforeLoad: (win) => {
              win.localStorage.setItem('authToken', 'fake-jwt-token'); // Configurar un token simulado
          },
      });
  });

  it('Debería mostrar correctamente los productos en la tabla', () => {
      // Interceptar la solicitud GET para cargar productos
      cy.intercept('GET', `${API_URL}/all`, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              result: [
                  {
                      id: 1,
                      nombre: 'Producto 1',
                      precioUnitario: 100,
                      cantidad: 10,
                      categorias: { id: 1, name: 'Categoría 1' },
                      status: true,
                  },
                  {
                      id: 2,
                      nombre: 'Producto 2',
                      precioUnitario: 200,
                      cantidad: 20,
                      categorias: { id: 2, name: 'Categoría 2' },
                      status: false,
                  },
              ],
          },
      }).as('getProductos');

      // Validar que los productos se cargan correctamente
      cy.wait('@getProductos');
      cy.get('#productos-table tbody tr').should('have.length', 2);
  });
});



describe('Pruebas de Actualización de Productos', () => {
  const API_URL = 'http://localhost:8080/producto';
  const FRONT_URL = 'http://127.0.0.1:5500/templates/ConsultProduct.html';

  beforeEach(() => {
      cy.visit(FRONT_URL, {
          onBeforeLoad: (win) => {
              win.localStorage.setItem('authToken', 'fake-jwt-token'); // Configurar un token simulado
          },
      });
  });

  it('Debería actualizar correctamente un producto existente', () => {
      // Interceptar la solicitud GET para cargar productos
      cy.intercept('GET', `${API_URL}/all`, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              result: [
                  {
                      id: 1,
                      nombre: 'Producto 1',
                      precioUnitario: 100,
                      cantidad: 10,
                      categorias: { id: 1, name: 'Categoría 1' },
                      status: true,
                  },
              ],
          },
      }).as('getProductos');

      // Validar que los productos se cargan correctamente
      cy.wait('@getProductos');

      // Interceptar la solicitud PUT para actualizar el producto
      cy.intercept('PUT', API_URL, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              message: 'Producto actualizado exitosamente',
          },
      }).as('updateProducto');

      // Abrir el modal de edición
      cy.get('#productos-table tbody tr').first().within(() => {
          cy.get('button').contains('Editar').click();
      });

      // Editar los datos en el formulario
      cy.get('#productName').clear().type('Producto Actualizado');
      cy.get('#precioUnitario').clear().type('150');
      cy.get('#categoryId').select('2');
      cy.get('#cantidad').clear().type('15');

      // Guardar los cambios
      cy.get('#registerProductButton').click();

      // Validar que la solicitud PUT se realizó correctamente
      cy.wait('@updateProducto').its('response.statusCode').should('eq', 200);
  });
});




describe('Pruebas de Cambio de Estado de Productos', () => {
  const API_URL = 'http://localhost:8080/producto';
  const FRONT_URL = 'http://127.0.0.1:5500/templates/ConsultProduct.html';

  beforeEach(() => {
      cy.visit(FRONT_URL, {
          onBeforeLoad: (win) => {
              win.localStorage.setItem('authToken', 'fake-jwt-token'); // Configurar un token simulado
          },
      });
  });

  it('Debería cambiar correctamente el estado de un producto', () => {
      // Interceptar la solicitud GET para cargar productos
      cy.intercept('GET', `${API_URL}/all`, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              result: [
                  {
                      id: 1,
                      nombre: 'Producto 1',
                      precioUnitario: 100,
                      cantidad: 10,
                      categorias: { id: 1, name: 'Categoría 1' },
                      status: true,
                  },
              ],
          },
      }).as('getProductos');

      // Validar que los productos se cargan correctamente
      cy.wait('@getProductos');

      // Interceptar la solicitud PUT para cambiar el estado del producto
      cy.intercept('PUT', `${API_URL}/estado`, {
          statusCode: 200,
          body: {
              type: 'SUCCESS',
              message: 'Estado del producto actualizado',
          },
      }).as('changeStateProducto');

      // Cambiar el estado del primer producto
      cy.get('#productos-table tbody tr').first().within(() => {
          cy.get('button').contains('Desactivar').click();
      });

      // Validar que la solicitud PUT se realizó correctamente
      cy.wait('@changeStateProducto').its('response.statusCode').should('eq', 200);
  });
});
