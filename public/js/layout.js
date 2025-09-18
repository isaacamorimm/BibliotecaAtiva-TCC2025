// public/js/layout.js

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function(event) {
            event.stopPropagation(); // Impede que o evento de clique se propague para o document
            navMenu.classList.toggle('active');
        });
    }

    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('active')) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnBtn = mobileMenuBtn && mobileMenuBtn.contains(event.target);

            if (!isClickInsideNav && !isClickOnBtn) {
                navMenu.classList.remove('active');
            }
        }
    });
});