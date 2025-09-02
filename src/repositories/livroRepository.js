import Livro from "../models/livro.js";

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
}

export default new LivroRepository();