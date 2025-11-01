import express from 'express';
import livroController from '../controllers/livroController.js';
import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rota para listar livros (página inicial)
router.get('/', isAuthenticated, livroController.listarLivros);

// Rotas protegidas para administradores
router.get('/acervo', isAuthenticated, isAdmin, livroController.listarAcervo);
router.get('/adicionar', isAuthenticated, isAdmin, livroController.exibirFormularioAdicionar);
router.get('/api/buscar-capa', isAuthenticated, isAdmin, livroController.buscarCapa);
router.post('/adicionar', isAuthenticated, isAdmin, livroController.adicionarLivro);
router.get('/editar/:id', isAuthenticated, isAdmin, livroController.exibirFormularioEditar);
router.post('/editar/:id', isAuthenticated, isAdmin, livroController.atualizarLivro);
router.post('/publicar/:id', isAuthenticated, isAdmin, livroController.publicarLivro);
router.post('/despublicar/:id', isAuthenticated, isAdmin, livroController.despublicarLivro);
router.post('/remover/:id', isAuthenticated, isAdmin, livroController.removerLivro);

// Rotas acessíveis para todos os usuários autenticados
router.get('/detalhes/:id', isAuthenticated, livroController.detalhesLivro);
router.post('/avaliar/:id', isAuthenticated, livroController.avaliarLivro);
router.post('/comentar/:id', isAuthenticated, livroController.comentarLivro);

// Rotas para favoritar e desfavoritar livros
router.post('/comentario/editar/:id', isAuthenticated, livroController.editarComentario);
router.post('/comentario/remover/:id', isAuthenticated, isAdmin, livroController.removerComentario);

// Rotas para favoritar e desfavoritar livros
router.post('/favoritar/:id', isAuthenticated, livroController.favoritarLivro);
router.post('/desfavoritar/:id', isAuthenticated, livroController.desfavoritarLivro);

// Rota para gerar quiz do livro
router.post('/livro/:id/gerar-quiz', isAuthenticated, livroController.gerarQuiz);

export default router;
