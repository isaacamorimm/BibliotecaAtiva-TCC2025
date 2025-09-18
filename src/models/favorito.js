import { DataTypes, Model} from 'sequelize';

class Favorito extends Model {
    static init(sequelize) {
        super.init (
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },

                usuario_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'usuarios',
                        key: 'id'
                    }
                },
                livro_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'livros',
                        key: 'id'
                    }
                },
                
            },
            
            {      sequelize,
                    modelName: 'Favorito',
                    tableName:'favoritos',
                    timeStamps: true
                    
            }
        );

    }
}

export default Favorito;