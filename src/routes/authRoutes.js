import express from "express";
import passport from "passport";
import {
  showLogin,
  logout,
  showCadastro,
  cadastro
} from "../controllers/authController.js";

const router = express.Router();

// Login
router.get("/login", showLogin);
router.post("/login", 
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login?error=Credenciais inválidas",
    failureFlash: false
  })
);

// Cadastro de usuário
router.get("/cadastro", showCadastro);
router.post("/cadastro", cadastro);

// Logout
router.get("/logout", logout);

export default router;