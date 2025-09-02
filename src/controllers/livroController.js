import livroRepository from "../repositories/livroRepository.js";

class LivroController {
    async adicionarLivro(req, res) {
        try {
            const { titulo, autor, ano, categoria } = req.body;
           const disponivel = req.body.disponivel === 'true';
            
            // Novo livro é criado como não publicado por padrão
            const novoLivro = await livroRepository.create({
                titulo, autor, ano, categoria, disponivel, publicado: false
            });
            
            res.redirect('/livros/acervo?success=Livro adicionado ao acervo com sucesso');
        } catch (error) {
            res.redirect('/livros/adicionar?error=' + encodeURIComponent(error.message));
        }
    }

    async listarLivros(req, res) {
        try {
            // Agora lista apenas livros publicados
            const livros = await livroRepository.findPublicados();
            res.render('livros', { 
                livros, 
                user: req.user,
                success: req.query.success,
                error: req.query.error
            });
        } catch (error) {
            res.render('livros', { 
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
            res.redirect('/livros/acervo?success=Livro removido com sucesso');
        } catch (error) {
            res.redirect('/livros/acervo?error=' + encodeURIComponent(error.message));
        }
    }

    async publicarLivro(req, res) {
        try {
            const { id } = req.params;
            await livroRepository.publicarLivro(id);
            res.redirect('/livros/acervo?success=Livro publicado com sucesso');
        } catch (error) {
            res.redirect('/livros/acervo?error=' + encodeURIComponent(error.message));
        }
    }

    async despublicarLivro(req, res) {
        try {
            const { id } = req.params;
            await livroRepository.despublicarLivro(id);
            res.redirect('/livros?success=Livro despublicado com sucesso');
        } catch (error) {
            res.redirect('/livros?error=' + encodeURIComponent(error.message));
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
                return res.redirect('/livros/acervo?error=Livro não encontrado');
            }
            
            res.render('editarLivro', { 
                livro,
                user: req.user,
                error: req.query.error
            });
        } catch (error) {
            res.redirect('/livros/acervo?error=' + encodeURIComponent(error.message));
        }
    }

    async atualizarLivro(req, res) {
        try {
            const { id } = req.params;
            const { titulo, autor, ano, categoria } = req.body;
            const disponivel = req.body.disponivel === 'on';
            
            await livroRepository.update(id, {
                titulo, autor, ano, categoria, disponivel
            });
            
            res.redirect('/livros/acervo?success=Livro atualizado com sucesso');
        } catch (error) {
            res.redirect('/livros/editar/' + req.params.id + '?error=' + encodeURIComponent(error.message));
        }
    }
}

export default new LivroController();