import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Comentario extends Model {
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
                texto: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    validate: {
                        notEmpty: true,
                    }
                },
                criado_em: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.NOW,
                    timestamps: true, 
                    createdAt: 'criado_em',
                    updatedAt: 'atualizado_em'
                }
            },
            {
                sequelize,
                modelName: 'Comentario',
                tableName: 'comentarios'
            }
        );
    }
    static associate(models) {
        Comentario.belongsTo(models.Livro, {
            foreignKey: 'livro_id',
            as: 'livro'
        });
        Comentario.belongsTo(models.Usuario, {
            foreignKey: 'usuario_id',
            as: 'usuario'
        });
    }
}

Comentario.init(sequelize);
export default Comentario;  