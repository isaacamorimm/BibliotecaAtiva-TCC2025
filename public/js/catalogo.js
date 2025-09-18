// public/js/catalogo.js

// Funcionalidade de busca (o código existente a partir daqui permanece)
function filterBooks() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const books = document.querySelectorAll('.book-item');
    let visibleBooks = 0;
    
    books.forEach(book => {
        const title = book.querySelector('.book-title').textContent.toLowerCase();
        const author = book.querySelector('.book-author').textContent.toLowerCase();
        const category = book.querySelector('.book-detail:nth-child(2)').textContent.toLowerCase();
        
        if (title.includes(searchText) || author.includes(searchText) || category.includes(searchText)) {
            book.style.display = 'block';
            visibleBooks++;
        } else {
            book.style.display = 'none';
        }
    });
    
    // Exibir ou ocultar mensagem de estado vazio
    const emptyState = document.querySelector('.empty-state');
    if (emptyState) {
        emptyState.style.display = visibleBooks === 0 ? 'block' : 'none';
    }
}

// Adiciona evento de busca ao campo de entrada
document.getElementById('searchInput').addEventListener('keyup', filterBooks);

// O código restante do arquivo, se houver, deve ser mantido.
// Apenas a parte do 'mobile-menu-btn' deve ser removida.