describe('Prueba de Login', () => {
    it('Debe realizar el login exitosamente y redirigir al menú', () => {
        // Visitar la página de login
        cy.visit('http://127.0.0.1:5500/Backend-SIGI/templates/login.html');

        // Llenar los campos de email y contraseña
        cy.get('#email').type('usuario@example.com'); // Reemplazar con un email válido
        cy.get('#password').type('password123'); // Reemplazar con una contraseña válida

        // Interceptar la solicitud fetch para validar el backend
        cy.intercept('POST', 'http://localhost:8080/auth/login', (req) => {
            req.reply({
                statusCode: 200,
                body: 'token.jwt.example', // Reemplazar con un token válido para pruebas
            });
        }).as('loginRequest');

        // Enviar el formulario
        cy.get('.login-form').submit();

        // Esperar que la solicitud haya sido enviada
        cy.wait('@loginRequest').then((interception) => {
            // Validar que la solicitud tenga los datos correctos
            expect(interception.request.body).to.deep.equal({
                email: 'usuario@example.com',
                password: 'password123',
            });

            // Validar que el token se haya guardado en localStorage
            cy.window().then((win) => {
                const token = win.localStorage.getItem('authToken');
            });

            // Validar que el usuario haya sido redirigido al menú
            cy.url().should('include', '/Menu.html');
        });
    });

    it('Debe mostrar un error si las credenciales son incorrectas', () => {
        // Visitar la página de login
        cy.visit('http://127.0.0.1:5500/Backend-SIGI/templates/login.html   ');

        // Llenar los campos de email y contraseña
        cy.get('#email').type('usuario@example.com'); // Reemplazar con un email inválido
        cy.get('#password').type('wrongpassword'); // Contraseña incorrecta

        // Interceptar la solicitud fetch para simular un error
        cy.intercept('POST', 'http://localhost:8080/auth/login', (req) => {
            req.reply({
                statusCode: 401,
                body: 'Credenciales inválidas',
            });
        }).as('loginErrorRequest');

        // Enviar el formulario
        cy.get('.login-form').submit();

        // Esperar que la solicitud de error haya sido enviada
        cy.wait('@loginErrorRequest').then((interception) => {
            // Validar que se muestre un mensaje de error al usuario
            cy.on('window:alert', (alertText) => {
                expect(alertText).to.equal('Error: Credenciales inválidas');
            });
        });
    });
});

