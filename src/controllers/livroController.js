import livroRepository from "../repositories/livroRepository.js";
import axios from "axios";
import { Avaliacao, Comentario, Favorito, Emprestimo } from "../models/index.js";
import { Op } from "sequelize";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

class LivroController {
    async adicionarLivro(req, res) {
        try {
            const { titulo, autor, ano, categoria, capa_url, sinopse, quantidade_total } = req.body;
            
            const novoLivro = await livroRepository.create({
                titulo, autor, ano, categoria, 
                publicado: false,
                capa_url: capa_url || null,
                sinopse: sinopse || null,
                quantidade_total: quantidade_total,
                quantidade_disponivel: quantidade_total // A quantidade disponível começa igual à total
            });
            
            res.redirect('/catalogo/acervo?success=Livro adicionado ao acervo com sucesso');
        } catch (error) {
            res.redirect('/catalogo/adicionar?error=' + encodeURIComponent(error.message));
        }
    }

    async listarLivros(req, res) {
        try {
            // Agora lista apenas livros publicados
            const livros = await livroRepository.findPublicados();
            res.render('catalogo', { 
                livros, 
                user: req.user,
                success: req.query.success,
                error: req.query.error
            });
        } catch (error) {
            res.render('catalogo', { 
                livros: [], 
                user: req.user,
                error: 'Erro ao carregar livros: ' + error.message
            });
        }
    }

    async listarAcervo(req, res) {
        try {
            // Lista livros não publicados (acervo)
            const livros = await livroRepository.findNaoPublicados();
            res.render('acervo', { 
                livros, 
                user: req.user,
                success: req.query.success,
                error: req.query.error
            });
        } catch (error) {
            res.render('acervo', { 
                livros: [], 
                user: req.user,
                error: 'Erro ao carregar acervo: ' + error.message
            });
        }
    }

    async removerLivro(req, res) {
        try {
            const { id } = req.params;
            await livroRepository.delete(id);
            res.redirect('/catalogo/acervo?success=Livro removido com sucesso');
        } catch (error) {
            res.redirect('/catalogo/acervo?error=' + encodeURIComponent(error.message));
        }
    }

    async publicarLivro(req, res) {
        try {
            const { id } = req.params;
            await livroRepository.publicarLivro(id);
            res.redirect('/catalogo/acervo?success=Livro publicado com sucesso');
        } catch (error) {
            res.redirect('/catalogo/acervo?error=' + encodeURIComponent(error.message));
        }
    }

    async despublicarLivro(req, res) {
        try {
            const { id } = req.params;
            await livroRepository.despublicarLivro(id);
            res.redirect('/catalogo?success=Livro despublicado com sucesso');
        } catch (error) {
            res.redirect('/catalogo?error=' + encodeURIComponent(error.message));
        }
    }

    async exibirFormularioAdicionar(req, res) {
        res.render('adicionarLivro', { 
            user: req.user,
            error: req.query.error
        });
    }

    async exibirFormularioEditar(req, res) {
        try {
            const { id } = req.params;
            const livro = await livroRepository.findById(id);
            
            if (!livro) {
                return res.redirect('/catalogo/acervo?error=Livro não encontrado');
            }
            
            res.render('editarLivro', { 
                livro,
                user: req.user,
                error: req.query.error
            });
        } catch (error) {
            res.redirect('/catalogo/acervo?error=' + encodeURIComponent(error.message));
        }
    }

       async atualizarLivro(req, res) {
        try {
            const { id } = req.params;
            const { titulo, autor, ano, categoria, capa_url, quantidade_total } = req.body;
            
            const livro = await livroRepository.findById(id);
            if (!livro) {
                return res.redirect('/catalogo/acervo?error=Livro não encontrado');
            }

            // Lógica para ajustar a quantidade disponível baseada na mudança da total
            const diferenca = quantidade_total - livro.quantidade_total;
            const novaQuantidadeDisponivel = livro.quantidade_disponivel + diferenca;

            await livroRepository.update(id, {
                titulo, 
                autor, 
                ano, 
                categoria, 
                capa_url: capa_url || null,
                quantidade_total: quantidade_total,
                // Garante que a quantidade disponível não seja negativa
                quantidade_disponivel: Math.max(0, novaQuantidadeDisponivel) 
            });
            
            res.redirect('/catalogo/acervo?success=Livro atualizado com sucesso');
        } catch (error) {
            res.redirect('/catalogo/editar/' + req.params.id + '?error=' + encodeURIComponent(error.message));
        }
    }


    async buscarCapa(req, res) {
        const termoBusca = req.query.q;
        if (!termoBusca) {
            return res.status(400).json({ error: 'Termo de busca não fornecido.' });
        }
        
        const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(termoBusca)}&key=${apiKey}&printType=books`;
        
        try {
            const resposta = await axios.get(url);  
            if (!resposta.data.items || resposta.data.items.length === 0) {
                return res.json([]); 
            }
        
        const livros = resposta.data.items.map(item => ({
            titulo: item.volumeInfo.title,
            autores: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Autor desconhecido',
            capaUrl: item.volumeInfo.imageLinks?.thumbnail,
            sinopse: item.volumeInfo.description || 'Sinopse não disponível'
        })).filter(livro => livro.capaUrl); 
        res.json(livros.slice(0,8)); // Retorna apenas os 8 primeiros resultados

        } catch (error) {
            if (error.response) {
                console.error('Erro detalhado da Google API:', JSON.stringify(error.response.data, null, 2));
            } else {
                console.error('Erro ao buscar na Google Books API:', error.message);
            }
            
            // Mantenha a resposta de erro
            res.status(500).json({ error: 'Erro ao conectar com a API do Google Books.' });
        }
    }


    async avaliarLivro(req, res) {
        try {
            const livroId = req.params.id;
            const usuarioId = req.user.id;
            const { nota } = req.body; // Pegamos apenas a nota

            // 1. Validação da nota
            if (!nota || nota < 1 || nota > 5) {
                return res.redirect(`/catalogo/detalhes/${livroId}?error=Nota inválida. Deve ser entre 1 e 5.`);
            }

            // 2. Usando 'upsert' para criar ou atualizar a avaliação
               const [avaliacao, foiCriado] = await Avaliacao.upsert({
                livro_id: livroId,
                usuario_id: usuarioId,
                nota: nota
            });

            return res.redirect(`/catalogo/detalhes/${livroId}?success=Avaliacao adicionada ao livro com sucesso`);


        } catch (error) {
            console.error('Erro ao avaliar livro:', error);
            return res.redirect(`/catalogo/detalhes/${req.params.id}?error=Ocorreu um erro ao salvar sua avaliação.`);
        }
    }

    async comentarLivro(req, res){
        try {
            const livroId = req.params.id;
            const usuarioId = req.user.id;
            const { texto } = req.body;

            if (!texto || texto.trim() === '') {
                return res.redirect(`/catalogo/detalhes/${livroId}?error=O comentário não pode ser vazio.`);
            }

            const novoComentario = await Comentario.create({
                livro_id: livroId,
                usuario_id: usuarioId,
                texto: texto
            });
            
            return res.redirect(`/catalogo/detalhes/${livroId}?success=Comentario adicionado ao acervo com sucesso`);

        } catch (error) {
            console.error('Erro ao comentar livro:', error);
            return res.status(500).json({ error: 'Ocorreu um erro ao salvar seu comentário.' });
        }
    }

    async detalhesLivro(req, res) {
        try {
            const { id } = req.params;
            const usuarioId = req.user.id;

            const livro = await livroRepository.findByIdComDetalhes(id);

            if (!livro) {
                return res.redirect('/catalogo?error=Livro não encontrado');
            }

            // Procura um empréstimo ativo (solicitado ou emprestado) para este livro e usuário
            const emprestimoUsuario = await Emprestimo.findOne({
                where: {
                    livro_id: id,
                    usuario_id: usuarioId,
                    status: { [Op.in]: ['solicitado', 'emprestado', 'atrasado'] }
                }
            });

            const favorito = await Favorito.findOne({
                where: { livro_id: id, usuario_id: usuarioId }
            });

            livro.comentarios.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            res.render('detalhesLivros', {
                livro,
                user: req.user,
                usuarioJaFavoritou: !!favorito,
                emprestimoUsuario: emprestimoUsuario, // Passa o empréstimo para a view
                success: req.query.success,
                error: req.query.error
            });

        } catch (error) {
            console.error("Erro ao buscar detalhes do livro:", error);
            res.redirect('/catalogo?error=' + encodeURIComponent('Erro ao carregar detalhes do livro.'));
        }
    }

    async favoritarLivro(req, res) {
        try {
            const livroId = req.params.id;
            const usuarioId = req.user.id;


            await livroRepository.adicionarFavorito(livroId, usuarioId);
            return res.redirect(`/catalogo/detalhes/${livroId}?success=Livro adicionado aos favoritos`);
        } catch (error) {
            console.error('Erro ao favoritar livro:', error);
            return res.redirect(`/catalogo/detalhes/${req.params.id}?error=Ocorreu um erro ao adicionar o livro aos favoritos.`);
        }
    }

    async desfavoritarLivro(req, res) {
        try {
            const livroId = req.params.id;
            const usuarioId = req.user.id;

            await livroRepository.removerFavorito(livroId, usuarioId);
            return res.redirect(`/catalogo/detalhes/${livroId}?success=Livro removido dos favoritos`);
        
        } catch (error) {
            console.error('Erro ao desfavoritar livro:', error);
            return res.redirect(`/catalogo/detalhes/${req.params.id}?error=Ocorreu um erro ao remover o livro dos favoritos.`);
        }
    }

   // (Dentro da classe LivroController, depois do método desfavoritarLivro)

    async editarComentario(req, res) {
        try {
            const comentarioId = req.params.id;
            const usuarioId = req.user.id;
            const { texto, livroId } = req.body;

            const comentario = await Comentario.findByPk(comentarioId);

            if (!comentario) {
                return res.redirect(`/catalogo/detalhes/${livroId}?error=Comentário não encontrado.`);
            }

            // Apenas o dono do comentário pode editar
            if (comentario.usuario_id !== usuarioId) {
                return res.redirect(`/catalogo/detalhes/${livroId}?error=Você não tem permissão para editar este comentário.`);
            }

            comentario.texto = texto;
            await comentario.save();

            return res.redirect(`/catalogo/detalhes/${livroId}?success=Comentário atualizado com sucesso.`);

        } catch (error) {
            console.error('Erro ao editar comentário:', error);
            // É importante ter o livroId no corpo do formulário para o redirecionamento em caso de erro
            return res.redirect(`/catalogo/detalhes/${req.body.livroId}?error=Ocorreu um erro ao editar seu comentário.`);
        }
    }

    async removerComentario(req, res) {
        try {
            const comentarioId = req.params.id;
            const { livroId } = req.body; // Precisamos saber para qual livro voltar

            const comentario = await Comentario.findByPk(comentarioId);

            if (comentario) {
                await comentario.destroy();
                return res.redirect(`/catalogo/detalhes/${livroId}?success=Comentário removido com sucesso.`);
            }

            return res.redirect(`/catalogo/detalhes/${livroId}?error=Comentário não encontrado.`);

        } catch (error) {
            console.error('Erro ao remover comentário:', error);
            return res.redirect(`/catalogo/detalhes/${req.body.livroId}?error=Ocorreu um erro ao remover o comentário.`);
        }
    }

async gerarQuiz(req, res) {
        let rawTextForError = "N/A";

        try {
            const livroId = req.params.id;
            const livro = await livroRepository.findById(livroId);

            if (!livro) {
                console.error(`[gerarQuiz] Livro com ID ${livroId} não encontrado.`);
                return res.status(404).json({ error: 'Livro não encontrado.' });
            }

            const prompt = `
                Você é um assistente de biblioteca criando um quiz para testar o conhecimento de um leitor.
                O livro é: "${livro.titulo}", escrito por ${livro.autor}.

                Usando seu conhecimento geral sobre esta obra (enredo, personagens, temas principais), crie 5 perguntas de múltipla escolha (com 4 opções cada) que um leitor que terminou o livro deveria saber responder.

                IMPORTANTE: As perguntas devem ser sobre o *conteúdo* do livro (plot, personagens, etc.), e NÃO sobre os metadados (como autor, título ou sinopse) que eu forneci para identificar a obra.

                Retorne APENAS um objeto JSON válido.
                NÃO inclua markdown, como \`\`\`json ou \`\`\`.
                A sua resposta DEVE começar com { e terminar com }.
                
                Siga EXATAMENTE esta estrutura:
                {
                  "tituloQuiz": "Quiz sobre ${livro.titulo}",
                  "perguntas": [
                    {
                      "pergunta": "Texto da pergunta aqui...",
                      "opcoes": ["Opção A", "Opção B", "Opção C", "Opção D"],
                      "resposta_correta_index": 0 
                    }
                    // ... (restante das perguntas)
                  ]
                }
            `;
            console.log(`[gerarQuiz] Enviando prompt para IA (Livro ID ${livroId}).`);

            let quizJSON;
            try {
                const result = await model.generateContent(prompt);
                const response = result.response;
                let text = response.text();
                
                rawTextForError = text; 

                // LÓGICA DE LIMPEZA
                const match = text.match(/\{[\s\S]*\}/);

                if (match) {
                    text = match[0];
                } else {
                    throw new Error("Nenhum objeto JSON válido (começando com { e terminando com }) foi encontrado na resposta da IA.");
                }
                
                console.log(`[gerarQuiz] Resposta crua recebida. Tentando limpar...`);
                quizJSON = JSON.parse(text); 
                console.log(`[gerarQuiz] Quiz recebido e parseado com sucesso (Livro ID ${livroId}).`);

            } catch (generationError) {
                console.error(`[gerarQuiz] Erro ao chamar ou parsear resposta da IA (Livro ID ${livroId}):`, generationError.message);
                console.error("[gerarQuiz] Resposta crua da IA:", rawTextForError);
                return res.status(500).json({
                    error: 'A IA não retornou um formato esperado. Tente novamente.',
                    raw_response: rawTextForError
                });
            }
            
            // Validar a estrutura básica do JSON recebido
            if (!quizJSON || !quizJSON.perguntas || !Array.isArray(quizJSON.perguntas) || quizJSON.perguntas.length === 0) {
                 console.error(`[gerarQuiz] Estrutura JSON inválida recebida da IA (Livro ID ${livroId}):`, quizJSON);
                 return res.status(500).json({ error: 'A IA retornou dados em um formato inesperado.' });
            }

            return res.status(200).json(quizJSON);

        } catch (error) {
            console.error(`[gerarQuiz] Erro GERAL ao gerar quiz para Livro ID ${req.params.id}:`, error);
            return res.status(500).json({ error: 'Ocorreu um erro interno ao tentar gerar o quiz.' });
        }
    }

}

export default new LivroController();
