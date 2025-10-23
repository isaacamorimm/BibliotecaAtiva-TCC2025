// public/js/layout.js

document.addEventListener('DOMContentLoaded', function() {
    const userMenuToggle = document.querySelector('.user-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (userMenuToggle && navMenu) {
        
        // 1. Pega o nome do usuário para o link de perfil
        const userName = userMenuToggle.querySelector('.user-name')?.textContent || 'Meu Perfil';
        
        // 2. Cria o link "Ver Perfil"
        const profileLinkLi = document.createElement('li');
        profileLinkLi.classList.add('nav-profile-link-mobile'); // Classe para estilizar
        profileLinkLi.innerHTML = `<a href="/perfil" class="nav-link">
                                     <i class="fas fa-user-circle"></i> 
                                     Ver ${userName}
                                   </a>`;
        
        // 3. Adiciona o link "Ver Perfil" no final do menu de navegação
        navMenu.appendChild(profileLinkLi);

        // 4. Adiciona o evento de clique no botão de PERFIL
        userMenuToggle.addEventListener('click', function(event) {
            // Verifica o tamanho da tela (deve ser o mesmo breakpoint do CSS)
            const isMobile = window.innerWidth <= 768; 

            if (isMobile) {
                // No mobile, impede que o link vá para /perfil
                event.preventDefault(); 
                // Em vez disso, abre ou fecha o menu dropdown
                navMenu.classList.toggle('active');
            }
            // Em telas de desktop, o 'if' falha e o link funciona normalmente
        });
    }

    // 5. Fecha o menu ao clicar fora dele (lógica melhorada)
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('active')) {
            // Verifica se o clique foi DENTRO do menu ou no PRÓPRIO botão
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = userMenuToggle && userMenuToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle) {
                navMenu.classList.remove('active');
            }
        }
    });
});