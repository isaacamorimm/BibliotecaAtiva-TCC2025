import bcrypt from "bcrypt";
import Usuario from "../models/usuario.js";

export const showLogin = (req, res) => {
  res.render("login", { 
    error: req.query.error,
    success: req.query.success
  });
};

// -------------------- CADASTRO  --------------------
export const showCadastro = (req, res) => {
  res.render("cadastro", { 
    error: req.query.error, 
    form: { email: req.query.email || "" } 
  });
};

export const cadastro = async (req, res) => {
  try {
    let { email, senha, confirmarSenha, nome, sobrenome } = req.body;

    // Normalizações básicas
    email = (email || "").trim().toLowerCase();
    nome = (nome || "").trim();        
    sobrenome = (sobrenome || "").trim();

    // 1) Validações
    if (!email || !senha || !confirmarSenha || !nome || !sobrenome) {
      return res.render("cadastro", { 
        error: "Preencha todos os campos.", 
        form: { email } 
      });
    }

    if (!/@etec\.sp\.gov\.br$/i.test(email)) {
      return res.render("cadastro", { 
        error: "Use apenas email @etec.sp.gov.br.", 
        form: { email } 
      });
    }

    // Validação de força da senha
    const regexSenhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!regexSenhaForte.test(senha)) {
      return res.render("cadastro", { 
        error: "A senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e símbolo.", 
        form: { email } 
      });
    }

    // Verifica se senhas coincidem
    if (senha !== confirmarSenha) {
      return res.render("cadastro", { 
        error: "As senhas não coincidem.", 
        form: { email } 
      });
    }

    // 2) Verifica duplicidade
    const jaExiste = await Usuario.findOne({ where: { email } });
    if (jaExiste) {
      return res.render("cadastro", { 
        error: "Email já cadastrado.", 
        form: { email } 
      });
    }

    // 3) Gera hash da senha
    const hash = await bcrypt.hash(senha, 10);

    // 4) Cria usuário no banco
    const novoUsuario = await Usuario.create({
      nome,        
      sobrenome,   
      email,
      senha: hash,
      role: email === "admin@etec.sp.gov.br" ? "admin" : "aluno"
    });

    // 5) Redireciona para login com mensagem de sucesso
    return res.redirect("/login?success=Conta criada com sucesso. Faça login.");

  } catch (err) {
    console.error("Erro no cadastro:", err);
    
    const msg = err?.name === "SequelizeUniqueConstraintError"
      ? "Email já cadastrado."
      : "Erro ao cadastrar. Tente novamente.";
    return res.render("cadastro", { 
      error: msg, 
      form: { email: req.body.email } 
    });
  }
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.redirect("/home?error=Erro ao fazer logout");
    }
    res.redirect("/login?success=Logout realizado com sucesso");
  });
};