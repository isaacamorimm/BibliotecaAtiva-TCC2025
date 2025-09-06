// Mobile menu toggle
    document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
        document.querySelector('.nav-menu').classList.toggle('active');
    });

    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-btn')) {
            document.querySelector('.nav-menu').classList.remove('active');
        }
    });

    document.querySelectorAll('form[action*="remover"]').forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!confirm('Tem certeza que deseja remover este livro?')) {
                e.preventDefault();
            }
        });
    });
