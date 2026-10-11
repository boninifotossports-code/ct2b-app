import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("A iniciar o registo do utilizador administrador...");

  // Apaga registo antigo se existir
  await prisma.usuario.deleteMany({
    where: { usuario: "prof.arthur" },
  });

  // Cria o utilizador
  const user = await prisma.usuario.create({
    data: {
      nome: "Professor Arthur",
      usuario: "prof.arthur",
      senha: "123",
      role: "PROFESSOR",
      telefone: "21999999999",
    },
  });

  console.log("SUCESSO: Utilizador criado com sucesso na base de dados!");
  console.log(user);
}

main()
  .catch((e) => {
    console.error("ERRO AO CRIAR UTILIZADOR:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });