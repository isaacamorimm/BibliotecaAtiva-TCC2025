

    document.querySelectorAll('form[action*="remover"]').forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!confirm('Tem certeza que deseja remover este livro?')) {
                e.preventDefault();
            }
        });
    });
