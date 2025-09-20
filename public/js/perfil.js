// Função para alternar entre visualização e edição
function toggleEditForm() {
    const displayInfo = document.querySelector('.profile-card:first-child');
    const editForm = document.getElementById('edit-form');
    
    if (editForm.style.display === 'none') {
        displayInfo.style.opacity = '0';
        setTimeout(() => {
            displayInfo.style.display = 'none';
            editForm.style.display = 'block';
            setTimeout(() => editForm.style.opacity = '1', 50);
        }, 200);
    } else {
        editForm.style.opacity = '0';
        setTimeout(() => {
            editForm.style.display = 'none';
            displayInfo.style.display = 'block';
            setTimeout(() => displayInfo.style.opacity = '1', 50);
        }, 200);
    }
}

// Navegação por abas
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Remove classe active de todos os botões e painéis
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            
            // Adiciona classe active ao botão clicado
            button.classList.add('active');
            
            // Mostra o painel correspondente
            const tabId = 'tab-' + button.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Funcionalidades dos Favoritos
function initFavorites() {
    // Busca em tempo real
    const searchInput = document.getElementById('search-favorites');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const favoriteItems = document.querySelectorAll('.favorite-item');
            
            favoriteItems.forEach(item => {
                const title = item.dataset.title;
                const author = item.dataset.author;
                
                if (title.includes(searchTerm) || author.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Remover favorito
    document.querySelectorAll('.favorite-remove').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const bookId = this.dataset.bookId;
            const favoriteItem = this.closest('.favorite-item');
            
            // Animação de remoção
            favoriteItem.classList.add('removing');
            
            // Confirmar remoção
            if (confirm('Tem certeza que deseja remover este livro dos favoritos?')) {
                // Simular requisição AJAX para remover
                setTimeout(() => {
                    favoriteItem.style.opacity = '0';
                    favoriteItem.style.height = '0';
                    favoriteItem.style.margin = '0';
                    favoriteItem.style.padding = '0';
                    
                    setTimeout(() => {
                        favoriteItem.remove();
                        updateFavoritesCount();
                        
                        // Mostrar mensagem de sucesso
                        showMessage('Livro removido dos favoritos!', 'success');
                    }, 300);
                }, 500);
            } else {
                favoriteItem.classList.remove('removing');
            }
        });
    });
    
    // Ordenar favoritos
    const sortButton = document.getElementById('sort-favorites');
    if (sortButton) {
        sortButton.addEventListener('click', function() {
            const favoritesGrid = document.querySelector('.favorites-grid');
            const favoriteItems = Array.from(document.querySelectorAll('.favorite-item'));
            
            // Alternar entre ordenação A-Z e Z-A
            const isAscending = this.classList.toggle('sorted-asc');
            this.innerHTML = isAscending ? 
                '<i class="fas fa-sort-alpha-down"></i> A-Z' : 
                '<i class="fas fa-sort-alpha-up"></i> Z-A';
            
            // Ordenar os itens
            favoriteItems.sort((a, b) => {
                const titleA = a.querySelector('h4').textContent.toLowerCase();
                const titleB = b.querySelector('h4').textContent.toLowerCase();
                
                return isAscending ? 
                    titleA.localeCompare(titleB) : 
                    titleB.localeCompare(titleA);
            });
            
            // Reinserir os itens ordenados
            favoriteItems.forEach(item => favoritesGrid.appendChild(item));
            
            showMessage(`Favoritos ordenados ${isAscending ? 'A-Z' : 'Z-A'}`, 'success');
        });
    }
    
    // Limpar todos os favoritos
    const clearButton = document.getElementById('clear-favorites');
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja remover TODOS os livros dos favoritos?')) {
                const favoriteItems = document.querySelectorAll('.favorite-item');
                
                if (favoriteItems.length === 0) {
                    showMessage('Você não tem favoritos para limpar.', 'error');
                    return;
                }
                
                // Animação de remoção em sequência
                favoriteItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('removing');
                        item.style.opacity = '0';
                        item.style.height = '0';
                        item.style.margin = '0';
                        item.style.padding = '0';
                        
                        setTimeout(() => item.remove(), 300);
                    }, index * 100);
                });
                
                // Atualizar contador após remoção
                setTimeout(() => {
                    updateFavoritesCount();
                    showMessage('Todos os favoritos foram removidos.', 'success');
                }, favoriteItems.length * 100 + 300);
            }
        });
    }
}

// Atualizar contador de favoritos
function updateFavoritesCount() {
    const count = document.querySelectorAll('.favorite-item').length;
    const countElement = document.querySelector('.favorites-footer p');
    
    if (countElement) {
        countElement.textContent = `${count} livro(s) favoritado(s)`;
    }
    
    // Se não houver mais favoritos, mostrar estado vazio
    if (count === 0) {
        const favoritesPane = document.getElementById('tab-favorites');
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <div class="empty-icon">
                <i class="fas fa-heart"></i>
            </div>
            <h3>Nenhum livro favoritado</h3>
            <p>Você ainda não favoritou nenhum livro. Explore nosso catálogo e adicione seus favoritos!</p>
            <a href="/catalogo" class="btn btn-primary">
                <i class="fas fa-book"></i> Explorar Catálogo
            </a>
        `;
        
        favoritesPane.innerHTML = '';
        favoritesPane.appendChild(emptyState);
    }
}

// Mostrar mensagem de feedback
function showMessage(message, type = 'success') {
    // Remover mensagens anteriores
    const existingMessages = document.querySelectorAll('.message-toast');
    existingMessages.forEach(msg => msg.remove());
    
    // Criar nova mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-toast message-${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="message-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(messageDiv);
    
    // Mostrar com animação
    setTimeout(() => {
        messageDiv.classList.add('show');
    }, 10);
    
    // Remover automaticamente após 5 segundos
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }, 5000);
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar abas
    initTabs();
    
    // Configurar botões de edição
    document.getElementById('edit-profile-btn').addEventListener('click', toggleEditForm);
    document.getElementById('cancel-edit-btn').addEventListener('click', toggleEditForm);
    
    // Inicializar funcionalidades dos favoritos
    initFavorites();
    
    // Configurar validação do formulário
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value.trim();
            const sobrenome = document.getElementById('sobrenome').value.trim();
            
            if (!nome || !sobrenome) {
                showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
                return false;
            }
            
            // Simular envio bem-sucedido
            showMessage('Perfil atualizado com sucesso!', 'success');
            
            // Fechar o formulário após sucesso
            setTimeout(() => {
                toggleEditForm();
            }, 2000);
            
            return false; // Remover em produção - apenas para demonstração
        });
    }
});