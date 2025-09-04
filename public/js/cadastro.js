document.addEventListener('DOMContentLoaded', function() {
      // Elementos do DOM
      const passwordInput = document.getElementById('senha');
      const confirmPasswordInput = document.getElementById('confirmarSenha');
      const passwordStrength = document.getElementById('passwordStrength');
      const passwordFeedback = document.getElementById('passwordFeedback');
      const confirmPasswordFeedback = document.getElementById('confirmPasswordFeedback');
      const togglePasswordBtn = document.getElementById('toggleSenha');
      const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmSenha');
      
      // Estado inicial
      passwordFeedback.textContent = 'Digite pelo menos 8 caracteres';
      
      // Funcionalidade para mostrar/ocultar senha
      function setupPasswordToggle(button, input) {
        button.addEventListener('click', function() {
          if (input.type === 'password') {
            input.type = 'text';
            button.innerHTML = '<i class="far fa-eye-slash"></i>';
          } else {
            input.type = 'password';
            button.innerHTML = '<i class="far fa-eye"></i>';
          }
          input.focus();
        });
      }
      
      setupPasswordToggle(togglePasswordBtn, passwordInput);
      setupPasswordToggle(toggleConfirmPasswordBtn, confirmPasswordInput);
      
      // Verificador de força da senha
      passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        // Reset
        passwordStrength.className = 'strength-meter';
        
        if (password.length === 0) {
          passwordFeedback.textContent = 'Digite pelo menos 8 caracteres';
          passwordStrength.style.width = '0%';
          return;
        }
        
        // Calcular força
        let strength = 0;
        let feedback = '';
        
        // Verificar comprimento
        if (password.length >= 8) strength += 20;
        if (password.length >= 12) strength += 10;
        
        // Verificar variedade de caracteres
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 20;
        if (/[^A-Za-z0-9]/.test(password)) strength += 30;
        
        // Limitar a 100%
        strength = Math.min(strength, 100);
        
        // Atualizar visual e feedback
        passwordStrength.style.width = strength + '%';
        
        if (strength < 40) {
          passwordStrength.classList.add('strength-weak');
          feedback = 'Senha fraca';
        } else if (strength < 70) {
          passwordStrength.classList.add('strength-medium');
          feedback = 'Senha média';
        } else {
          passwordStrength.classList.add('strength-strong');
          feedback = 'Senha forte!';
        }
        
        passwordFeedback.textContent = feedback;
        
        // Verificar se as senhas coincidem
        validatePasswordMatch();
      });
      
      // Validar correspondência de senhas
      function validatePasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword.length > 0 && password !== confirmPassword) {
          confirmPasswordFeedback.textContent = 'As senhas não coincidem';
          confirmPasswordFeedback.style.color = 'var(--error)';
        } else {
          confirmPasswordFeedback.textContent = '';
        }
      }
      
      confirmPasswordInput.addEventListener('input', validatePasswordMatch);
 });
