import express from 'express';
import livroController from '../controllers/livroController.js';
import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Listar livros PUBLICADOS (acesso para todos os usuários autenticados)
router.get('/', isAuthenticated, livroController.listarLivros);

// Listar acervo (NÃO PUBLICADOS - apenas admin)
router.get('/acervo', isAuthenticated, isAdmin, livroController.listarAcervo);

// Exibir formulário para adicionar livro (apenas admin)
router.get('/adicionar', isAuthenticated, isAdmin, livroController.exibirFormularioAdicionar);

router.get('/api/buscar-capa', isAuthenticated, isAdmin, livroController.buscarCapa);

// Adicionar livro (apenas admin) - vai para o acervo (não publicado)
router.post('/adicionar', isAuthenticated, isAdmin, livroController.adicionarLivro);

// Exibir formulário para editar livro (apenas admin)
router.get('/editar/:id', isAuthenticated, isAdmin, livroController.exibirFormularioEditar);

// Atualizar livro (apenas admin)
router.post('/editar/:id', isAuthenticated, isAdmin, livroController.atualizarLivro);

// Publicar livro (apenas admin) - move do acervo para o catálogo
router.post('/publicar/:id', isAuthenticated, isAdmin, livroController.publicarLivro);

// Despublicar livro (apenas admin) - remove do catálogo
router.post('/despublicar/:id', isAuthenticated, isAdmin, livroController.despublicarLivro);

// Remover livro (apenas admin) - remove completamente
router.post('/remover/:id', isAuthenticated, isAdmin, livroController.removerLivro);

router.get('/detalhes/:id', isAuthenticated, livroController.detalhesLivro);

// Avaliar livro (usuários comuns)
router.post('/avaliar/:id', isAuthenticated, livroController.avaliarLivro);

// Comentar livro (usuários comuns)
router.post('/comentar/:id', isAuthenticated, livroController.comentarLivro);


export default router;