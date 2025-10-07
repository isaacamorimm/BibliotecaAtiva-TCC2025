import { Model, DataTypes } from 'sequelize';

class Emprestimo extends Model {
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
                    references: { model: 'livros', key: 'id' }
                },
                usuario_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: { model: 'usuarios', key: 'id' }
                },
                data_solicitacao: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.NOW,
                },
                data_emprestimo: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                // Nome correto e padronizado
                data_devolucao_prevista: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                data_devolvido: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                status: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    defaultValue: 'solicitado'
                },
            },
            {
                sequelize,
                modelName: 'Emprestimo',
                tableName: 'emprestimos',
                timestamps: false
            }
        );
    }
}

export default Emprestimo;