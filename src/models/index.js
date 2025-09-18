import sequelize from '../config/database.js';

import Livro from './livro.js';
import Usuario from './usuario.js';
import Avaliacao from './avaliacao.js';
import Comentario from './comentario.js';
import Favorito from './favorito.js';

const models = [Livro, Usuario, Avaliacao, Comentario, Favorito];

models.forEach(model => model.init(sequelize));


// 1. Associações de Avaliação
// Uma avaliação pertence a um único livro e a um único usuário
Avaliacao.belongsTo(Livro, { foreignKey: 'livro_id', as: 'livro' });
Avaliacao.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// 2. Associações de Comentário
// Um comentário pertence a um único livro e a um único usuário
Comentario.belongsTo(Livro, { foreignKey: 'livro_id', as: 'livro' });
Comentario.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// 3. Associações de Favoritados
// Um favoritado pertence a um usuário e a um único livro
Favorito.belongsTo(Livro, { foreignKey: 'livro_id', as: 'livro' });
Favorito.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// 4. Associações de Livro
// Um livro pode ter muitas avaliações, muitos comentários e muitos favoritados
Livro.hasMany(Avaliacao, { foreignKey: 'livro_id', as: 'avaliacoes' });
Livro.hasMany(Comentario, { foreignKey: 'livro_id', as: 'comentarios' });
Livro.hasMany(Favorito, {foreignKey: 'livro_id', as: 'favoritos' });

// 5. Associações de Usuário
// Um usuário pode fazer muitas avaliações, muitos comentários e favoritar muitos livros
Usuario.hasMany(Avaliacao, { foreignKey: 'usuario_id', as: 'avaliacoes' });
Usuario.hasMany(Comentario, { foreignKey: 'usuario_id', as: 'comentarios' });
Usuario.hasMany(Favorito, {foreignKey: 'usuario_id', as: 'favoritos' });



export { Livro, Usuario, Avaliacao, Comentario, Favorito };