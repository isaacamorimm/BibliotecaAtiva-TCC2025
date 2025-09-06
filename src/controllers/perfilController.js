export const showPerfil = (req, res) => {
  res.render("perfil", {
    user: req.user
  });
};
