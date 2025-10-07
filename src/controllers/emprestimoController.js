import { Emprestimo, Livro, Usuario } from '../models/index.js';
import { Op } from 'sequelize';

class EmprestimoController {
    async mostrarDashboard(req, res) {
        try {
            const emprestimos = await Emprestimo.findAll({
                include: ['livro', 'usuario'],
                order: [['data_solicitacao', 'DESC']]
            });
            res.render('admin/dashboard', {
                user: req.user,
                emprestimos,
                error: req.query.error,
                success: req.query.success
            });
        } catch (error) {
            console.error("Erro ao carregar dashboard:", error);
            res.redirect('/home?error=Ocorreu um erro ao carregar o dashboard.');
        }
    }

    async solicitar(req, res) {
        const { livroId } = req.params;
        const usuarioId = req.user.id;

        try {
            const livro = await Livro.findByPk(livroId);
            if (!livro || livro.quantidade_disponivel < 1) {
                return res.redirect(`/catalogo/detalhes/${livroId}?error=Livro indisponível para empréstimo.`);
            }

            const emprestimoExistente = await Emprestimo.findOne({
                where: {
                    livro_id: livroId,
                    usuario_id: usuarioId,
                    status: { [Op.or]: ['solicitado', 'emprestado', 'atrasado'] }
                }
            });

            if (emprestimoExistente) {
                return res.redirect(`/catalogo/detalhes/${livroId}?error=Você já tem uma solicitação ou empréstimo ativo para este livro.`);
            }

            await Emprestimo.create({
                livro_id: livro.id,
                usuario_id: usuarioId,
                status: 'solicitado'
            });

            return res.redirect(`/catalogo/detalhes/${livroId}?success=Solicitação realizada! Dirija-se à biblioteca para retirar o livro.`);
        } catch (error) {
            return res.redirect(`/catalogo/detalhes/${livroId}?error=Erro ao solicitar empréstimo.`);
        }
    }

    async confirmar(req, res) {
        const { emprestimoId } = req.params;
        try {
            const emprestimo = await Emprestimo.findByPk(emprestimoId, { include: ['livro'] });
            if (!emprestimo || emprestimo.status !== 'solicitado') {
                return res.redirect('/emprestimo/dashboard?error=Solicitação não encontrada ou já processada.');
            }

            const livro = emprestimo.livro;
            if (livro.quantidade_disponivel < 1) {
                return res.redirect('/emprestimo/dashboard?error=Livro não está mais disponível no estoque.');
            }
            livro.quantidade_disponivel -= 1;
            await livro.save();

            const dataDevolucao = new Date();
            dataDevolucao.setDate(dataDevolucao.getDate() + 15);

            emprestimo.status = 'emprestado';
            emprestimo.data_emprestimo = new Date();
            emprestimo.data_devolucao_prevista = dataDevolucao;
            await emprestimo.save();

            return res.redirect('/emprestimo/dashboard?success=Empréstimo confirmado.');
        } catch (error) {
            return res.redirect('/emprestimo/dashboard?error=Erro ao confirmar empréstimo.');
        }
    }
    
    async devolver(req, res) {
        const { emprestimoId } = req.params;
        try {
            const emprestimo = await Emprestimo.findByPk(emprestimoId, { include: ['livro'] });
            if (!emprestimo) {
                return res.redirect('/emprestimo/dashboard?error=Empréstimo não encontrado.');
            }

            emprestimo.status = 'devolvido';
            emprestimo.data_devolvido = new Date();
            await emprestimo.save();

            const livro = emprestimo.livro;
            livro.quantidade_disponivel += 1;
            await livro.save();
            
            return res.redirect('/emprestimo/dashboard?success=Devolução registrada.');
        } catch (error) {
            return res.redirect('/emprestimo/dashboard?error=Erro ao registrar devolução.');
        }
    }

    async cancelar(req, res) {
        const { emprestimoId } = req.params;
        try {
            const emprestimo = await Emprestimo.findByPk(emprestimoId);
            if (!emprestimo) {
                return res.redirect('/emprestimo/dashboard?error=Solicitação não encontrada.');
            }
            
            await emprestimo.destroy();

            return res.redirect('/emprestimo/dashboard?success=Solicitação cancelada.');
        } catch (error) {
             return res.redirect('/emprestimo/dashboard?error=Erro ao cancelar solicitação.'); 
        }
    }

        async cancelarSolicitacaoUsuario(req, res) {
        const { emprestimoId } = req.params;
        const usuarioId = req.user.id;
        let livroId;

        try {
            const emprestimo = await Emprestimo.findByPk(emprestimoId);

            if (!emprestimo) {
                return res.redirect('/perfil?error=Solicitação não encontrada.');
            }
            
            livroId = emprestimo.livro_id; // Guarda o ID do livro para redirecionar de volta

            // Medida de segurança: garante que só o dono da solicitação pode cancelar
            if (emprestimo.usuario_id !== usuarioId) {
                return res.redirect(`/catalogo/detalhes/${livroId}?error=Você não tem permissão para cancelar esta solicitação.`);
            }

            // Apenas remove o registro da solicitação. Não mexe na quantidade de livros.
            await emprestimo.destroy();

            return res.redirect(`/catalogo/detalhes/${livroId}?success=Sua solicitação foi cancelada.`);
        } catch (error) {
            const redirectUrl = livroId ? `/catalogo/detalhes/${livroId}` : '/perfil';
            return res.redirect(`${redirectUrl}?error=Ocorreu um erro ao cancelar a solicitação.`);
        }
    }
}

export default new EmprestimoController();