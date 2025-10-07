import { Usuario, Livro, Favorito, Emprestimo } from "../models/index.js";

export const showPerfil = async (req, res) => {
    try {
        const usuarioComDados = await Usuario.findByPk(req.user.id, {
            include: [
                {
                    model: Favorito,
                    as: 'favoritos',
                    include: { model: Livro, as: 'livro' }
                },
                {
                    model: Emprestimo,
                    as: 'emprestimos',
                    include: { model: Livro, as: 'livro' },
                    order: [['data_solicitacao', 'DESC']]
                }
            ]
        });

        res.render("perfil", {
            user: req.user,
            favoritos: usuarioComDados.favoritos || [],
            emprestimos: usuarioComDados.emprestimos || [],
            success: req.query.success,
            error: req.query.error
        });
    } catch (error) {
        console.error('Erro ao buscar dados do perfil:', error);
        res.render("perfil", {
            user: req.user,
            favoritos: [],
            emprestimos: [],
            error: "Erro ao carregar os seus dados."
        });
    }
};

export const atualizarPerfil = async (req, res) => {
    try {
        const { nome, sobrenome } = req.body;
        const usuarioId = req.user.id;

        if (!nome || !sobrenome) {
            return res.redirect("/perfil?error=Nome e sobrenome são obrigatórios.");
        }

        const usuario = await Usuario.findByPk(usuarioId);
        if (!usuario) {
            return res.redirect("/perfil?error=Usuário não encontrado.");
        }

        usuario.nome = nome.trim();
        usuario.sobrenome = sobrenome.trim();
        await usuario.save();

        return res.redirect("/perfil?success=Perfil atualizado com sucesso!");
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        return res.redirect("/perfil?error=Ocorreu um erro ao atualizar o perfil.");
    }
};