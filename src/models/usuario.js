import { Model, DataTypes } from "sequelize";


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
            tableName: 'usuarios',  
        }
        );
    }
}

export default Usuario;