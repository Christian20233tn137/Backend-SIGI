document.addEventListener('DOMContentLoaded', () => {
    const codeBoxes = document.querySelectorAll('.code-box');
    const verifyButton = document.querySelector('.verify-button');

    // Recuperar el correo almacenado en localStorage
    const email = localStorage.getItem('validatedEmail');
    if (!email) {
        alert('Correo no encontrado. Por favor, regrese y valide su correo.');
        window.location.href = 'login.html'; // Redirigir a la página inicial si el correo no está disponible
        return;
    }

    verifyButton.addEventListener('click', async () => {
        const code = Array.from(codeBoxes).map(box => box.value.trim()).join('');

        if (code.length !== 5 || !/^\d{5}$/.test(code)) {
            alert('Por favor, ingrese un código de 5 dígitos válido.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/consultor/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code, email }) // Usar el correo recuperado
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message || 'Código verificado con éxito.');
                window.location.href = 'ChangePass.html';
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'El código ingresado o el correo son incorrectos.');
            }
        } catch (error) {
            console.error('Error en el cliente:', error);
            alert('No se pudo conectar con el servidor. Inténtelo más tarde.');
        }
    });
});
