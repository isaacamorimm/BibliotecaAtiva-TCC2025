import express from "express";
import { showPerfil, atualizarPerfil } from "../controllers/perfilController.js"
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/perfil", isAuthenticated, showPerfil);
router.post("/perfil/editar", isAuthenticated, atualizarPerfil);

export default router;
