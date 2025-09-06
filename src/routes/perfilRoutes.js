import express from "express";
import { showPerfil } from "../controllers/perfilController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/perfil", isAuthenticated, showPerfil);

export default router;
