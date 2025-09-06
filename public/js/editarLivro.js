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

const btnBuscarCapa = document.getElementById('btnBuscarCapa');
    const resultadosDiv = document.getElementById('resultados-capas');
    const inputTitulo = document.getElementById('titulo');
    const inputAutor = document.getElementById('autor');
    const inputCapaUrl = document.getElementById('capa_url');

    if (btnBuscarCapa) {
        btnBuscarCapa.addEventListener('click', async () => {
            const titulo = inputTitulo.value.trim();
            const autor = inputAutor.value.trim();
            
            if (!titulo) {
                alert('Por favor, digite o título do livro para buscar a capa.');
                return;
            }

            resultadosDiv.innerHTML = '<div class="loader"></div>'; // Mostra um spinner de loading
            const termoBusca = `${titulo} ${autor}`;

            try {
                const response = await fetch(`/catalogo/api/buscar-capa?q=${encodeURIComponent(termoBusca)}`);
                const livros = await response.json();

                resultadosDiv.innerHTML = ''; // Limpa o loader

                if (livros.length === 0) {
                    resultadosDiv.innerHTML = '<p class="form-text">Nenhuma capa encontrada.</p>';
                    return;
                }

                livros.forEach(livro => {
                    const imgContainer = document.createElement('div');
                    imgContainer.classList.add('capa-item');
                    
                    const img = document.createElement('img');
                    img.src = livro.capaUrl;
                    img.alt = `Capa de ${livro.titulo}`;
                    img.title = `Selecionar capa de: ${livro.titulo}`;
                    
                    img.addEventListener('click', () => {
                        // Remove a seleção de outras imagens
                        document.querySelectorAll('.capa-item.selected').forEach(item => item.classList.remove('selected'));
                        
                        // Adiciona a seleção a este container
                        imgContainer.classList.add('selected');
                        
                        // Guarda a URL no campo oculto!
                        inputCapaUrl.value = livro.capaUrl;
                    });

                    imgContainer.appendChild(img);
                    resultadosDiv.appendChild(imgContainer);
                });

            } catch (error) {
                resultadosDiv.innerHTML = '<p class="form-text error-text">Erro ao buscar capas. Tente novamente.</p>';
                console.error(error);
            }
        });
}
