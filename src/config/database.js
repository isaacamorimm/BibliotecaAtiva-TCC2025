import { Sequelize } from 'sequelize';

// Configuração do Sequelize com importação dinâmica do pg
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  dialectModule: await import('pg').then(mod => mod.default) // ← Adicione esta linha
});

export default sequelize;