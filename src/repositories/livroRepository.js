import { Livro, Usuario, Avaliacao, Comentario, Favorito } from "../models/index.js";

class LivroRepository {
    async create(livroData) {
        try {
            return await Livro.create(livroData);
        } catch (error) {
            throw new Error(`Erro ao criar livro: ${error.message}`);
        }
    }

    async findAll() {
        try {
            return await Livro.findAll();
        } catch (error) {
            throw new Error(`Erro ao buscar livros: ${error.message}`);
        }
    }

    async findPublicados() {
        try {
            return await Livro.findAll({ 
                where: { publicado: true } 
            });
        } catch (error) {
            throw new Error(`Erro ao buscar livros publicados: ${error.message}`);
        }
    }

    async findNaoPublicados() {
        try {
            return await Livro.findAll({ 
                where: { publicado: false } 
            });
        } catch (error) {
            throw new Error(`Erro ao buscar livros não publicados: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            return await Livro.findByPk(id);
        } catch (error) {
            throw new Error(`Erro ao buscar livro: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const livro = await Livro.findByPk(id);
            if (!livro) {
                throw new Error("Livro não encontrado");
            }
            return await livro.destroy();
        } catch (error) {
            throw new Error(`Erro ao deletar livro: ${error.message}`);
        }
    }

    async update(id, data) {
        try {
            const livro = await Livro.findByPk(id);
            if (!livro) {
                throw new Error("Livro não encontrado");
            }
            return await livro.update(data);
        } catch (error) {
            throw new Error(`Erro ao atualizar livro: ${error.message}`);
        }
    }

    async publicarLivro(id) {
        try {
            const livro = await Livro.findByPk(id);
            if (!livro) {
                throw new Error("Livro não encontrado");
            }
            return await livro.update({ publicado: true });
        } catch (error) {
            throw new Error(`Erro ao publicar livro: ${error.message}`);
        }
    }

    async despublicarLivro(id) {
        try {
            const livro = await Livro.findByPk(id);
            if (!livro) {
                throw new Error("Livro não encontrado");
            }
            return await livro.update({ publicado: false });
        } catch (error) {
            throw new Error(`Erro ao despublicar livro: ${error.message}`);
        }
    }

    async findByIdComDetalhes(id) {
        try {

        return await Livro.findByPk(id, {
                include: [
                    {
                        model: Avaliacao,
                        as: 'avaliacoes'
                    },
                    {
                        model: Comentario,
                        as: 'comentarios', 
                        include: { 
                            model: Usuario,
                            as: 'usuario',
                            attributes: ['nome'] 
                        }
                    },
                    {
                        model: Favorito,
                        as: 'favoritos'
                    }
                ]
            });
        } catch (error) {
            throw new Error(`Erro ao buscar livro com detalhes: ${error.message}`);
        }
    }

    async findByIdComFavoritos(id) {
        try {
        // Importa os modelos necessários para a associação
        const { Usuario, Favorito } = await import('../models/index.js');

        return await Livro.findByPk(id, {
                include: [
                    {
                        model: Favorito,
                        as: 'favoritos',
                        include: {
                            model: Usuario,
                            as: 'usuario',
                            attributes: ['nome', 'email']
                        }
                    }
                ]
        })
        } catch (error) {
            throw new Error(`Erro ao buscar livro com favoritos: ${error.message}`);
        }
    }

    async adicionarFavorito(livroId, usuarioId) {
        try {
            return await Favorito.findOrCreate({
                where: {
                    livro_id: livroId,
                    usuario_id: usuarioId
                }
            });
        } catch (error) {
            throw new Error(`Erro ao adicionar favorito: ${error.message}`);
        }
    }

    async removerFavorito(livroId, usuarioId) {
        try {
            return await Favorito.destroy({
                where: {
                    livro_id: livroId,
                    usuario_id: usuarioId
                }
            });
        } catch (error) {
            throw new Error(`Erro ao remover favorito: ${error.message}`);
        }
    }

}

export default new LivroRepository();