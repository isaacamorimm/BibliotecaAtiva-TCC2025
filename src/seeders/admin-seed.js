import bcrypt from "bcrypt";
import Usuario from "../models/usuario.js"; 

async function seedAdmin() {
  try {
    const nome = "Admin";
    const sobrenome = "";
    const email = "admin@etec.sp.gov.br";
    const senha = "Admin@123"; 
    const senhaHash = await bcrypt.hash(senha, 10);

    // Verifica se já existe
    const jaExiste = await Usuario.findOne({ where: { email } });
    if (jaExiste) {
      console.log("⚠️ Admin já existe, nada foi feito.");
      return;
    }

    await Usuario.create({
        nome,
        sobrenome,
        email,
        senha: senhaHash,
        role: "admin"
    });

    console.log("✅ Admin criado com sucesso!");
  } catch (err) {
    console.error("Erro ao criar admin:", err);
  }
}


seedAdmin();
