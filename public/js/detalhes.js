function mostrarFormularioEdicao(comentarioId) {
    document.getElementById('texto-comentario-' + comentarioId).style.display = 'none';
    document.getElementById('form-editar-' + comentarioId).style.display = 'block';
}

function cancelarEdicao(comentarioId) {
    document.getElementById('texto-comentario-' + comentarioId).style.display = 'block';
    document.getElementById('form-editar-' + comentarioId).style.display = 'none';
}
document.addEventListener('DOMContentLoaded', function() {
    // Pega os formulários e botões pelos seus IDs
    const formComentario = document.getElementById('form-comentario');
    const btnComentar = document.getElementById('btnComentar');
    const formAvaliar = document.getElementById('formAvaliar');
    const btnAvaliar = document.getElementById('btnAvaliar');
    const formFavoritar = document.getElementById('formFavoritar');
    const btnFavoritar = document.getElementById('btnFavoritar');

    // Função para desabilitar botão e mostrar loading
    function desabilitarBotao(botao, texto = 'Enviando...') {
        if (botao) {
            botao.disabled = true;
            botao.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${texto}`;
        }
    }

    // Adiciona o evento de "submit" para cada formulário
    if (formComentario) {
        formComentario.addEventListener('submit', function() {
            desabilitarBotao(btnComentar);
        });
    }

    if (formAvaliar) {
        formAvaliar.addEventListener('submit', function() {
            desabilitarBotao(btnAvaliar);
        });
    }

    if (formFavoritar) {
        formFavoritar.addEventListener('submit', function() {
            // Verifica se o texto do botão contém a palavra "Favoritar" para personalizar a mensagem
            const acao = btnFavoritar.innerText.includes('Desfavoritar') ? 'Removendo...' : 'Adicionando...';
            desabilitarBotao(btnFavoritar, acao);
        });
    }



});