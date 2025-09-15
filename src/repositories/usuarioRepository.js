import { Usuario, Livro, Favorito} from '../models/index.js';

class UsuarioRepository {
    async findByIdComFavoritos(id) {
        try {
            return await Usuario.findByPk(id, {
                include: [{
                    model: Favorito,
                    as: 'favoritos',
                    include: {
                        model: Livro,
                        as: 'livro',
                    },
                }, ],
            });
        } catch (error) {
            throw new Error(`Erro ao buscar usuário com favoritos: ${error.message}`);
        }
    }
}

export default new UsuarioRepository();