document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('change-password-form');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const messageDiv = document.getElementById('message');
  const messageText = document.getElementById('message-text');

  // Recuperar el correo del localStorage (de pasos anteriores)
  const email = localStorage.getItem('validatedEmail');
  if (!email) {
      alert('Correo no encontrado. Por favor, regrese y valide su correo.');
      window.location.href = 'RecoverPass.html'; // Redirigir a la página inicial si no hay correo
      return;
  }

  form.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevenir el envío predeterminado del formulario

      const password = passwordInput.value.trim();
      const confirmPassword = confirmPasswordInput.value.trim();

      // Validar que las contraseñas coincidan
      if (password !== confirmPassword) {
          showMessage('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.', 'danger');
          return;
      }

      // Validar que la contraseña no esté vacía y cumpla con los requisitos mínimos
      if (password.length < 6) {
          showMessage('La contraseña debe tener al menos 6 caracteres.', 'danger');
          return;
      }

      try {
          // Enviar la solicitud al servidor
          const response = await fetch('http://localhost:8080/consultor/change-password', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email, password })
          });

          if (response.ok) {
              // Mostrar mensaje de éxito
              showMessage('Contraseña actualizada con éxito.', 'success');
              // Opcional: Redirigir al usuario a la página de inicio de sesión
              setTimeout(() => {
                  window.location.href = 'login.html';
              }, 3000);
          } else {
              // Manejar errores del servidor
              const errorData = await response.json();
              showMessage(errorData.message || 'Ocurrió un error al actualizar la contraseña.', 'danger');
          }
      } catch (error) {
          // Manejo de errores en el cliente
          console.error('Error en el cliente:', error);
          showMessage('No se pudo conectar con el servidor. Inténtelo más tarde.', 'danger');
      }
  });

  // Función para mostrar mensajes en la interfaz
  function showMessage(message, type) {
      messageText.textContent = message;
      messageDiv.className = `alert alert-${type} alert-dismissible`; // Cambiar el tipo de alerta según el mensaje
      messageDiv.style.display = 'block'; // Mostrar el mensaje
  }
});
