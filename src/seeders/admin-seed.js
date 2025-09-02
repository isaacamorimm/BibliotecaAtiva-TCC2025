import bcrypt from "bcrypt";
import Usuario from "../models/usuario.js"; 
import sequelize from "../config/database.js"; // ← Importar sequelize

async function seedAdmin() {
  try {
    // Garantir que a conexão está aberta
    await sequelize.authenticate();
    
    const nome = "Admin";
    const sobrenome = "";
    const email = "admin@etec.sp.gov.br";
    const senha = "Admin@123"; 
    const senhaHash = await bcrypt.hash(senha, 10);

    // Verifica se já existe
    const jaExiste = await Usuario.findOne({ where: { email } });
    if (jaExiste) {
      console.log("⚠️ Admin já existe. Atualizando senha...");
      
      // Atualiza a senha para o hash correto
      await Usuario.update(
        { senha: senhaHash },
        { where: { email } }
      );
      console.log("✅ Senha do admin atualizada!");
      return;
    }

    await Usuario.create({
      nome,
      sobrenome,
      email,
      senha: senhaHash, // ← Agora com hash!
      role: "admin"
    });

    console.log("✅ Admin criado com sucesso!");
  } catch (err) {
    console.error("Erro ao criar admin:", err);
  } finally {
    await sequelize.close(); // Fecha conexão
  }
}

// Execute apenas se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAdmin();
}

export default seedAdmin;