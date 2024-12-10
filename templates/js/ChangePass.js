document.addEventListener('DOMContentLoaded', function () {

    const email = localStorage.getItem('email');
    const token = localStorage.getItem('jwt');
  
    if (email) {
      document.getElementById('email').value = email;
    } else {
      window.location.href = '../index.html';
    }
  
    if (!token) {
      window.location.href = '../index.html';
    }
  
    const changePasswordForm = document.getElementById('change-password-form');
    const messageElement = document.getElementById('message');
    const messageText = document.getElementById('message-text');
  
    function showMessage(type, message) {
      messageElement.className = `alert alert-${type}`;
      messageText.textContent = message;
      messageElement.style.display = 'block';
  
      setTimeout(() => {
        messageElement.style.display = 'none';
      }, 5000);
    }
  
    changePasswordForm.addEventListener('submit', async function (event) {
      event.preventDefault();
  
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const confirmPassword = document.getElementById('confirm-password').value.trim();
  
      if (!password || password.length < 6) {
        showMessage('warning', 'La contraseña debe tener al menos 6 caracteres.');
        return;
      }
  
      if (password !== confirmPassword) {
        showMessage('warning', 'Las contraseñas no coinciden.');
        return;
      }
  
      try {
        showMessage('info', 'Cambiando la contraseña, por favor espera...');
  
        const response = await fetch('http://localhost:8080/user/change-pass', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        });
  
        const result = await response.json();
  
        if (response.ok) {
          showMessage('success', 'Contraseña actualizada correctamente. Ahora puedes iniciar sesión con tu nueva contraseña.');
          setTimeout(() => {
  
            localStorage.removeItem('jwt');
            localStorage.removeItem('userId');
            localStorage.removeItem('email');
            localStorage.removeItem('expiration');
  
            window.location.href = '../index.html';
          }, 3000);
        } else {
          showMessage('danger', result.text || 'Hubo un problema al cambiar la contraseña.');
        }
      } catch (error) {
        showMessage('danger', 'Error al cambiar la contraseña. Intenta nuevamente más tarde.');
      }
    });
  });