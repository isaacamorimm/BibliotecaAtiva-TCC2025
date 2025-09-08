import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class Usuario extends Model {
    static init(sequelize) {
        super.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            nome: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: [0, 100],
                }
            },
            sobrenome: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: [0, 100],
                }
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                }
            },
            senha: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.STRING, 
                defaultValue: "aluno",
            },
        },
        {
            sequelize,
            modelName: 'Usuario',
        }
        );
    }
    static associate(models) {
        Usuario.hasMany(models.Livro, {
            foreignKey: 'usuario_id',
            as: 'livros'
        });
        Usuario.hasMany(models.Comentario, {
            foreignKey: 'usuario_id',
            as: 'comentarios'
        });
        Usuario.hasMany(models.Avaliacao, {
            foreignKey: 'usuario_id',
            as: 'avaliacoes'
        });
    }
}

Usuario.init(sequelize);
export default Usuario;