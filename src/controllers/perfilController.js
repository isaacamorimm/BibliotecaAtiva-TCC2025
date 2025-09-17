import usuarioRepository from "../repositories/usuarioRepository.js";
import { Usuario } from "../models/index.js";

  export const showPerfil = async (req, res) => {
    try {
      const usuarioComFavoritos = await usuarioRepository.findByIdComFavoritos(
        req.user.id);
        res.render("perfil", {
          user: req.user,
          favoritos: usuarioComFavoritos.favoritos || [],
          success: req.query.success,
          error: req.query.error
          });
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
      res.render("perfil", {
        user: req.user,
        favoritos: [],
        error: "Erro ao carregar favoritos"
      });
    }

}

// NOVA FUNÇÃO para atualizar o perfil
export const atualizarPerfil = async (req, res) => {
  try {
    const { nome, sobrenome } = req.body;
    const usuarioId = req.user.id;

    // 1. Validação: Garante que os campos não estão vazios
    if (!nome || !sobrenome) {
      return res.redirect("/perfil?error=Nome e sobrenome são obrigatórios.");
    }

    // 2. Encontrar o usuário no banco de dados
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
       return res.redirect("/perfil?error=Usuário não encontrado.");
    }

    // 3. Atualizar as informações
    usuario.nome = nome.trim();
    usuario.sobrenome = sobrenome.trim();

    // 4. Salvar no banco de dados
    await usuario.save();

    // 5. Redirecionar com mensagem de sucesso
    return res.redirect("/perfil?success=Perfil atualizado com sucesso!");

  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return res.redirect("/perfil?error=Ocorreu um erro ao atualizar o perfil.");
  }
};