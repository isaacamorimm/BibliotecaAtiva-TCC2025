import express from 'express';
import livroController from '../controllers/livroController.js';
import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', isAuthenticated, livroController.listarLivros);

router.get('/acervo', isAuthenticated, isAdmin, livroController.listarAcervo);

router.get('/adicionar', isAuthenticated, isAdmin, livroController.exibirFormularioAdicionar);

router.get('/api/buscar-capa', isAuthenticated, isAdmin, livroController.buscarCapa);

router.post('/adicionar', isAuthenticated, isAdmin, livroController.adicionarLivro);

router.get('/editar/:id', isAuthenticated, isAdmin, livroController.exibirFormularioEditar);

router.post('/editar/:id', isAuthenticated, isAdmin, livroController.atualizarLivro);

router.post('/publicar/:id', isAuthenticated, isAdmin, livroController.publicarLivro);

router.post('/despublicar/:id', isAuthenticated, isAdmin, livroController.despublicarLivro);

router.post('/remover/:id', isAuthenticated, isAdmin, livroController.removerLivro);

router.get('/detalhes/:id', isAuthenticated, livroController.detalhesLivro);

router.post('/avaliar/:id', isAuthenticated, livroController.avaliarLivro);

router.post('/comentar/:id', isAuthenticated, livroController.comentarLivro);


export default router;
