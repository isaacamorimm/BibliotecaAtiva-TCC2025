document.addEventListener('DOMContentLoaded', function() {
    
      const passwordInput = document.getElementById('senha');
      const togglePasswordBtn = document.getElementById('toggleSenha');
      
      togglePasswordBtn.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          passwordInput.style.fontFamily = 'inherit';
          passwordInput.style.letterSpacing = 'normal';
          togglePasswordBtn.innerHTML = '<i class="far fa-eye-slash"></i>';
        } else {
          passwordInput.type = 'password';
          passwordInput.style.fontFamily = 'inherit';
          passwordInput.style.letterSpacing = 'normal';
          togglePasswordBtn.innerHTML = '<i class="far fa-eye"></i>';
        }
        passwordInput.focus();
      });
});
 