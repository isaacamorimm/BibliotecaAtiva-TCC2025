import Livro from './livro.js';
import Usuario from './usuario.js';
import Avaliacao from './avaliacao.js';
import Comentario from './comentario.js';

// 1. Associações de Avaliação
// Uma avaliação pertence a um único livro e a um único usuário
Avaliacao.belongsTo(Livro, { foreignKey: 'livro_id', as: 'livro' });
Avaliacao.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// 2. Associações de Comentário
// Um comentário pertence a um único livro e a um único usuário
Comentario.belongsTo(Livro, { foreignKey: 'livro_id', as: 'livro' });
Comentario.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// 3. Associações de Livro
// Um livro pode ter muitas avaliações e muitos comentários
Livro.hasMany(Avaliacao, { foreignKey: 'livro_id', as: 'avaliacoes' });
Livro.hasMany(Comentario, { foreignKey: 'livro_id', as: 'comentarios' });

// 4. Associações de Usuário
// Um usuário pode fazer muitas avaliações e muitos comentários
Usuario.hasMany(Avaliacao, { foreignKey: 'usuario_id', as: 'avaliacoes' });
Usuario.hasMany(Comentario, { foreignKey: 'usuario_id', as: 'comentarios' });

export { Livro, Usuario, Avaliacao, Comentario };