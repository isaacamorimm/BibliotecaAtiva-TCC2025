// Mobile menu toggle
    document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
        document.querySelector('.nav-menu').classList.toggle('active');
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-btn')) {
            document.querySelector('.nav-menu').classList.remove('active');
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        const form = document.querySelector('form');
        
        form.addEventListener('submit', function(e) {
            const ano = document.getElementById('ano').value;
            const currentYear = new Date().getFullYear();
            
            if (ano < 1450 || ano > currentYear) {
                e.preventDefault();
                alert('O ano deve estar entre 1450 e ' + currentYear);
                return false;
            }
        });
});
