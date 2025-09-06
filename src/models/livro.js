import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class Livro extends Model {
    static init(sequelize) {
        super.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            titulo: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [1, 255],
                }
            },
            autor: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [1, 255],
                }
            },
            ano: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: true,
                    min: 1450,
                    max: new Date().getFullYear(),
                }
            },
            disponivel: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            categoria: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [1, 100],
                }
            },
            publicado: {
                type: DataTypes.BOOLEAN,
                defaultValue: false, 
            },
            capa_url: {
                type: DataTypes.STRING,
                allowNull: true
            },
        },
        {
            sequelize,
            modelName: 'Livro',
            tableName: 'livros'
        }
        );
    }
}

Livro.init(sequelize);
export default Livro;