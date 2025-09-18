document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Fecha o menu ao clicar fora
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnBtn = mobileMenuBtn.contains(event.target);

        if (!isClickInsideNav && !isClickOnBtn && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
});