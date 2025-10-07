import express from 'express';
import emprestimoController from '../controllers/emprestimoController.js';
import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotas para Empréstimos
router.get('/dashboard', isAuthenticated, isAdmin, emprestimoController.mostrarDashboard);

router.post('/solicitar/:livroId', isAuthenticated, emprestimoController.solicitar);

router.post('/confirmar/:emprestimoId', isAuthenticated, isAdmin, emprestimoController.confirmar);

router.post('/devolver/:emprestimoId', isAuthenticated, emprestimoController.devolver);

router.post('/cancelar/:emprestimoId', isAuthenticated, emprestimoController.cancelar);

router.post('/cancelar-solicitacao/:emprestimoId', isAuthenticated, emprestimoController.cancelarSolicitacaoUsuario);

export default router;