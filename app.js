import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./src/config/database.js";
import Usuario from "./src/models/usuario.js";
import authRoutes from "./src/routes/authRoutes.js";
import livroRoutes from './src/routes/livroRoutes.js';
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import livroRepository from "./src/repositories/livroRepository.js";


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hora
  })
);

// Inicialize o Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuração da estratégia local do Passport
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'senha'
}, async (email, senha, done) => {
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return done(null, false, { message: 'Usuário não encontrado.' });
    }
    
    // Verificar a senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return done(null, false, { message: 'Senha incorreta.' });
    }
    
    return done(null, usuario);
  } catch (error) {
    return done(error);
  }
}));

// Serialização do usuário
passport.serializeUser((usuario, done) => {
  done(null, usuario.id);
});

// Desserialização do usuário
passport.deserializeUser(async (id, done) => {
  try {
    const usuario = await Usuario.findByPk(id);
    done(null, usuario);
  } catch (error) {
    done(error);
  }
});

// Middleware personalizado para verificar autenticação
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Middleware para verificar se é admin
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(403).send("Acesso negado. Apenas administradores podem realizar esta ação.");
}

// Tornar os middlewares disponíveis para as rotas
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});

app.get('/', (req, res) => {
  res.redirect('/login');
});

// Rotas
app.use("/", authRoutes);

// Página inicial protegida
app.get("/home", isAuthenticated, async (req, res) => {
  try {
    const livros = await livroRepository.findAll();
    
    res.render("home", {
      user: req.user,
      livros: livros || [], 
      success: req.query.success,
      error: req.query.error
    });
  } catch (error) {
    console.error("Erro ao carregar livros para home:", error);
    res.render("home", {
      user: req.user,
      livros: [],
      error: "Erro ao carregar livros"
    });
  }
});

// Rota para livros com autenticação
app.use('/livros', isAuthenticated, livroRoutes);

// Sincroniza models com o banco
sequelize.sync()
  .then(() => console.log("Banco sincronizado!"))
  .catch(err => console.error("Erro ao sincronizar o banco:", err));

export default app;