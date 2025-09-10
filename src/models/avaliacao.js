import { Model, DataTypes } from 'sequelize';


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
}


export default Avaliacao;
