import { DataTypes, Model } from "sequelize";


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
            },
            {
                sequelize,
                modelName: 'Comentario',
                tableName: 'comentarios',
                timestamps: true, 
                createdAt: 'criado_em',
                updatedAt: 'atualizado_em'
            }
        );
    }
}


export default Comentario;  
