// Toggle mobile menu
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-menu') && 
            !event.target.closest('.mobile-menu-btn') && 
            navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
    
    // Prevenir envio duplo dos formulários
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
                
                // Restaurar após 5 segundos (caso haja erro)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }, 5000);
            }
        });
    });
});

// Funções para edição de comentários
function mostrarFormularioEdicao(comentarioId) {
    const textoComentario = document.getElementById(`texto-comentario-${comentarioId}`);
    const formEdicao = document.getElementById(`form-editar-${comentarioId}`);
    
    if (textoComentario && formEdicao) {
        textoComentario.style.display = 'none';
        formEdicao.style.display = 'block';
    }
}

function cancelarEdicao(comentarioId) {
    const textoComentario = document.getElementById(`texto-comentario-${comentarioId}`);
    const formEdicao = document.getElementById(`form-editar-${comentarioId}`);
    
    if (textoComentario && formEdicao) {
        textoComentario.style.display = 'block';
        formEdicao.style.display = 'none';
    }
}

// Função para mostrar alertas
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <i class="fas ${type === 'error' ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i>
        <span>${message}</span>
    `;
    
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
        
        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

// Mostrar alertas da URL
function showUrlAlerts() {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    
    if (success) {
        showAlert(decodeURIComponent(success), 'success');
    }
    
    if (error) {
        showAlert(decodeURIComponent(error), 'error');
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    showUrlAlerts();
});

// Fallback para funções globais
if (typeof window.mostrarFormularioEdicao === 'undefined') {
    window.mostrarFormularioEdicao = mostrarFormularioEdicao;
    window.cancelarEdicao = cancelarEdicao;
}