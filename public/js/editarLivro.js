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
    
    // Buscar capas online - com verificação de elementos
    const btnBuscarCapa = document.getElementById('btnBuscarCapa');
    const resultadosCapas = document.getElementById('resultados-capas');
    const inputCapaUrl = document.getElementById('capa_url');
    
    if (btnBuscarCapa && resultadosCapas) {
        btnBuscarCapa.addEventListener('click', function() {
            const titulo = document.getElementById('titulo')?.value || '';
            const autor = document.getElementById('autor')?.value || '';
            
            if (!titulo && !autor) {
                showAlert('Digite pelo menos o título ou autor para buscar capas', 'error');
                return;
            }
            
            // Simulação de busca de capas
            btnBuscarCapa.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
            btnBuscarCapa.disabled = true;
            
            setTimeout(() => {
                resultadosCapas.innerHTML = `
                    <div class="capa-option">
                        <img src="https://via.placeholder.com/150x200/9e4a3c/ffffff?text=Capa+1" 
                             alt="Capa alternativa 1" 
                             onclick="selecionarCapa(this.src)">
                    </div>
                    <div class="capa-option">
                        <img src="https://via.placeholder.com/150x200/9e4a3c/ffffff?text=Capa+2" 
                             alt="Capa alternativa 2" 
                             onclick="selecionarCapa(this.src)">
                    </div>
                    <div class="capa-option">
                        <img src="https://via.placeholder.com/150x200/9e4a3c/ffffff?text=Capa+3" 
                             alt="Capa alternativa 3" 
                             onclick="selecionarCapa(this.src)">
                    </div>
                `;
                
                resultadosCapas.style.display = 'grid';
                btnBuscarCapa.innerHTML = '<i class="fas fa-search"></i> Buscar Nova Capa Online';
                btnBuscarCapa.disabled = false;
                
                showAlert('Foram encontradas 3 capas disponíveis. Clique em uma para selecionar.', 'success');
            }, 1500);
        });
    }
    
    // Remover capa atual - com verificação de elemento
    const btnRemoverCapa = document.getElementById('btnRemoverCapa');
    if (btnRemoverCapa && inputCapaUrl) {
        btnRemoverCapa.addEventListener('click', function() {
            inputCapaUrl.value = '';
            const capaAtualImg = document.querySelector('.capa-atual');
            if (capaAtualImg) {
                capaAtualImg.style.display = 'none';
            }
            showAlert('Capa removida. Lembre-se de salvar as alterações.', 'success');
        });
    }
    
    // Prevenir envio duplo do formulário - com verificação
    const form = document.querySelector('.book-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const btnAtualizar = document.getElementById('btnAtualizar');
            if (btnAtualizar) {
                btnAtualizar.disabled = true;
                btnAtualizar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Atualizando...';
            }
            
            // Validação do formulário
            if (!validateForm()) {
                e.preventDefault();
                if (btnAtualizar) {
                    btnAtualizar.disabled = false;
                    btnAtualizar.innerHTML = '<i class="fas fa-save"></i> Atualizar Livro';
                }
            }
        });
    }
    
    // Mostrar alertas da URL
    showUrlAlerts();
});

// Função para mostrar alertas
function showAlert(message, type) {
    try {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `
            <i class="fas ${type === 'error' ? 'fa-exclamation-triangle' : 'fa-check-circle'} alert-icon"></i>
            <div class="alert-content">${message}</div>
        `;
        
        const container = document.querySelector('.container');
        const pageHeader = document.querySelector('.page-header');
        
        if (container && pageHeader) {
            container.insertBefore(alertDiv, pageHeader.nextSibling);
            
            // Remover automaticamente após 5 segundos
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 5000);
        }
    } catch (error) {
        console.error('Erro ao mostrar alerta:', error);
    }
}

// Função para validar formulário
function validateForm() {
    const titulo = document.getElementById('titulo')?.value.trim();
    const autor = document.getElementById('autor')?.value.trim();
    const ano = document.getElementById('ano')?.value;
    const categoria = document.getElementById('categoria')?.value;
    
    let isValid = true;
    
    // Limpar erros anteriores
    document.querySelectorAll('.form-error').forEach(error => error.remove());
    document.querySelectorAll('.form-input').forEach(input => input.classList.remove('error'));
    
    if (!titulo) {
        showFieldError('titulo', 'Título é obrigatório');
        isValid = false;
    }
    
    if (!autor) {
        showFieldError('autor', 'Autor é obrigatório');
        isValid = false;
    }
    
    if (!ano || ano < 1450 || ano > new Date().getFullYear() + 1) {
        showFieldError('ano', 'Ano de publicação inválido');
        isValid = false;
    }
    
    if (!categoria) {
        showFieldError('categoria', 'Selecione uma categoria');
        isValid = false;
    }
    
    return isValid;
}

// Função para mostrar erro em campo específico
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Função para mostrar alertas da URL
function showUrlAlerts() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const success = urlParams.get('success');
        const error = urlParams.get('error');
        
        if (success) {
            showAlert(decodeURIComponent(success), 'success');
        }
        
        if (error) {
            showAlert(decodeURIComponent(error), 'error');
        }
    } catch (error) {
        console.error('Erro ao processar alertas da URL:', error);
    }
}

// Função global para selecionar capa
function selecionarCapa(url) {
    try {
        const inputCapaUrl = document.getElementById('capa_url');
        if (inputCapaUrl) {
            inputCapaUrl.value = url;
        }
        
        // Destacar a capa selecionada
        document.querySelectorAll('.capa-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        if (event && event.target && event.target.parentElement) {
            event.target.parentElement.classList.add('selected');
        }
        
        // Atualizar visualização da capa
        const capaAtual = document.querySelector('.capa-atual');
        if (capaAtual && capaAtual.tagName === 'IMG') {
            capaAtual.src = url;
            capaAtual.style.display = 'block';
        }
        
        showAlert('Capa selecionada com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao selecionar capa:', error);
        showAlert('Erro ao selecionar capa. Tente novamente.', 'error');
    }
}

// Fallback para caso a função global não esteja disponível
if (typeof window.selecionarCapa === 'undefined') {
    window.selecionarCapa = selecionarCapa;
}