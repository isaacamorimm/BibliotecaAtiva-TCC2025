function desabilitarBotao(botao, texto = 'Enviando...') {
    if (botao) {
        botao.disabled = true;
        botao.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${texto}`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const formComentario = document.getElementById('form-comentario');
    const btnComentar = document.getElementById('btnComentar');
    const formAvaliar = document.getElementById('formAvaliar');
    const btnAvaliar = document.getElementById('btnAvaliar');
    const formFavoritar = document.getElementById('formFavoritar');
    const btnFavoritar = document.getElementById('btnFavoritar');

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
            const acao = btnFavoritar.innerText.includes('Desfavoritar') ? 'Removendo...' : 'Adicionando...';
            desabilitarBotao(btnFavoritar, acao);
        });
    }

    /* === NOVA LÓGICA DO QUIZ === */
    const btnGerarQuiz = document.getElementById('btnGerarQuiz');
    const quizModalBackdrop = document.getElementById('quizModalBackdrop');
    const quizModalTitle = document.getElementById('quizModalTitle');
    const quizModalBody = document.getElementById('quizModalBody');
    const quizLoader = document.getElementById('quizLoader');
    const quizPerguntasContainer = document.getElementById('quizPerguntasContainer');
    const quizResultadoContainer = document.getElementById('quizResultadoContainer');
    const quizModalVerificarBtn = document.getElementById('quizModalVerificarBtn');
    
    // Botões de fechar
    const closeButtons = [document.getElementById('quizModalCloseBtn'), document.getElementById('quizModalCloseBtnFooter')];
    
    // Variável para guardar os dados do quiz (respostas corretas)
    let quizData = null;

    if (btnGerarQuiz) {
        // 1. ABRIR O MODAL
        btnGerarQuiz.addEventListener('click', async function() {
            const livroId = this.dataset.livroId;
            resetModal();
            quizModalBackdrop.classList.add('show');
            
            try {
                // 2. BUSCAR O QUIZ NA API (Backend)
                const response = await fetch(`/catalogo/livro/${livroId}/gerar-quiz`, {
                    method: 'POST',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Erro ao buscar quiz.');
                }

                quizData = await response.json();
                
                // 3. CONSTRUIR O HTML DO QUIZ
                construirQuiz(quizData);

            } catch (error) {
                console.error('Erro ao gerar quiz:', error);
                mostrarErroModal(error.message);
            }
        });
    }

    // 4. LÓGICA PARA CONSTRUIR O HTML
    function construirQuiz(data) {
        quizModalTitle.textContent = data.tituloQuiz;
        quizPerguntasContainer.innerHTML = ''; // Limpa perguntas antigas
        quizResultadoContainer.style.display = 'none';

        data.perguntas.forEach((pergunta, index) => {
            const perguntaItem = document.createElement('div');
            perguntaItem.className = 'quiz-pergunta-item';
            
            const perguntaTexto = document.createElement('p');
            perguntaTexto.textContent = `${index + 1}. ${pergunta.pergunta}`;
            perguntaItem.appendChild(perguntaTexto);

            const opcoesGroup = document.createElement('div');
            opcoesGroup.className = 'quiz-opcoes-group';
            
                pergunta.opcoes.forEach((opcao, i) => {
                const label = document.createElement('label');
                label.className = 'quiz-opcao-label';
                
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `pergunta-${index}`;
                input.value = i; 
                
                // Cria os spans que o CSS vai estilizar
                const customRadio = document.createElement('span');
                customRadio.className = 'quiz-radio-custom';

                const radioText = document.createElement('span');
                radioText.className = 'quiz-radio-text';
                radioText.textContent = ` ${opcao}`; 
                
                label.appendChild(input);
                label.appendChild(customRadio); 
                label.appendChild(radioText);  
                opcoesGroup.appendChild(label);
            });
            
            perguntaItem.appendChild(opcoesGroup);
            quizPerguntasContainer.appendChild(perguntaItem);
        });

        // Esconde o loader e mostra as perguntas e o botão de verificar
        quizLoader.style.display = 'none';
        quizPerguntasContainer.style.display = 'block';
        quizModalVerificarBtn.style.display = 'inline-block';
    }

    // 5. LÓGICA PARA VERIFICAR RESPOSTAS
    quizModalVerificarBtn.addEventListener('click', function() {
        if (!quizData) return;

        let pontuacao = 0;
        const totalPerguntas = quizData.perguntas.length;

        const todosPerguntasItems = document.querySelectorAll('.quiz-pergunta-item');

        todosPerguntasItems.forEach((item, index) => {
            const respostaCorreta = quizData.perguntas[index].resposta_correta_index;
            const inputSelecionado = item.querySelector(`input[name="pergunta-${index}"]:checked`);

            item.querySelector('.quiz-opcoes-group').classList.add('verificado');
            
            const labels = item.querySelectorAll('.quiz-opcao-label');
            labels.forEach((label, i) => {
                label.classList.remove('correta', 'incorreta'); // Limpa classes
                
                if (i === respostaCorreta) {
                    label.classList.add('correta'); // Mostra a correta
                } else if (inputSelecionado && parseInt(inputSelecionado.value) === i) {
                    label.classList.add('incorreta'); // Mostra a incorreta selecionada
                }
            });

            if (inputSelecionado && parseInt(inputSelecionado.value) === respostaCorreta) {
                pontuacao++;
            }
        });

        // Mostrar resultado
        quizResultadoContainer.innerHTML = `<h4>Você acertou ${pontuacao} de ${totalPerguntas}!</h4>`;
        quizResultadoContainer.style.display = 'block';
        quizModalVerificarBtn.style.display = 'none'; // Esconde o botão após verificar
    });

    // 6. FUNÇÕES AUXILIARES DO MODAL
    function fecharModal() {
        quizModalBackdrop.classList.remove('show');
    }

    function resetModal() {
        quizModalTitle.textContent = 'Gerando seu quiz...';
        quizLoader.style.display = 'block';
        quizPerguntasContainer.style.display = 'none';
        quizResultadoContainer.style.display = 'none';
        quizModalVerificarBtn.style.display = 'none';
        quizData = null;
    }

    function mostrarErroModal(mensagem) {
        quizModalTitle.textContent = 'Erro!';
        quizLoader.style.display = 'none';
        quizPerguntasContainer.innerHTML = `<p style="color: var(--error);">${mensagem}</p>`;
        quizPerguntasContainer.style.display = 'block';
        quizModalVerificarBtn.style.display = 'none';
    }

    // Adiciona evento de fechar a todos os botões de fechar
    closeButtons.forEach(btn => btn.addEventListener('click', fecharModal));
    quizModalBackdrop.addEventListener('click', function(e) {
        if (e.target === quizModalBackdrop) {
            fecharModal();
        }
    });

});

// Função global (antiga) para edição de comentários
function mostrarFormularioEdicao(comentarioId) {
    document.getElementById('texto-comentario-' + comentarioId).style.display = 'none';
    document.getElementById('form-editar-' + comentarioId).style.display = 'block';
}

function cancelarEdicao(comentarioId) {
    document.getElementById('texto-comentario-' + comentarioId).style.display = 'block';
    document.getElementById('form-editar-' + comentarioId).style.display = 'none';
}