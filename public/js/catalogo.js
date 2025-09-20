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
            navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                filterBooks();
            }
        });
    }
});

// Filter books function
function filterBooks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const bookItems = document.querySelectorAll('.book-item');
    let visibleCount = 0;
    
    bookItems.forEach(item => {
        const title = item.querySelector('.book-title').textContent.toLowerCase();
        const author = item.querySelector('.book-author').textContent.toLowerCase();
        const category = item.querySelector('.book-detail:nth-child(2)').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || author.includes(searchTerm) || category.includes(searchTerm)) {
            item.style.display = 'block';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show empty state if no books match
    const emptyState = document.querySelector('.empty-state');
    if (emptyState) {
        if (visibleCount === 0 && searchTerm !== '') {
            emptyState.style.display = 'block';
            emptyState.querySelector('.empty-title').textContent = 'Nenhum livro encontrado';
            emptyState.querySelector('.empty-text').textContent = 'Não encontramos livros que correspondam à sua busca.';
        } else {
            emptyState.style.display = 'none';
        }
    }
}