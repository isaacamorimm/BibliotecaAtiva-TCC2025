import livroRepository from "../repositories/livroRepository.js";
import axios from "axios";

class LivroController {
    async adicionarLivro(req, res) {
        try {
            const { titulo, autor, ano, categoria, capa_url } = req.body;
           const disponivel = req.body.disponivel === 'true';
            
            // Novo livro é criado como não publicado por padrão
            const novoLivro = await livroRepository.create({
                titulo, autor, ano, categoria, disponivel,
                publicado: false,
                capa_url: capa_url || null // Define como null se não fornecido
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
            const { titulo, autor, ano, categoria, capa_url } = req.body;
            const disponivel = req.body.disponivel === 'on';
            
            await livroRepository.update(id, {
                titulo, autor, ano, categoria, disponivel,
                capa_url: capa_url || null // Atualiza a capa ou define como null
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
            capaUrl: item.volumeInfo.imageLinks?.thumbnail
        })).filter(livro => livro.capaUrl); // Filtra apenas livros com capa

        res.json(livros.slice(0,5)); // Retorna no máximo 5 resultados

        } catch (error) {
            console.error('Erro ao buscar na Google Books API:', error);
            res.status(500).json({ error: 'Erro ao conectar com a API do Google Books.' });
        }
    }

}

export default new LivroController();