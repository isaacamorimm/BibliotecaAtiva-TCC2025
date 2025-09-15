import usuarioRepository from "../repositories/usuarioRepository.js";

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
};