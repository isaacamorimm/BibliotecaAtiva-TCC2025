import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Avaliacao extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                livro_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'livros',
                        key: 'id'
                    }
                },
                usuario_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'usuarios',
                        key: 'id'
                    }
                },
                nota: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        isInt: true,
                        min: 1,
                        max: 5
                    }
                },
            },
            {
                sequelize,
                modelName: 'Avaliacao',
                tableName: 'avaliacoes',
                timestamps: true
            }
        );
    }
<<<<<<< HEAD
    static associate(models) {
        Avaliacao.belongsTo(models.Livro, {
            foreignKey: 'livro_id',
            as: 'livro'
        });
        Avaliacao.belongsTo(models.Usuario, {
            foreignKey: 'usuario_id',
            as: 'usuario'
        });
    }
=======
>>>>>>> d90929b6355d43985cdf0a38bc8c28ab2314a645
}

Avaliacao.init(sequelize);
export default Avaliacao;
