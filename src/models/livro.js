import { Model, DataTypes } from "sequelize";


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
            sinopse: {
                type: DataTypes.TEXT,
                allowNull: true,
                validate: {
                    notEmpty: true,
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
            quantidade_total: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
                validate: {
                    min: 0
                }
            },
            quantidade_disponivel: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
                validate: {
                    min: 0
                }
            },

            disponivel: {
                type: DataTypes.VIRTUAL,
                get() {
                    return this.quantidade_disponivel > 0;
                }
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

export default Livro;