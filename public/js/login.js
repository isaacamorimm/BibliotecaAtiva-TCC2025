 document.addEventListener('DOMContentLoaded', function() {
      const passwordInput = document.getElementById('senha');
      const togglePasswordBtn = document.getElementById('toggleSenha');
      
      togglePasswordBtn.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          togglePasswordBtn.innerHTML = '<i class="far fa-eye-slash"></i>';
        } else {
          passwordInput.type = 'password';
          togglePasswordBtn.innerHTML = '<i class="far fa-eye"></i>';
        }
        passwordInput.focus();
      });
});
